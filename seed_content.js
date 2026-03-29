require('dotenv').config();
const mongoose = require('mongoose');
const SiteContent = require('./models/SiteContent');

const initialContent = [
  // HERO SECTION
  { section: 'hero', key: 'title', value: 'BEYOND THE LIMITS.' },
  { section: 'hero', key: 'subtitle', value: 'UNLEASH THE OTTER WITHIN' },
  { section: 'hero', key: 'description', value: 'Join the most exclusive multi-sport community. From professional leagues to weekend surges, ignite your passion and redefine your boundaries.' },
  { section: 'hero', key: 'cta', value: 'EXPLORE EVENTS' },

  // STORY SECTION
  { section: 'story', key: 'tagline', value: 'OUR PHILOSOPHY' },
  { section: 'story', key: 'title', value: 'Movement is Life. Community is Strength.' },
  { section: 'story', key: 'description1', value: 'Founded in 2024, Otter Society was born from a simple observation: sports are better when shared. We believe that every individual has an untapped athletic potential waiting to be discovered through community and competition.' },
  { section: 'story', key: 'description2', value: 'Whether you are a seasoned pro or picking up a ball for the first time, our mission is to provide the platform, the people, and the energy to help you surge forward.' }
];

const seedDB = async () => {
  try {
    const DB = process.env.DATABASE;
    await mongoose.connect(DB);
    console.log('DB connected for seeding...');

    // Upsert each item
    for (const item of initialContent) {
      await SiteContent.findOneAndUpdate(
        { section: item.section, key: item.key },
        item,
        { upsert: true, new: true }
      );
    }

    console.log('Data successfully seeded!');
    process.exit();
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
};

seedDB();
