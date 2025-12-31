const mongoose = require('mongoose');
const connectDB = async () => {
    await mongoose.connect(process.env.MONGODB_URI,
        // {
        //     tls: true,
        //     tlsAllowInvalidCertificates: true // Use this option only for development or testing with self-signed certificates
        // }
        //{ useNewUrlParser: true, useUnifiedTopology: true }
    );
    console.log('MongoDB connected');
};

module.exports = { connectDB };