require('dotenv').config();
const connectDB = require('./config/db');
const Category = require('./models/Category');
const Product = require('./models/Product');
const ServiceProvider = require('./models/ServiceProvider');
const { categories, products, serviceProviders } = require('./data/seedData');

const runSeed = async () => {
  try {
    await connectDB();
    await Category.deleteMany({});
    await Product.deleteMany({});
    await ServiceProvider.deleteMany({});

    const createdCategories = await Category.insertMany(categories);
    const mappedProducts = products.map((product) => {
      const category = createdCategories.find(
        (cat) => cat.slug === product.categorySlug
      );
      const { categorySlug, ...rest } = product;
      return {
        ...rest,
        category: category ? category._id : createdCategories[0]._id,
      };
    });
    await Product.insertMany(mappedProducts);
    await ServiceProvider.insertMany(serviceProviders);

    console.log('Seed data successfully inserted');
    process.exit(0);
  } catch (error) {
    console.error('Seed failure', error);
    process.exit(1);
  }
};

runSeed();
