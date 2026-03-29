const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config({ path: './.env' });

const email = 'singhshubham21112003@gmail.com';

const db = process.env.DATABASE;

mongoose.connect(db).then(async () => {
    console.log('DB connection successful');
    try {
        const user = await User.findOneAndUpdate(
            { email },
            { role: 'admin' },
            { new: true }
        );
        if (user) {
            console.log(`Success! User ${user.email} is now an admin.`);
        } else {
            console.log(`User with email ${email} not found.`);
        }
    } catch (err) {
        console.error('Error updating user:', err);
    } finally {
        mongoose.connection.close();
    }
}).catch(err => {
    console.error('DB connection error:', err);
});
