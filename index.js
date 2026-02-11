const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;

// Middleware to parse JSON requests


app.use(express.json());
const UserRoutes = require('./routes/User.routes');
const channelRoutes = require('./routes/Channel.routes');
const VideoRoutes = require('./routes/Video.routes');

// Sample route
app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.use('/users', UserRoutes);
app.use('/channels', channelRoutes);
app.use('/videos', VideoRoutes);

// Connect to MongoDB and start the server

// mongoose.connect(MONGO_URL).then(() => {
//     console.log("Connected to MongoDB");
// }).catch((err)=>{
//     console.error("Error connecting to MongoDB:", err);
// })



app.listen(4000, () => {
  console.log(`Server is running on http://localhost:4000`);
}); 