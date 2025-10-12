import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Poll from "../components/poll/poll";
import "./homePage.css";

function Homepage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("userSession");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserName(parsedUser.name || "User");
    } else {
      // If no user session found, redirect to login
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userSession");
    navigate("/");
  };

  const handleLCreateButton = () => {
    navigate("/createpoll");
  };

  return (
    <div className="homepage-container">
      {/* Top Navigation */}
      <nav className="top-nav">
        <p className="user-name">Welcome, {userName}</p>
      </nav>

      {/* Left Sidebar */}
      <aside className="sidebar">
        <ul>
          <button onClick={handleLCreateButton}>Create poll</button>
          <li>Home</li>
          <li>User Poll</li>
          <li>
            <button onClick={handleLogout}>Log Out</button>
          </li>
        </ul>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <div className="poll-container">
          <Poll />
          <Poll />
          <Poll />
        </div>
      </main>
    </div>
  );
}

export default Homepage;
