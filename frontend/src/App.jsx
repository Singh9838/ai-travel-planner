import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateTrip from "./pages/CreateTrip";
import EditTrip from "./pages/EditTrip";
import TripDetails from "./pages/TripDetails";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={ <ProtectedRoute><Dashboard /></ProtectedRoute> } />

        <Route path="/create-trip" element={ <ProtectedRoute><CreateTrip /></ProtectedRoute> } />
        <Route
          path="/edit-trip/:id"
          element={ <ProtectedRoute><EditTrip /></ProtectedRoute> }
        />

        <Route
          path="/trip/:id"
          element={ <ProtectedRoute><TripDetails /></ProtectedRoute> }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;