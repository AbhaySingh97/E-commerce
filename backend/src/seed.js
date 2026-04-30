import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/User.js';
import { Category } from './models/Category.js';
import { Product } from './models/Product.js';

dotenv.config();

const parentCategories = [
  'Electronics', 'Fashion', 'Home & Garden', 'Sports & Outdoors'
];

const templates = [
  { name: 'Apple iPhone 15 Pro', sub: 'Smartphones', parent: 'Electronics', img: '1511707171634-5f897ff02aa9', price: 129900 },
  { name: 'MacBook Air M3', sub: 'Laptops', parent: 'Electronics', img: '1517336714731-48b2504644a6', price: 114900 },
  { name: 'Sony WH-1000XM5', sub: 'Audio', parent: 'Electronics', img: '1505740420928-5e560c06d30e', price: 29990 },
  { name: 'Nike Air Max Pulse', sub: 'Shoes', parent: 'Fashion', img: '1542291026-7eec264c27ff', price: 12995 },
  { name: 'Prada Cleo Handbag', sub: 'Bags', parent: 'Fashion', img: '1584917865442-de89df76afd3', price: 215000 },
  { name: 'Apple Watch Ultra 2', sub: 'Wearables', parent: 'Electronics', img: '1523275335684-37898b6baf30', price: 89900 },
  { name: 'Stovetop Coffee Maker', sub: 'Kitchen', parent: 'Home & Garden', img: '1583847268964-b28dc2f51ac9', price: 4999 },
  { name: 'Chanel No. 5 Perfume', sub: 'Beauty', parent: 'Fashion', img: '1594035910387-fea47794261f', price: 14500 },
  { name: 'Artemide Tolomeo Lamp', sub: 'Lighting', parent: 'Home & Garden', img: '1534073828943-f43b351717b3', price: 24900 },
  { name: 'Canon EOS R5 DSLR', sub: 'Cameras', parent: 'Electronics', img: '1516035069371-29a1b244cc32', price: 339995 },
  { name: 'Keychron Q1 Keyboard', sub: 'Accessories', parent: 'Electronics', img: '1511467687858-23d96c32e4ae', price: 15999 },
  { name: 'Ray-Ban Wayfarer Classic', sub: 'Eyewear', parent: 'Fashion', img: '1572635196237-14b3f281503f', price: 10990 },
  { name: 'Sonos Era 300 Speaker', sub: 'Smart Home', parent: 'Electronics', img: '1589492477829-5e65395b66cc', price: 44900 },
  { name: 'Lululemon Reversible Mat', sub: 'Fitness', parent: 'Sports & Outdoors', img: '1517836357463-d25dfeac3438', price: 7800 },
  { name: 'Montblanc Wallet', sub: 'Accessories', parent: 'Fashion', img: '1627123430374-1edee176a052', price: 32000 },
  { name: 'Oral-B iO Toothbrush', sub: 'Personal Care', parent: 'Home & Garden', img: '1559591932-e88c7d63633c', price: 25999 },
  { name: 'Junghans Max Bill Clock', sub: 'Decor', parent: 'Home & Garden', img: '1563851010515-2fe9842e6a73', price: 45000 },
  { name: 'Minimalist Ceramic Vase', sub: 'Decor', parent: 'Home & Garden', img: '1581783898377-1c85bc2bab11', price: 8500 },
  { name: 'Diptyque Baies Candle', sub: 'Home Fragrance', parent: 'Home & Garden', img: '1603006328328-9d109c210f60', price: 6200 },
  { name: 'Rimowa Cabin Suitcase', sub: 'Travel', parent: 'Sports & Outdoors', img: '1565026057447-bc90a3dceb87', price: 115000 }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🚀 Connected to MongoDB Atlas');

    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('🧹 Cleared data');

    const catMap = {};
    for (const parent of parentCategories) {
      const p = await Category.create({ name: parent, slug: parent.toLowerCase().replace(/ /g, '-'), isActive: true });
      catMap[parent] = p;
    }

    const subMap = {};
    for (const t of templates) {
      if (!subMap[t.sub]) {
        subMap[t.sub] = await Category.create({
          name: t.sub,
          slug: t.sub.toLowerCase().replace(/ /g, '-'),
          parent: catMap[t.parent]._id,
          isActive: true
        });
      }
    }

    console.log('🛍️ Seeding products...');
    const productsToInsert = templates.map((t, i) => ({
      name: t.name,
      slug: t.name.toLowerCase().replace(/ /g, '-'),
      SKU: `LUXE-${i}-${Math.random().toString(36).substring(5).toUpperCase()}`,
      description: `Premium ${t.name}. Expertly crafted for those who demand the finest.`,
      brand: t.name.split(' ')[0],
      category: subMap[t.sub]._id,
      status: 'active',
      isFeatured: true,
      price: t.price,
      originalPrice: t.price + 5000,
      stock: 50,
      images: [`https://images.unsplash.com/photo-${t.img}?auto=format&fit=crop&q=80&w=800`],
      attributes: { quality: 'Premium' }
    }));

    // Variations with unique images where possible
    const variations = [
        { name: 'Chanel No. 5 (Exclusive)', img: '1592945403244-b3fbafd7f539', price: 21750, sub: 'Beauty' },
        { name: 'Artemide Tolomeo (Gold Edition)', img: '1506332046475-5067d5284273', price: 37350, sub: 'Lighting' },
        { name: 'iPhone 15 Pro (Titanium)', img: '1511707171634-5f897ff02aa9', price: 149900, sub: 'Smartphones' },
        { name: 'Nike Air Max (Black)', img: '1549298916-b41d501d3772', price: 15995, sub: 'Shoes' }
    ];

    variations.forEach((v, i) => {
        productsToInsert.push({
            name: v.name,
            slug: v.name.toLowerCase().replace(/ /g, '-'),
            SKU: `LUXE-VAR-${i}`,
            description: `An exclusive version of our flagship product.`,
            brand: v.name.split(' ')[0],
            category: subMap[v.sub]._id,
            status: 'active',
            isFeatured: false,
            price: v.price,
            originalPrice: v.price + 10000,
            stock: 5,
            images: [`https://images.unsplash.com/photo-${v.img}?auto=format&fit=crop&q=80&w=800`],
            attributes: { type: 'Exclusive' }
        });
    });

    await Product.insertMany(productsToInsert);

    console.log('✨ SEED COMPLETE!');
    process.exit(0);
  } catch (error) {
    console.error('❌ error:', error);
    process.exit(1);
  }
}

seedDatabase();
