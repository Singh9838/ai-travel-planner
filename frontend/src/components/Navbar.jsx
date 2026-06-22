import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login", {
      replace: true,
    });
  };

  return (
    <nav className="navbar">
      <Link
        to="/dashboard"
        className="logo"
      >
        ✈️ AI Travel Planner
      </Link>

      <div className="nav-links">
        <Link to="/dashboard">
          Dashboard
        </Link>

        <Link to="/create-trip">
          Create Trip
        </Link>

        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;