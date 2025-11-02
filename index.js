<<<<<<< HEAD
const handleSubmit = async (e) => {
  e.preventDefault();

  const data = {
    tripName,
    startDateOfJourney,
    endDateOfJourney,
    nameOfHotels,
    tripType,
    placesVisited,
    featured,
    totalCost,
    shortDescription,
    experience
  };

  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/addexperience`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      alert("Trip saved successfully!");
      console.log("Response:", result);
    } else {
      alert("Failed to save trip!");
      console.error(result);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while saving the trip.");
  }
};
=======
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
>>>>>>> f3e0e8557900de4254bd32463a92b28407fe3294
