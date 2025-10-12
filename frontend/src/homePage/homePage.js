import React from "react";
import Poll from "../components/poll/poll";
import "./homePage.css";

function Homepage() {
  const userName = "John Doe";

  return (
    <div className="homepage-container">
      {/* Top Navigation */}
      <nav className="top-nav">
        <p className="user-name">Welcome, {userName}</p>
      </nav>

      {/* Left Sidebar */}
      <aside className="sidebar">
        <ul>
          <button>Create poll</button>
          <li>Home</li>
          <li>User Poll</li>
          <li>Log Out</li>
        </ul>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <div className="poll-container">
          {/* Render Poll component(s) here */}
          <Poll />
          <Poll />
          <Poll />
        </div>
      </main>
    </div>
  );
}

export default Homepage;
