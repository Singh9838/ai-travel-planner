import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

function TripDetails() {
  const { id } = useParams();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newActivity, setNewActivity] =
  useState({});

  useEffect(() => {
    fetchTrip();
  }, []);

  const fetchTrip = async () => {
    try {
      const response = await API.get("/trips");

      const selectedTrip = response.data.find(
        (trip) => trip._id === id
      );

      setTrip(selectedTrip);
    } catch (error) {
      console.log(
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const regenerateSpecificDay = async (
    selectedDay
  ) => {
    try {
      const response = await API.put(
        `/trips/${id}/regenerate-day`,
        {
          day: selectedDay,
          instruction:
            "Add more outdoor activities",
        }
      );

      setTrip(response.data);

      alert(
        `${selectedDay} regenerated successfully`
      );
    } catch (error) {
      console.log(
        error.response?.data ||
          error.message
      );

      alert("Failed to regenerate day");
    }
  };
const addActivity = async (day) => {
  if (!newActivity[day]?.trim()) {
    alert("Please enter an activity");
    return;
  }

  try {
    const response = await API.put(
      `/trips/${id}/add-activity`,
      {
        day,
        activity: newActivity[day],
      }
    );

    setTrip(response.data);

    setNewActivity({
      ...newActivity,
      [day]: "",
    });

    alert("Activity Added");
  } catch (error) {
    console.log(
      error.response?.data ||
      error.message
    );
  }
};

  const removeActivity = async (
    day,
    index
  ) => {
    try {
      const response = await API.put(
        `/trips/${id}/remove-activity`,
        {
          day,
          index,
        }
      );

      setTrip(response.data);

      alert("Activity Removed");
    } catch (error) {
      console.log(
        error.response?.data ||
          error.message
      );
    }
  };

  if (loading) {
  return (
    <>
      <Navbar />
      <div className="loading-container">
        <h2>Loading Trip Details...</h2>
      </div>
    </>
  );
}

if (!trip) {
  return (
    <>
      <Navbar />
      <div className="loading-container">
        <h2>Trip not found</h2>
      </div>
    </>
  );
}

  return (
    <div className="trip-details">
      <Navbar />

      <div className="details-card">
        <h1>{trip.destination}</h1>

        <h3>{trip.days} Days</h3>

        <h3>
          Budget: {trip.budgetType}
        </h3>

        <hr />

        <h2>Estimated Budget</h2>

        <p>
          Flights: $
          {trip.estimatedBudget?.flights}
        </p>

        <p>
          Accommodation: $
          {
            trip.estimatedBudget
              ?.accommodation
          }
        </p>

        <p>
          Food: $
          {trip.estimatedBudget?.food}
        </p>

        <p>
          Activities: $
          {
            trip.estimatedBudget
              ?.activities
          }
        </p>

        <p>
          <strong>
            Total: $
            {trip.estimatedBudget?.total}
          </strong>
        </p>

        <hr />

        <h2>Recommended Hotels</h2>

        {trip.hotels?.map((hotel) => (
          <div
            key={hotel._id}
            className="hotel-card"
          >
            <h4>{hotel.name}</h4>
            <p>{hotel.type}</p>
          </div>
        ))}

        <hr />

        <h2>Packing List</h2>

        <ul className="packing-list">
          {trip.packingList?.map(
            (item, index) => (
              <li key={index}>{item}</li>
            )
          )}
        </ul>

        <hr />

        <h2>Day Wise Itinerary</h2>

        {Object.entries(
          trip.itinerary || {}
        ).map(([day, details]) => (
          <div
            key={day}
            className="day-card"
          >
            <h3>{day.toUpperCase()}</h3>

            <p>
              <strong>Theme:</strong>{" "}
              {details.theme}
            </p>

            <p>
              <strong>Morning:</strong>{" "}
              {details.morning}
            </p>

            <p>
              <strong>Afternoon:</strong>{" "}
              {details.afternoon}
            </p>

            <p>
              <strong>Evening:</strong>{" "}
              {details.evening}
            </p>

            <button
              className="primary-btn"
              onClick={() =>
                regenerateSpecificDay(day)
              }
            >
              Regenerate {day}
            </button>

            <hr />

            <h4>Custom Activities</h4>

            {details.customActivities?.map(
              (activity, index) => (
                <div
                  key={index}
                  className="activity-item"
                >
                  <span>{activity}</span>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      removeActivity(
                        day,
                        index
                      )
                    }
                  >
                    Remove
                  </button>
                </div>
              )
            )}

            <div className="activity-form">
             <input
  type="text"
  placeholder="Add Activity"
  value={newActivity[day] || ""}
  onChange={(e) =>
    setNewActivity({
      ...newActivity,
      [day]: e.target.value,
    })
  }
/>

              <button
                className="primary-btn"
                onClick={() =>
                  addActivity(day)
                }
              >
                Add Activity
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TripDetails;