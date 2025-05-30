const mongoose = require('mongoose');

const dbConnection = mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('Database connected successfully');
})
.catch((err) => {
    console.error('Database connection failed:', err.message);
});

module.exports = dbConnection;
