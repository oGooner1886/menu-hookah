export function transformMenu(rawMenu) {
  if (!rawMenu || !rawMenu.itemsGroups) return [];

  return rawMenu.itemsGroups
    .map((group) => {
      const items = (group.items || [])
        .map((item) => {
          const defaultSize =
            item.sizePrices?.find((s) => s.isDefault) ?? item.sizePrices?.[0];
          const image =
            item.imageLinks && item.imageLinks.length > 0
              ? item.imageLinks[0]
              : null;

          return {
            id: item.productId,
            sku: defaultSize?.sku ?? null,
            name: item.name,
            description: item.description || '',
            image,
            price: defaultSize?.price ?? 0,
            weight: defaultSize?.weight ?? null,
          };
        })
        .filter((item) => item.price > 0);

      return {
        id: group.id,
        name: group.name,
        order: group.order ?? 0,
        items,
      };
    })
    .filter((group) => group.items.length > 0)
    .sort((a, b) => a.order - b.order);
}