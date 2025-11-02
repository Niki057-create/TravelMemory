const mongoose = require('mongoose');

const tripDetailsSchema = new mongoose.Schema({
  tripName: { type: String, required: true },
  startDateOfJourney: { type: String, required: true },
  endDateOfJourney: { type: String, required: true },
  nameOfHotels: { type: String },
  tripType: { type: String },
  placesVisited: { type: String },
  featured: { type: Boolean, default: false },
  totalCost: { type: Number },
  shortDescription: { type: String },
  experience: { type: String },
  image: { type: String, default: "http://example.com/default.jpg" }
}, { timestamps: true }); // ✅ This adds createdAt and updatedAt

module.exports = mongoose.model("tripdetails", tripDetailsSchema);
