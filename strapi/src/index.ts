import type { Core } from '@strapi/strapi';
import fs from 'fs';
import path from 'path';

type RawProduct = {
  uid: number;
  title: string;
  price?: number;
  descr?: string;
  gallery?: string;
  category?: string;
  portion?: number;
  editions?: unknown;
  sauce?: unknown;
};

const loadJson = (fileName: string): RawProduct[] => {
  const filePath = path.join(process.cwd(), 'seed', fileName);
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

const seedBranch = async (strapi: Core.Strapi, branch: 'gusto' | 'aroma', fileName: string) => {
  const products = loadJson(fileName);

  for (const product of products) {
    const existing = await strapi.db.query('api::product.product').findOne({
      where: { uid: product.uid, branch },
    });

    if (existing) continue;

    await strapi.db.query('api::product.product').create({
      data: {
        uid: product.uid,
        title: product.title,
        price: product.price ?? 0,
        descr: product.descr ?? '',
        gallery: product.gallery ?? '',
        category: product.category ?? 'other',
        branch,
        portion: product.portion ?? null,
        editions: product.editions ?? null,
        sauce: product.sauce ?? null,
      },
    });
  }
};

const enablePublicAccess = async (strapi: Core.Strapi) => {
  const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({
    where: { type: 'public' },
  });

  if (!publicRole) return;

  const actions = ['api::product.product.find', 'api::product.product.findOne'];

  for (const action of actions) {
    const existing = await strapi.db.query('plugin::users-permissions.permission').findOne({
      where: { action, role: publicRole.id },
    });

    if (!existing) {
      await strapi.db.query('plugin::users-permissions.permission').create({
        data: { action, role: publicRole.id },
      });
    }
  }
};

export default {
  register() {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await enablePublicAccess(strapi);

    const count = await strapi.db.query('api::product.product').count();
    if (count > 0) return;

    await seedBranch(strapi, 'gusto', 'products-gusto.json');
    await seedBranch(strapi, 'aroma', 'products-aroma.json');
    strapi.log.info('Menu products seeded from JSON');
  },
};
