// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import Dashboard from "./pages/Dashboard";
// import './App.css'

// function App() {
//   const token = localStorage.getItem("token");

//   return (
//     <Router>
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route
//           path="/"
//           element={token ? <Dashboard /> : <Navigate to="/login" />}
//         />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import './App.css'

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Optional: update token from localStorage if changed in another tab
  useEffect(() => {
    const handleStorageChange = () => setToken(localStorage.getItem("token"));
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={<Login setToken={setToken} />} 
        />
        <Route 
          path="/signup" 
          element={<Signup setToken={setToken} />} 
        />
        <Route 
          path="/" 
          element={token ? <Dashboard setToken={setToken} /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
