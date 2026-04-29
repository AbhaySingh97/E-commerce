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
  { name: 'iPhone 15 Pro', sub: 'Smartphones', parent: 'Electronics', img: '1511707171634-5f897ff02aa9' },
  { name: 'MacBook Air M3', sub: 'Laptops', parent: 'Electronics', img: '1496181133206-80ce9b88a853' },
  { name: 'Sony WH-1000XM5', sub: 'Audio', parent: 'Electronics', img: '1505740420928-5e560c06d30e' },
  { name: 'Nike Air Max', sub: 'Shoes', parent: 'Fashion', img: '1542291026-7eec264c27ff' },
  { name: 'Designer Handbag', sub: 'Bags', parent: 'Fashion', img: '1584917865442-de89df76afd3' },
  { name: 'Apple Watch Ultra', sub: 'Wearables', parent: 'Electronics', img: '1523275335684-37898b6baf30' },
  { name: 'Ceramic Coffee Maker', sub: 'Kitchen', parent: 'Home & Garden', img: '1583847268964-b28dc2f51ac9' },
  { name: 'Luxury Perfume', sub: 'Beauty', parent: 'Fashion', img: '1541795795-341448bb1043' },
  { name: 'Modern Desk Lamp', sub: 'Lighting', parent: 'Home & Garden', img: '1534073828943-f43b351717b3' },
  { name: 'Professional DSLR', sub: 'Cameras', parent: 'Electronics', img: '1516035069371-29a1b244cc32' },
  { name: 'Mechanical Keyboard', sub: 'Accessories', parent: 'Electronics', img: '1511467687858-23d96c32e4ae' },
  { name: 'Designer Sunglasses', sub: 'Eyewear', parent: 'Fashion', img: '1572635196237-14b3f281503f' },
  { name: 'Smart Home Speaker', sub: 'Smart Home', parent: 'Electronics', img: '1589492477829-5e65395b66cc' },
  { name: 'Premium Yoga Mat', sub: 'Fitness', parent: 'Sports & Outdoors', img: '1517836357463-d25dfeac3438' },
  { name: 'Leather Wallet', sub: 'Accessories', parent: 'Fashion', img: '1627123430374-1edee176a052' },
  { name: 'Electric Toothbrush', sub: 'Personal Care', parent: 'Home & Garden', img: '1559591932-e88c7d63633c' },
  { name: 'Minimalist Wall Clock', sub: 'Decor', parent: 'Home & Garden', img: '1563851010515-2fe9842e6a73' },
  { name: 'Ceramic Table Vase', sub: 'Decor', parent: 'Home & Garden', img: '1581783898377-1c85bc2bab11' },
  { name: 'Scented Candle Set', sub: 'Home Fragrance', parent: 'Home & Garden', img: '1603006328328-9d109c210f60' },
  { name: 'Hard Shell Suitcase', sub: 'Travel', parent: 'Sports & Outdoors', img: '1565026057447-bc90a3dceb87' }
];

async function seedMassiveDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🚀 Connected to MongoDB Atlas');

    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('🧹 Cleared data');

    const adminExists = await User.findOne({ email: 'admin@luxecart.com' });
    if (!adminExists) {
      await User.create({
        email: 'admin@luxecart.com',
        password: 'admin123',
        name: 'Admin User',
        role: 'admin',
        isVerified: true
      });
      console.log('👤 Created admin user: admin@luxecart.com / admin123');
    }

    const userExists = await User.findOne({ email: 'user@luxecart.com' });
    if (!userExists) {
      await User.create({
        email: 'user@luxecart.com',
        password: 'user123',
        name: 'Test User',
        role: 'customer',
        isVerified: true
      });
      console.log('👤 Created test user: user@luxecart.com / user123');
    }

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

    // 2. Generate 2000 Products from Templates
    const TOTAL = 2000;
    const BATCH = 100;
    console.log(`🛍️ Cloning ${TOTAL} products from Master Templates...`);

    for (let i = 0; i < TOTAL; i += BATCH) {
      const products = [];
      for (let j = 0; j < BATCH; j++) {
        const id = i + j;
        const template = templates[id % templates.length];
        const price = Math.floor(Math.random() * 50000) + 1000;
        
        products.push({
          name: `${template.name} - Edition #${id}`,
          slug: `${template.name.toLowerCase().replace(/ /g, '-')}-${id}`,
          SKU: `SKU-${id}-${Math.random().toString(36).substring(5).toUpperCase()}`,
          description: `Premium ${template.name}. Guaranteed luxury and performance. Edition ${id}.`,
          brand: template.name.split(' ')[0],
          category: subMap[template.sub]._id,
          status: 'active',
          isFeatured: id < 40,
          price: price,
          originalPrice: price + 2000,
          stock: 100,
          images: [`https://images.unsplash.com/photo-${template.img}?auto=format&fit=crop&q=80&w=800&sig=${id}`],
          attributes: { edition: id }
        });
      }
      await Product.insertMany(products);
      process.stdout.write('.');
    }

    console.log('\n\n✨ CLONE SEED COMPLETE!');
    process.exit(0);
  } catch (error) {
    console.error('❌ error:', error);
    process.exit(1);
  }
}

seedMassiveDatabase();
