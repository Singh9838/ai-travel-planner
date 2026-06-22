import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

function CreateTrip() {
  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      destination: "",
      days: "",
      budgetType: "Medium",
      interests: "",
    });
    const [loading, setLoading] =
  useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;
    setLoading(true);

    if (
      !formData.destination ||
      !formData.days ||
      !formData.interests
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
          setLoading(true);
      const tripData = {
        destination:
          formData.destination,

        days: Number(formData.days),

        budgetType:
          formData.budgetType,

        interests:
          formData.interests
            .split(",")
            .map((item) =>
              item.trim()
            ),
      };

      await API.post(
        "/trips",
        tripData
      );

      alert(
        "Trip created successfully"
      );

      navigate("/dashboard");
    } catch (error) {
      alert(
        error.response?.data
          ?.message ||
          "Trip creation failed"
      );
    }
     finally {
  setLoading(false);
}
  };

  return (
    <>
      <Navbar />

      <div className="create-trip-page">
        <div className="trip-overlay">
          <div className="form-container">
            <h1>Create Your Dream Trip ✈️</h1>

            <p className="form-subtitle">
              Let AI plan your perfect
              journey
            </p>

            <form
              onSubmit={handleSubmit}
            >
              <input
                type="text"
                name="destination"
                placeholder="Destination"
                value={
                  formData.destination
                }
                onChange={handleChange}
              />

              <input
                type="number"
                name="days"
                placeholder="Number of Days"
                value={formData.days}
                onChange={handleChange}
              />

              <select
                name="budgetType"
                value={
                  formData.budgetType
                }
                onChange={handleChange}
              >
                <option value="Low">
                  Low Budget
                </option>

                <option value="Medium">
                  Medium Budget
                </option>

                <option value="High">
                  Luxury Budget
                </option>
              </select>

              <input
                type="text"
                name="interests"
                placeholder="Food, Adventure, Culture"
                value={
                  formData.interests
                }
                onChange={handleChange}
              />
<button
  type="submit"
  disabled={loading}
>
  {loading
    ? "Creating Trip..."
    : "Create Trip"}
</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateTrip;