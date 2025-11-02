// top of file (if not already)
const TripDetails = require('./models/tripDetails');
const express = require('express');
const mongoose = require('mongoose');
const mongoURI = 'mongodb+srv://nikithabalaji143:Angel05@nikitha.0qzb5fk.mongodb.net/?appName=Nikitha';
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// after mongoose.connect(...) success handler add:
mongoose.connect(mongoURI)
  .then(() => {
console.log('✅ Connected to MongoDB Atlas');
console.log('MongoDB Host:', mongoose.connection.host || 'N/A');
console.log('MongoDB DB Name:', mongoose.connection.name || 'N/A');
 })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });

// POST route (replace your current route body)
// POST route
app.post('/addexperience', async (req, res) => {
  console.log("✅ Request body received:", req.body);

  try {
    const newTrip = new TripDetails({
      tripName: req.body.tripName,
      startDateOfJourney: req.body.startDateOfJourney,
      endDateOfJourney: req.body.endDateOfJourney,
      nameOfHotels: req.body.nameOfHotels,
      tripType: req.body.tripType,
      placesVisited: req.body.placesVisited,
      featured: req.body.featured,
      totalCost: req.body.totalCost,
      shortDescription: req.body.shortDescription,
      experience: req.body.experience,
      image: req.body.image || 'http://example.com/default.jpg'
    });

    const savedTrip = await newTrip.save();
    console.log("✅ Saved Trip:", savedTrip);

    // 👉 This line sends a response back to curl/Postman/browser
    res.status(201).json({
      message: "Trip saved successfully!",
      trip: savedTrip
    });

  } catch (err) {
    console.error("❌ SAVE ERROR:", err);
    res.status(500).json({ error: 'Failed to save trip' });
  }
});

app.get('/', (req, res) => {
  res.send('Server is running!');
});

const port = 3000;
// replace your existing app.listen(...) with:
app.listen(port, '0.0.0.0', () => {
  console.log(`Server started at http://0.0.0.0:${port}`);
});
