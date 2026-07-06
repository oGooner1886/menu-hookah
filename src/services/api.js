import productsGustoFallback from '../productsJSON.json';
import productsAromaFallback from '../productsJSON_aroma.json';

const STRAPI_URL = process.env.REACT_APP_STRAPI_URL || 'http://localhost:1337';

const normalizeProduct = (item) => {
  if (item.uid !== undefined) {
    return item;
  }

  const attrs = item.attributes || item;
  return {
    uid: attrs.uid,
    title: attrs.title,
    price: attrs.price,
    descr: attrs.descr || '',
    gallery: attrs.gallery || '',
    category: attrs.category,
    portion: attrs.portion,
    editions: attrs.editions || null,
    sauce: attrs.sauce || null,
  };
};

const normalizeProducts = (data) => {
  if (!Array.isArray(data)) return [];
  return data.map(normalizeProduct);
};

const fetchFromStrapi = async (branch) => {
  const params = new URLSearchParams({
    'filters[branch][$eq]': branch,
    'pagination[pageSize]': '500',
    sort: 'uid:asc',
  });

  const response = await fetch(`${STRAPI_URL}/api/products?${params}`, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Strapi responded with ${response.status}`);
  }

  const json = await response.json();
  const items = json.data ?? json;
  return normalizeProducts(items);
};

export const fetchProducts = async (branch) => {
  try {
    const products = await fetchFromStrapi(branch);
    if (products.length > 0) {
      return { products, source: 'strapi' };
    }
  } catch (error) {
    console.warn(`Strapi unavailable for branch "${branch}", using local JSON:`, error.message);
  }

  const fallback = branch === 'aroma' ? productsAromaFallback : productsGustoFallback;
  return { products: fallback, source: 'local' };
};

export const fetchAllMenus = async () => {
  const [gusto, aroma] = await Promise.all([fetchProducts('gusto'), fetchProducts('aroma')]);

  return {
    productsGusto: gusto.products,
    productsAroma: aroma.products,
    sources: { gusto: gusto.source, aroma: aroma.source },
  };
};
