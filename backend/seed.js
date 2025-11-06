// seed.js - supports two modes:
// 1) Run standalone: `node seed.js` will create/attach a mongo (in-memory if requested) and seed it.
// 2) Imported from server: call exported `seedDatabase()` after mongoose.connect() to seed the current connection.
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Restaurant = require('./models/Restaurant');
const Dish = require('./models/Dish');
const Order = require('./models/Order');
const useInMemory = process.env.USE_IN_MEMORY_DB === '1' || process.env.NODE_ENV === 'development';

async function seedDatabase(){
  await User.deleteMany({});
  await Restaurant.deleteMany({});
  await Dish.deleteMany({});
  await Order.deleteMany({});
  const pw = await bcrypt.hash('password123', 10);
  const owner = await User.create({ firstName:'Jatin', lastName:'Rajput', email:'owner@example.com', password:pw, role:'owner' });
  const cust = await User.create({ firstName:'Himanshu', lastName:'Sharma', email:'customer@example.com', password:pw, role:'customer' });
  const resto = await Restaurant.create({ ownerId: owner._id, name: 'Tomato Kitchen', address: 'City Center' });

  // Point images to local files served from frontend/public/images to guarantee availability
  const dishesData = [
    { restaurantId: resto._id, name: 'Grilled Sandwich', description:'Toasted sandwich with veggies', price:129, category:'Sandwich', imageURL:'/images/grilled-sandwich.jpeg', type:'veg', availableTypes:['veg','nonveg'], rating:4.2, reviewsCount:58 },
    { restaurantId: resto._id, name: 'Birthday Cake', description:'Vanilla layered cake', price:299, category:'Cake', imageURL:'/images/birthday-cake.jpeg', type:'veg', rating:4.7, reviewsCount:94 },
    { restaurantId: resto._id, name: 'Paneer Masala', description:'Spicy paneer curry', price:189, category:'Pure Veg', imageURL:'/images/paneer-masala.jpeg', type:'veg', rating:4.3, reviewsCount:41 },
    { restaurantId: resto._id, name: 'Pasta Alfredo', description:'Creamy white sauce pasta', price:159, category:'Pasta', imageURL:'/images/pasta-alfredo.jpeg', type:'veg', rating:4.5, reviewsCount:67 },
    { restaurantId: resto._id, name: 'Chicken Noodles', description:'Stir fried noodles with chicken', price:139, category:'Noodles', imageURL:'/images/chicken-noodles.jpg', type:'nonveg', rating:4.1, reviewsCount:33 },
    { restaurantId: resto._id, name: 'Caesar Salad', description:'Fresh romaine lettuce with parmesan', price:199, category:'Salad', imageURL:'/images/caesar-salad.webp', isPopular:true, type:'veg', rating:4.6, reviewsCount:124 },
    { restaurantId: resto._id, name: 'Chocolate Dessert', description:'Rich chocolate delight', price:99, category:'Deserts', imageURL:'/images/chocolate-dessert.jpeg', isPopular:true, type:'veg', rating:4.8, reviewsCount:212 },
    // Additional dishes for expanded menu
    { restaurantId: resto._id, name: 'Margherita Pizza', description:'Classic cheese and tomato pizza', price:799, category:'Pizza', imageURL:'/images/margherita-pizza.jpeg', type:'veg', rating:4.6, reviewsCount:150 },
    { restaurantId: resto._id, name: 'Tandoori Chicken', description:'Spiced grilled chicken', price:899, category:'Grill', imageURL:'/images/tandoori-chicken.webp', type:'nonveg', rating:4.5, reviewsCount:112 },
    { restaurantId: resto._id, name: 'Fish Curry', description:'Tangy fish curry with coconut milk', price:699, category:'Curry', imageURL:'/images/fish-curry.webp', type:'nonveg', rating:4.3, reviewsCount:78 },
    { restaurantId: resto._id, name: 'Falafel Wrap', description:'Crispy falafel with fresh veggies', price:499, category:'Wraps', imageURL:'/images/falafel-wrap.jpeg', type:'veg', rating:4.2, reviewsCount:64 },
    { restaurantId: resto._id, name: 'Veggie Rolls', description:'Crispy vegetable rolls', price:149, category:'Rolls', imageURL:'/images/veggie-rolls.jpeg', isPopular:true, type:'veg', rating:4.4, reviewsCount:86 },
    { restaurantId: resto._id, name: 'Beef Burger', description:'Juicy beef patty with cheese', price:899, category:'Burgers', imageURL:'/images/beef-burger.jpeg', type:'nonveg', rating:4.4, reviewsCount:129 },
    { restaurantId: resto._id, name: 'Sushi Rolls', description:'Assorted sushi roll platter', price:1099, category:'Sushi', imageURL:'/images/sushi-rolls.webp', type:'nonveg', rating:4.7, reviewsCount:98 },
    // Add Kaju Masala - rich cashew curry
  { restaurantId: resto._id, name: 'Kaju Masala', description: 'Creamy cashew curry with warm spices', price: 259, category: 'Curry', imageURL: '/images/kaju-masala.webp', isPopular: true, type:'veg', rating: 4.5, reviewsCount: 47 },
    // 15 popular Indian dishes
  { restaurantId: resto._id, name: 'Butter Chicken', description: 'Creamy tomato-based chicken curry', price: 349, category: 'Curry', imageURL: '/images/butter-chicken.jpg', isPopular: true, type: 'nonveg', rating: 4.7, reviewsCount: 210 },
  { restaurantId: resto._id, name: 'Vegetable Biryani', description: 'Aromatic basmati rice layered with spiced vegetables', price: 249, category: 'Biryani', imageURL: '/images/veg-biryani.jpg', type: 'veg', rating: 4.5, reviewsCount: 180 },
  { restaurantId: resto._id, name: 'Chicken Biryani', description: 'Fragrant biryani with tender chicken pieces', price: 379, category: 'Biryani', imageURL: '/images/chicken-biryani.jpg', type: 'nonveg', rating: 4.8, reviewsCount: 340 },
  { restaurantId: resto._id, name: 'Chole Bhature', description: 'Spicy chickpea curry served with deep-fried bread', price: 199, category: 'Street Food', imageURL: '/images/chole-bhature.webp', type: 'veg', rating: 4.6, reviewsCount: 145 },
  { restaurantId: resto._id, name: 'Aloo Gobi', description: 'Potato and cauliflower cooked with Indian spices', price: 169, category: 'Sides', imageURL: '/images/aloo-gobi.webp', type: 'veg', rating: 4.3, reviewsCount: 88 },
  { restaurantId: resto._id, name: 'Rogan Josh', description: 'Rich Kashmiri lamb curry', price: 429, category: 'Curry', imageURL: '/images/rogan-josh.webp', type: 'nonveg', rating: 4.6, reviewsCount: 95 },
  { restaurantId: resto._id, name: 'Masala Dosa', description: 'Crispy rice pancake filled with spiced potato', price: 129, category: 'Breakfast', imageURL: '/images/masala-dosa.jpg', type: 'veg', rating: 4.5, reviewsCount: 220 },
  { restaurantId: resto._id, name: 'Idli Sambar', description: 'Steamed rice cakes with lentil stew', price: 99, category: 'Breakfast', imageURL: '/images/idli-sambar.avif', type: 'veg', rating: 4.4, reviewsCount: 160 },
  { restaurantId: resto._id, name: 'Samosa', description: 'Crispy pastry stuffed with spiced potatoes', price: 49, category: 'Snacks', imageURL: '/images/samosa.jpg', type: 'veg', rating: 4.2, reviewsCount: 430 },
  { restaurantId: resto._id, name: 'Pani Puri', description: 'Crispy hollow puris with tangy water and fillings', price: 89, category: 'Street Food', imageURL: '/images/pani-puri.jpg', type: 'veg', rating: 4.3, reviewsCount: 300 },
  { restaurantId: resto._id, name: 'Dal Makhani', description: 'Slow-cooked black lentils in a buttery sauce', price: 199, category: 'Curry', imageURL: '/images/dal-makhani.jpg', type: 'veg', rating: 4.6, reviewsCount: 210 },
  { restaurantId: resto._id, name: 'Malai Kofta', description: 'Vegetable dumplings in creamy tomato gravy', price: 259, category: 'Curry', imageURL: '/images/malai-kofta.jpg', type: 'veg', rating: 4.4, reviewsCount: 98 },
  { restaurantId: resto._id, name: 'Palak Paneer', description: 'Paneer cubes in a smooth spinach gravy', price: 219, category: 'Pure Veg', imageURL: '/images/palak-paneer.webp', type: 'veg', rating: 4.5, reviewsCount: 165 },
  { restaurantId: resto._id, name: 'Gulab Jamun', description: 'Soft milk-solid dumplings soaked in sugar syrup', price: 79, category: 'Dessert', imageURL: '/images/gulab-jamun.jpg', type: 'veg', rating: 4.7, reviewsCount: 420 },
  { restaurantId: resto._id, name: 'Mango Lassi', description: 'Refreshing mango yogurt drink', price: 99, category: 'Beverage', imageURL: '/images/mango-lassi.jpg', type: 'veg', rating: 4.6, reviewsCount: 205 }
  ];


  // Normalize imageURL values (trim) before inserting
  const normalized = dishesData.map(d => ({ ...d, imageURL: (d.imageURL || '').toString().trim() }));

  const dishes = await Dish.create(normalized);

  await Order.create({ customerId: cust._id, restaurantId: resto._id, items: [{ dishId: dishes[0]._id, quantity:1, price:dishes[0].price }], totalAmount: dishes[0].price, restaurantEarning: dishes[0].price * 0.9, status:'delivered' });
  console.log('Seeded users:', { owner: owner.email, customer: cust.email });
  console.log('Dishes created:', dishes.map(d=> d.name));
}

// When run directly, create/connect and seed (keeps old behavior)
if(require.main === module){
  (async ()=>{
    let mongod;
    try{
      if(useInMemory){
        const { MongoMemoryServer } = require('mongodb-memory-server');
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        await mongoose.connect(uri);
        console.log('Connected to in-memory MongoDB');
      } else {
        const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/mern_food_app';
        await mongoose.connect(MONGO);
        console.log('Connected to MongoDB at', MONGO);
      }
      await seedDatabase();
    } catch(e){
      console.error('Seed error', e);
    } finally {
      await mongoose.disconnect();
      if(mongod && mongod.stop) await mongod.stop();
      process.exit(0);
    }
  })();
}

module.exports = { seedDatabase };
