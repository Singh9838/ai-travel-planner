import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import API from "../services/api";
import Navbar from "../components/Navbar";

function EditTrip() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(true);

  const [formData, setFormData] =
    useState({
      destination: "",
      days: "",
      budgetType: "Medium",
    });

  useEffect(() => {
    fetchTrip();
  }, []);

  const fetchTrip = async () => {
    try {
      const response =
        await API.get("/trips");

      const selectedTrip =
        response.data.find(
          (trip) => trip._id === id
        );

      if (selectedTrip) {
        setFormData({
          destination:
            selectedTrip.destination,
          days: selectedTrip.days,
          budgetType:
            selectedTrip.budgetType,
        });
      }
    } catch (error) {
      console.log(
        error.response?.data ||
          error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.put(
        `/trips/${id}`,
        formData
      );

      alert(
        "Trip updated successfully"
      );

      navigate("/dashboard");
    } catch (error) {
      console.log(
        error.response?.data ||
          error.message
      );

      alert("Update failed");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <h2>Loading...</h2>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="form-container">
        <h1>Edit Trip</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="destination"
            placeholder="Destination"
            value={
              formData.destination
            }
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="days"
            placeholder="Number of Days"
            value={formData.days}
            onChange={handleChange}
            required
          />

          <select
            name="budgetType"
            value={
              formData.budgetType
            }
            onChange={handleChange}
          >
            <option value="Low">
              Low
            </option>

            <option value="Medium">
              Medium
            </option>

            <option value="High">
              High
            </option>
          </select>

          <button type="submit">
            Update Trip
          </button>
        </form>
      </div>
    </>
  );
}

export default EditTrip;