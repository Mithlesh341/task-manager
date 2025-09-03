// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import api from "../api";
// import toast from "react-hot-toast";
// import { motion } from "framer-motion";

// export default function Signup() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await api.post("/auth/register", { name, email, password });
//       toast.success("Signup successful! Please login.");
//       navigate("/login");
//     } catch (err) {
//       toast.error(err.response?.data?.msg || "Signup failed");
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-gray-900"
//     >
//       <form
//         onSubmit={handleSubmit}
//         className="bg-gray-800 bg-opacity-90 backdrop-blur-md p-10 rounded-2xl w-96 shadow-2xl space-y-6"
//       >
//         <h2 className="text-3xl font-bold text-center text-white mb-4 tracking-wide">
//           Create Account
//         </h2>

//         <input
//           type="text"
//           placeholder="Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           className="w-full p-3 rounded-xl bg-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
//           required
//         />
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="w-full p-3 rounded-xl bg-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full p-3 rounded-xl bg-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
//           required
//         />

//         <button className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold p-3 rounded-xl shadow-lg transform transition-all hover:scale-105">
//           Sign Up
//         </button>

//         <p className="text-sm text-center text-gray-300">
//           Already have an account?{" "}
//           <Link to="/login" className="text-indigo-400 font-medium hover:underline">
//             Login
//           </Link>
//         </p>
//       </form>
//     </motion.div>
//   );
// }



import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function Signup({ setToken }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1️⃣ Register the user
      await api.post("/auth/register", { name, email, password });
      toast.success("Signup successful!");

      // 2️⃣ Immediately login the user
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);

      // 3️⃣ Update App state so dashboard shows immediately
      if (setToken) setToken(res.data.token);

      toast.success("Logged in successfully!");
      navigate("/"); // Redirect to dashboard
    } catch (err) {
      toast.error(err.response?.data?.msg || "Signup failed");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-gray-900"
    >
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 bg-opacity-90 backdrop-blur-md p-10 rounded-2xl w-96 shadow-2xl space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-white mb-4 tracking-wide">
          Create Account
        </h2>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 rounded-xl bg-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded-xl bg-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded-xl bg-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          required
        />

        <button className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold p-3 rounded-xl shadow-lg transform transition-all hover:scale-105">
          Sign Up
        </button>

        <p className="text-sm text-center text-gray-300">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 font-medium hover:underline">
            Login
          </Link>
        </p>
      </form>
    </motion.div>
  );
}
