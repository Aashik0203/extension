const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()


const app = express()
app.use(cors({
  origin: [
    'http://localhost:5317', // Vite port
    'chrome-extension://jhjeanngndofgmgcdcpgfnbddecbkemb' // Extension ID
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));



app.use(express.json())



mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use('/auth',require('./routes/auth'))
app.use('/api',require('./api/protected'))



app.listen(5000, () => console.log("Server running on 5000"));
