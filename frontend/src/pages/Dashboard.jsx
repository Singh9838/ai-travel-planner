import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const response = await API.get(
        "/trips"
      );

      setTrips(response.data);
    } catch (error) {
      console.log(
        error.response?.data ||
          error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteTrip = async (id) => {
    try {
      const confirmDelete =
        window.confirm(
          "Are you sure you want to delete this trip?"
        );

      if (!confirmDelete) return;

      await API.delete(`/trips/${id}`);

      setTrips(
        trips.filter(
          (trip) => trip._id !== id
        )
      );

      alert(
        "Trip deleted successfully"
      );
    } catch (error) {
      alert("Delete failed");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading-container">
          <h2>Loading Trips...</h2>
        </div>
      </>
    );
  }

  return (
    <div className="dashboard-container">
      <Navbar />

      {/* HERO SECTION */}

      <div className="hero-section">
        <div className="hero-overlay">
          <h1>
            Explore The World With AI ✈️
          </h1>

          <p>
            Plan smart, travel better,
            and create unforgettable
            memories.
          </p>

          <Link to="/create-trip">
            <button className="hero-btn">
              Create New Trip
            </button>
          </Link>
        </div>
      </div>

      {/* STATS */}

      <div className="stats-card">
        <h3>Total Trips</h3>

        <h2>{trips.length}</h2>
      </div>

      {/* TRIPS */}

      {trips.length === 0 ? (
        <div className="empty-card">
          <h2>
            No Trips Found 😔
          </h2>

          <p>
            Start planning your first
            AI powered trip.
          </p>

          <Link to="/create-trip">
            <button className="hero-btn">
              Create Trip
            </button>
          </Link>
        </div>
      ) : (
        <div className="trip-grid">
          {trips.map((trip) => (
            <div
              key={trip._id}
              className="trip-card"
            >
              <h2>
                📍 {trip.destination}
              </h2>

              <p>
                <strong>Days:</strong>{" "}
                {trip.days}
              </p>

              <p>
                <strong>Budget:</strong>{" "}
                {trip.budgetType}
              </p>

              <p>
                <strong>Interests:</strong>{" "}
                {trip.interests?.join(
                  ", "
                )}
              </p>

              <div className="trip-actions">
                <Link
                  to={`/trip/${trip._id}`}
                >
                  <button className="view-btn">
                    View
                  </button>
                </Link>

                <Link
                  to={`/edit-trip/${trip._id}`}
                >
                  <button className="edit-btn">
                    Edit
                  </button>
                </Link>

                <button
                  className="delete-btn"
                  onClick={() =>
                    deleteTrip(trip._id)
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;