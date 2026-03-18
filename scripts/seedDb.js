import { connectDB } from '../config/db.js';
import User from '../models/User.model.js';
import Subscription from '../models/Subscription.model.js';
import Transaction from '../models/Transaction.model.js';
import bcryptjs from 'bcryptjs';
import { faker } from '@faker-js/faker';

const hashPassword = async (password) => {
  return await bcryptjs.hash(password, 10);
};

// Configuration for bulk seeding
const USERS_COUNT = 50;
const SUBSCRIPTIONS_PER_USER = 3;
const TRANSACTIONS_PER_SUBSCRIPTION = 5;

const SUBSCRIPTION_PLANS = [
  { name: 'Basic Plan', price: 29.99, billing_cycle: 'monthly' },
  { name: 'Premium Plan', price: 99.99, billing_cycle: 'monthly' },
  { name: 'Enterprise Plan', price: 299.99, billing_cycle: 'yearly' },
  { name: 'Professional Plan', price: 199.99, billing_cycle: 'monthly' },
];

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('🌱 Starting bulk database seed...\n');

    // Clear existing data
    await User.deleteMany({});
    await Subscription.deleteMany({});
    await Transaction.deleteMany({});
    console.log('✓ Cleared existing data\n');

    // Create admin user
    const adminPassword = await hashPassword('admin123');
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@subledger.dev',
      password_hash: adminPassword,
      role: 'admin',
    });
    console.log('✓ Created admin user:', adminUser.email);

    // Bulk create users
    console.log(`\n⏳ Creating ${USERS_COUNT} users...`);
    const users = [];
    for (let i = 0; i < USERS_COUNT; i++) {
      const password = await hashPassword(faker.internet.password());
      users.push({
        username: faker.internet.username(),
        email: faker.internet.email(),
        password_hash: password,
        role: 'user',
      });
    }
    users[0].password_hash = await hashPassword('password'); // Set a known password for the first user for testing
    console.log("test user"  , users[0] , "password");
    const createdUsers = await User.insertMany(users);
    console.log(`✓ Created ${createdUsers.length} users`);

    // Bulk create subscriptions
    console.log(`\n⏳ Creating subscriptions (${SUBSCRIPTIONS_PER_USER} per user)...`);
    const subscriptions = [];
    for (const user of createdUsers) {
      for (let i = 0; i < SUBSCRIPTIONS_PER_USER; i++) {
        const plan = SUBSCRIPTION_PLANS[Math.floor(Math.random() * SUBSCRIPTION_PLANS.length)];
        subscriptions.push({
          user: user._id,
          name: plan.name,
          price: plan.price,
          billing_cycle: plan.billing_cycle,
          status: Math.random() > 0.2 ? 'active' : 'cancelled',
        });
      }
    }
    const createdSubscriptions = await Subscription.insertMany(subscriptions);
    console.log(`✓ Created ${createdSubscriptions.length} subscriptions`);

    // Bulk create transactions
    console.log(`\n⏳ Creating transactions (${TRANSACTIONS_PER_SUBSCRIPTION} per subscription)...`);
    const transactions = [];
    for (const subscription of createdSubscriptions) {
      for (let i = 0; i < TRANSACTIONS_PER_SUBSCRIPTION; i++) {
        transactions.push({
          user: subscription.user,
          subscription: subscription._id,
          amount: subscription.price,
          paymentDate: faker.date.past({ years: 1 }),
          status: Math.random() > 0.1 ? 'paid' : 'failed',
        });
      }
    }
    const createdTransactions = await Transaction.insertMany(transactions);
    console.log(`✓ Created ${createdTransactions.length} transactions`);

    console.log('\n✨ Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`- ${createdUsers.length + 1} total users (1 admin + ${createdUsers.length} regular)`);
    console.log(`- ${createdSubscriptions.length} subscriptions`);
    console.log(`- ${createdTransactions.length} transactions`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

await seedDatabase();

