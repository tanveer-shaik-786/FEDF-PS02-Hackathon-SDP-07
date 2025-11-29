const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Item = require('./models/Item');

// Sample craft items data
const sampleCraftItems = [
  {
    id: 1,
    name: 'Handwoven Basket',
    price: 450,
    description: 'Traditional handwoven basket made from natural fibers',
    // Use a stable public asset path; place matching images in frontend `public/assets`
    image: '/assets/handwoven-basket.jpg',
    category: 'Home Decor',
    artist: 'Ramesh Kumar',
    stock: 5,
    approved: true
  },
  {
    id: 2,
    name: 'Ceramic Pottery Vase',
    price: 800,
    description: 'Elegant ceramic vase with traditional patterns',
    image: '/assets/ceramic-pottery-vase.jpg',
    category: 'Home Decor',
    artist: 'Priya Sharma',
    stock: 3,
    approved: true
  },
  {
    id: 3,
    name: 'Embroidered Wall Hanging',
    price: 1200,
    description: 'Beautiful embroidered wall art featuring folk motifs',
    image: '/assets/embroidered-wall-hanging.jpg',
    category: 'Wall Art',
    artist: 'Lakshmi Devi',
    stock: 2,
    approved: true
  },
  {
    id: 4,
    name: 'Wooden Carved Box',
    price: 650,
    description: 'Intricately carved wooden jewelry box',
    image: '/assets/wooden-carved-box.jpg',
    category: 'Storage',
    artist: 'Mohan Lal',
    stock: 4,
    approved: true
  },
  {
    id: 5,
    name: 'Hand-painted Ceramic Plate',
    price: 350,
    description: 'Colorful hand-painted decorative plate',
    image: '/assets/hand-painted-ceramic-plate.jpg',
    category: 'Tableware',
    artist: 'Anjali Patel',
    stock: 8,
    approved: true
  },
  {
    id: 6,
    name: 'Brass Oil Lamp',
    price: 550,
    description: 'Traditional brass diya with intricate designs',
    image: '/assets/brass-oil-lamp.jpg',
    category: 'Lighting',
    artist: 'Suresh Reddy',
    stock: 6,
    approved: true
  },
  {
    id: 7,
    name: 'Terracotta Planter',
    price: 280,
    description: 'Handmade terracotta plant pot with drainage',
    image: '/assets/terracotta-planter.jpg',
    category: 'Garden',
    artist: 'Geeta Devi',
    stock: 10,
    approved: true
  },
  {
    id: 8,
    name: 'Silk Cushion Cover',
    price: 420,
    description: 'Luxurious silk cushion cover with block print',
    image: '/assets/silk-cushion-cover.jpg',
    category: 'Textiles',
    artist: 'Fatima Khan',
    stock: 12,
    approved: true
  },
  {
    id: 9,
    name: 'Marble Coaster Set',
    price: 900,
    description: 'Set of 4 marble coasters with gold inlay',
    image: '/assets/marble-coaster-set.jpg',
    category: 'Tableware',
    artist: 'Vikram Singh',
    stock: 5,
    approved: true
  },
  {
    id: 10,
    name: 'Jute Table Runner',
    price: 380,
    description: 'Eco-friendly jute table runner with embroidery',
    image: '/assets/jute-table-runner.jpg',
    category: 'Table Linens',
    artist: 'Meera Joshi',
    stock: 7,
    approved: true
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing items
    await Item.deleteMany({});
    console.log('🗑️  Cleared existing items');

    // Insert sample items
    const insertedItems = await Item.insertMany(sampleCraftItems);
    console.log(`✅ Inserted ${insertedItems.length} sample items`);

    console.log('\n📦 Sample items in database:');
    insertedItems.forEach(item => {
      console.log(`  - ${item.name} (₹${item.price}) - Stock: ${item.stock}`);
    });

    console.log('\n✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
