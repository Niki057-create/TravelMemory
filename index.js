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
