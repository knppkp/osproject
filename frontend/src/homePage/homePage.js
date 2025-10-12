// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Poll from "../components/poll/poll";
// import axios from "axios";
// import "./homePage.css";

// function Homepage() {
//   const navigate = useNavigate();
//   const [user, setUser] = useState(null);
//   const [polls, setPolls] = useState([]);

//   useEffect(() => {
//     const storedUser = localStorage.getItem("userSession");

//     if (storedUser) {
//       const parsedUser = JSON.parse(storedUser);
//       setUser(parsedUser);

//       // ✅ Fetch polls for this user
//       const fetchUserPolls = async () => {
//         try {
//           const res = await axios.get(
//             `/api/polls/user/${parsedUser.user_id || parsedUser.id}`
//           );
//           console.log("User polls:", res.data); // check in console
//           setPolls(res.data);
//         } catch (err) {
//           console.error("Failed to fetch user polls:", err);
//         }
//       };

//       fetchUserPolls();
//     } else {
//       // No session, redirect to login
//       navigate("/");
//     }
//   }, [navigate]);

//   const handleLogout = () => {
//     localStorage.removeItem("userSession");
//     navigate("/");
//   };

//   const handleCreatePoll = () => {
//     navigate("/createpoll");
//   };

//   return (
//     <div className="homepage-container">
//       {/* Top Navigation */}
//       <nav className="top-nav">
//         <p className="user-name">Welcome, {user?.name || "User"}</p>
//       </nav>

//       {/* Left Sidebar */}
//       <aside className="sidebar">
//         <ul>
//           <button onClick={handleCreatePoll}>Create poll</button>
//           <li>Home</li>
//           <li>User Poll</li>
//           <li>
//             <button onClick={handleLogout}>Log Out</button>
//           </li>
//         </ul>
//       </aside>

//       {/* Main Content Area */}
//       <main className="main-content">
//         <div className="poll-container">
//           {polls.length > 0 ? (
//             polls.map((poll) => (
//               <Poll key={poll.poll_id} {...poll} pollData={poll} />
//             ))
//           ) : (
//             <p>No polls found.</p>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }

// export default Homepage;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Poll from "../components/poll/poll";
import axios from "axios";
import "./homePage.css";

function Homepage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("userSession");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      // Fetch polls for this user
      const fetchUserPolls = async () => {
        try {
          const res = await axios.get(
            `/api/polls/user/${parsedUser.user_id || parsedUser.id}`
          );
          console.log("User polls:", res.data);

          // For each poll, fetch choices and voters
          const detailedPolls = await Promise.all(
            res.data.map(async (poll) => {
              const pollDetail = await axios.get(`/api/polls/${poll.poll_id}`);
              return pollDetail.data;
            })
          );

          setPolls(detailedPolls);
          console.log("poll choice and voter", detailedPolls);
        } catch (err) {
          console.error("Failed to fetch user polls:", err);
        }
      };

      fetchUserPolls();
    } else {
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userSession");
    navigate("/");
  };

  const handleCreatePoll = () => {
    navigate("/createpoll");
  };

  return (
    <div className="homepage-container">
      <nav className="top-nav">
        <p className="user-name">Welcome, {user?.name || "User"}</p>
      </nav>

      <aside className="sidebar">
        <ul>
          <li>
            <button onClick={handleCreatePoll}>Create poll</button>
          </li>
          <li>Home</li>
          <li>User Poll</li>
          <li>
            <button onClick={handleLogout}>Log Out</button>
          </li>
        </ul>
      </aside>

      <main className="main-content">
        <div className="poll-container">
          {polls.length > 0 ? (
            polls.map((poll) => <Poll key={poll.poll_id} pollData={poll} />)
          ) : (
            <p>No polls found.</p>
          )}
        </div>
      </main>
    </div>
  );
}

export default Homepage;
