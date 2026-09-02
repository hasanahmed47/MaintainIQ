const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const Asset = require('./models/Asset');
const generateAssetCode = require('./utils/generateAssetCode');
const generateQRCode = require('./utils/qrGenerator');

dotenv.config();
connectDB();

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

const seedData = async () => {
  try {
    await User.deleteMany();
    await Asset.deleteMany();

    const admin = await User.create({
      name: 'Hasan Admin',
      email: 'admin@maintainiq.com',
      password: 'admin123',
      role: 'admin',
    });

    const technician = await User.create({
      name: 'Ali Technician',
      email: 'tech@maintainiq.com',
      password: 'tech123',
      role: 'technician',
    });

    const supervisor = await User.create({
      name: 'Sara Supervisor',
      email: 'supervisor@maintainiq.com',
      password: 'super123',
      role: 'supervisor',
    });

    const assetsData = [
      { name: 'Classroom Projector 01', category: 'Electronics', location: 'Block A - Room 101', condition: 'Good' },
      { name: 'AC Unit - Lecture Hall', category: 'HVAC', location: 'Block B - Hall 3', condition: 'Fair' },
      { name: 'Water Cooler', category: 'Plumbing', location: 'Ground Floor Lobby', condition: 'Good' },
    ];

    for (const data of assetsData) {
      const assetCode = await generateAssetCode();
      const publicUrl = `${CLIENT_URL}/asset/${assetCode}`;
      const qrCodeUrl = await generateQRCode(publicUrl);

      await Asset.create({ ...data, assetCode, publicUrl, qrCodeUrl });
    }

    console.log('✅ Seed data created successfully');
    console.log('-----------------------------------');
    console.log('Admin login:      admin@maintainiq.com / admin123');
    console.log('Technician login: tech@maintainiq.com / tech123');
    console.log('Supervisor login: supervisor@maintainiq.com / super123');
    console.log('-----------------------------------');
    process.exit();
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

seedData();
