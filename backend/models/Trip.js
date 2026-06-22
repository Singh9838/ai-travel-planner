const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    destination: {
      type: String,
      required: true,
      trim: true,
    },

    days: {
      type: Number,
      required: true,
      min: 1,
    },

    budgetType: {
      type: String,
      required: true,
      enum: ["Low", "Medium", "High"],
    },

    interests: {
      type: [String],
      default: [],
    },

    itinerary: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    estimatedBudget: {
      flights: {
        type: Number,
        default: 0,
      },

      accommodation: {
        type: Number,
        default: 0,
      },

      food: {
        type: Number,
        default: 0,
      },

      activities: {
        type: Number,
        default: 0,
      },

      total: {
        type: Number,
        default: 0,
      },
    },

    hotels: [
      {
        name: {
          type: String,
          trim: true,
        },

        type: {
          type: String,
          trim: true,
        },

        notes: {
          type: String,
          trim: true,
        },
      },
    ],

    packingList: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Trip",
  tripSchema
);