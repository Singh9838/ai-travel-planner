const Trip = require("../models/Trip");
const ai = require("../config/gemini");

// ================= RETRY LOGIC =================

const generateWithRetry = async (
  prompt,
  retries = 3
) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response =
        await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        });

      return response;
    }catch (error) {
  console.log(`Attempt ${i + 1} failed`);
  console.log(error.message);

      if (i === retries - 1) {
        throw error;
      }

      const delay = Math.pow(2, i) * 1000;

      console.log(
        `Retrying in ${delay / 1000} seconds...`
      );

      await new Promise((resolve) =>
        setTimeout(resolve, delay)
      );
    }
  }
};

// ================= CREATE TRIP =================



const createTrip = async (req, res) => {
  try {
    const {
      destination,
      budgetType,
      interests,
    } = req.body;

    const days = Number(req.body.days);

    // Validation

    if (
      !destination ||
      !days ||
      !budgetType ||
      !interests ||
      interests.length === 0
    ) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    if (days < 1) {
      return res.status(400).json({
        message: "Days must be at least 1",
      });
    }

    const prompt = `
Create a detailed travel plan.

Destination: ${destination}
Days: ${days}
Budget: ${budgetType}
Interests: ${interests.join(", ")}

Generate EXACTLY ${days} days itinerary.

IMPORTANT:
- Create exactly ${days} days only.
- Every day must have different activities.
- Do not repeat activities.
- Each day should have a unique theme.

Return ONLY valid JSON in this format:

{
  "itinerary": {
    "day1": {
      "theme": "Adventure",
      "morning": "Morning activity",
      "afternoon": "Afternoon activity",
      "evening": "Evening activity"
    }
  },

  "budget": {
    "flights": 400,
    "accommodation": 300,
    "food": 150,
    "activities": 100,
    "total": 950
  },

  "hotels": [
    {
      "name": "Hotel Name",
      "type": "Budget"
    }
  ],

  "packingList": [
    "Passport",
    "Power Bank",
    "Umbrella"
  ]
}
`;

    let aiData;

    try {
      const response =
        await generateWithRetry(prompt);
const text =
  response.text ||
  response.candidates?.[0]?.content
    ?.parts?.map((part) => part.text)
    .join("");

      const cleanText = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      aiData = JSON.parse(cleanText);

      // Safety check

      if (
        !aiData.itinerary ||
        Object.keys(aiData.itinerary)
          .length !== days
      ) {
        throw new Error(
          "Invalid itinerary returned by AI"
        );
      }
    } catch (error) {
      console.log(
        "Gemini unavailable. Using fallback data."
      );

      const themes = [
        "Sightseeing",
        "Adventure",
        "Culture",
        "Nature",
        "Relaxation",
        "Food Exploration",
        "Shopping",
      ];

      const mornings = [
        `Explore ${destination} city center`,
        "Visit famous landmarks",
        "Take a guided walking tour",
        "Enjoy a local breakfast experience",
        "Visit historical monuments",
        "Go for a nature trail",
        "Explore museums",
      ];

      const afternoons = [
        "Visit local attractions",
        "Enjoy adventure activities",
        "Shopping at local markets",
        "Explore cultural sites",
        "Visit parks and gardens",
        "Try local cuisine",
        "Relax at scenic spots",
      ];

      const evenings = [
        "Enjoy local cuisine",
        "Watch the sunset",
        "Experience nightlife",
        "Attend cultural performances",
        "Take an evening stroll",
        "Enjoy street food",
        "Relax at a café",
      ];

      const fallbackItinerary = {};

      for (let i = 1; i <= days; i++) {
        fallbackItinerary[`day${i}`] = {
          theme:
            themes[(i - 1) % themes.length],

          morning:
            mornings[
              (i - 1) % mornings.length
            ],

          afternoon:
            afternoons[
              (i - 1) % afternoons.length
            ],

          evening:
            evenings[
              (i - 1) % evenings.length
            ],

          customActivities: [],
        };
      }

      aiData = {
        itinerary: fallbackItinerary,

        budget: {
          flights: 400,
          accommodation: 300,
          food: 150,
          activities: 100,
          total: 950,
        },

        hotels: [
          {
            name: `${destination} Luxury Stay`,
            type: budgetType,
          },
        ],

        packingList: [
          "Passport",
          "Power Bank",
          "Phone Charger",
          "Medicines",
          "Umbrella",
          "Sunglasses",
        ],
      };
    }

    const trip = await Trip.create({
      user: req.user._id,
      destination,
      days,
      budgetType,
      interests,
      itinerary: aiData.itinerary,
      estimatedBudget: aiData.budget,
      hotels: aiData.hotels,
      packingList: aiData.packingList,
    });

    console.log(
      `Trip created successfully for ${destination}`
    );

    res.status(201).json(trip);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message:
        error.message ||
        "Unable to create trip",
    });
  }
};
// ================= GET TRIPS =================

const getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({
      message:
        error.message ||
        "Unable to fetch trips",
    });
  }
};

// ================= UPDATE TRIP =================

const updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    if (req.body.destination)
      trip.destination =
        req.body.destination;

    if (req.body.days)
      trip.days = req.body.days;

    if (req.body.budgetType)
      trip.budgetType =
        req.body.budgetType;

    if (req.body.interests)
      trip.interests =
        req.body.interests;

    if (req.body.itinerary)
      trip.itinerary =
        req.body.itinerary;

    const updatedTrip =
      await trip.save();

    res.status(200).json(updatedTrip);
  } catch (error) {
    res.status(500).json({
      message:
        error.message ||
        "Unable to update trip",
    });
  }
};

// ================= DELETE TRIP =================

const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    await trip.deleteOne();

    res.status(200).json({
      message:
        "Trip deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message:
        error.message ||
        "Unable to delete trip",
    });
  }
};

// ================= REGENERATE DAY =================

const regenerateDay = async (req, res) => {
  try {
    const { day, instruction } =
      req.body;

    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    let newDay;

    try {
      const prompt = `
Destination: ${trip.destination}
Budget: ${trip.budgetType}
Interests: ${trip.interests.join(", ")}

Regenerate only ${day}.

Instruction:
${instruction}

Return ONLY JSON.

{
 "theme":"Adventure",
 "morning":"Activity",
 "afternoon":"Activity",
 "evening":"Activity"
}
`;

      const response =
        await generateWithRetry(prompt);

      const text =
        response.text ||
        response.candidates?.[0]?.content
          ?.parts?.[0]?.text;

      const cleanText = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      newDay =
        JSON.parse(cleanText);
    } catch (error) {
      console.log(
        "Gemini unavailable. Using fallback day."
      );

      newDay = {
        theme: "Adventure",
        morning:
          "Visit famous attractions",
        afternoon:
          "Explore local culture",
        evening:
          "Enjoy local food",
      };
    }

    trip.itinerary = {
      ...trip.itinerary,

      [day]: {
        ...newDay,
        customActivities:
          trip.itinerary[day]
            ?.customActivities || [],
      },
    };

    trip.markModified("itinerary");

    await trip.save();

    res.status(200).json(trip);
  } catch (error) {
    res.status(500).json({
      message:
        error.message ||
        "Unable to regenerate day",
    });
  }
};

// ================= ADD ACTIVITY =================

const addActivity = async (req, res) => {
  try {
    const { day, activity } =
      req.body;

    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    if (!trip.itinerary[day]) {
      return res.status(400).json({
        message: "Invalid day",
      });
    }

    if (!activity || !activity.trim()) {
      return res.status(400).json({
        message:
          "Activity cannot be empty",
      });
    }

    if (
      !trip.itinerary[day]
        .customActivities
    ) {
      trip.itinerary[
        day
      ].customActivities = [];
    }

    trip.itinerary[
      day
    ].customActivities.push(
      activity.trim()
    );

    trip.markModified("itinerary");

    await trip.save();

    res.status(200).json(trip);
  } catch (error) {
    res.status(500).json({
      message:
        error.message ||
        "Unable to add activity",
    });
  }
};

// ================= REMOVE ACTIVITY =================

const removeActivity = async (
  req,
  res
) => {
  try {
    const { day, index } =
      req.body;

    const trip = await Trip.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    if (
      !trip.itinerary[day] ||
      !trip.itinerary[day]
        .customActivities
    ) {
      return res.status(400).json({
        message:
          "No activities found",
      });
    }

    if (
      index < 0 ||
      index >=
        trip.itinerary[day]
          .customActivities.length
    ) {
      return res.status(400).json({
        message:
          "Invalid activity index",
      });
    }

    trip.itinerary[
      day
    ].customActivities.splice(
      index,
      1
    );

    trip.markModified("itinerary");

    await trip.save();

    res.status(200).json(trip);
  } catch (error) {
    res.status(500).json({
      message:
        error.message ||
        "Unable to remove activity",
    });
  }
};

module.exports = {
  createTrip,
  getTrips,
  updateTrip,
  deleteTrip,
  regenerateDay,
  addActivity,
  removeActivity,
};