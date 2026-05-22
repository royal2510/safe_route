require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Route = require('../models/Route');
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/saferoute';
async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    await User.deleteMany({}); await Route.deleteMany({});
    const user = await User.create({ name: 'Demo User', email: 'demo@saferoute.com', password: await bcrypt.hash('password123', 10) });
    await Route.insertMany([
      { startLocation: 'Deakin University Burwood', endLocation: 'Melbourne Central', riskLevel: 'Low', estimatedTime: 34, distanceKm: 16.2, safetyScore: 92, transportMode: 'Public Transport', notes: 'Well-lit route using main roads and train/tram connections.', user: user._id },
      { startLocation: 'Southern Cross Station', endLocation: 'Docklands Library', riskLevel: 'Medium', estimatedTime: 14, distanceKm: 1.8, safetyScore: 71, transportMode: 'Walking', notes: 'Fast route, but quieter after late evening.', user: user._id },
      { startLocation: 'Box Hill Central', endLocation: 'Swinburne University', riskLevel: 'Low', estimatedTime: 22, distanceKm: 8.5, safetyScore: 88, transportMode: 'Driving', notes: 'Recommended route with high road visibility.', user: user._id },
      { startLocation: 'Flinders Street Station', endLocation: 'Royal Botanic Gardens', riskLevel: 'High', estimatedTime: 19, distanceKm: 2.4, safetyScore: 48, transportMode: 'Walking', notes: 'Avoid isolated park areas late at night.', user: user._id }
    ]);
    console.log('Database seeded successfully. Demo login: demo@saferoute.com / password123'); process.exit(0);
  } catch (error) { console.error('Seed failed:', error.message); process.exit(1); }
}
seed();
