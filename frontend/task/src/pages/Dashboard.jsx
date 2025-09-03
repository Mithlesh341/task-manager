import { useState, useEffect } from "react";
import api from "../api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Trash } from "lucide-react";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const startEdit = (task) => {
    setEditingTask(task._id);
    setEditTitle(task.title);
    setEditDueDate(task.dueDate.slice(0, 16));
  };

  const saveEdit = async (id) => {
    try {
      await api.put(`/tasks/${id}`, { title: editTitle, dueDate: editDueDate });
      toast.success("Task updated!");
      setEditingTask(null);
      fetchTasks();
    } catch {
      toast.error("Failed to update task");
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(Array.isArray(res.data) ? res.data : res.data.tasks || []);
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("token");
        window.location.href = "/login";
      } else {
        toast.error("Failed to load tasks");
      }
      setTasks([]);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    try {
      await api.post("/tasks", { title, dueDate });
      toast.success("Task added!");
      setTitle("");
      setDueDate("");
      fetchTasks();
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Unauthorized! Please log in again.");
        localStorage.removeItem("token");
        window.location.href = "/login";
      } else {
        toast.error("Failed to add task");
      }
    }
  };

  const completeTask = async (id) => {
    try {
      await api.patch(`/tasks/${id}/complete`);
      toast.success("Task completed!");
      fetchTasks();
    } catch {
      toast.error("Failed to complete task");
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      toast.success("Task deleted!");
      fetchTasks();
    } catch {
      toast.error("Failed to delete task");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 text-white p-4 md:p-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-0 tracking-wide">
          Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="bg-yellow-400 hover:bg-yellow-500 text-red-600 font-semibold rounded-2xl px-5 py-2 shadow-lg transition-transform transform hover:scale-105 cursor-pointer"
        >
          Log Out
        </button>
      </div>

      <form
        onSubmit={addTask}
        className="flex flex-col sm:flex-row gap-2 mb-6 items-center"
      >
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 p-3 rounded-xl bg-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all w-full sm:w-auto"
          required
        />
        <input
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="p-3 rounded-xl bg-gray-100 text-black w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          required
        />
        <button className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl shadow-lg transition-transform transform hover:scale-105 w-full sm:w-auto">
          +
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <motion.div
            key={task._id}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex flex-col justify-between bg-gray-800 p-4 rounded-2xl shadow-md hover:shadow-xl transition-all"
          >
            {editingTask === task._id ? (
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="p-2 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="datetime-local"
                  value={editDueDate}
                  onChange={(e) => setEditDueDate(e.target.value)}
                  className="p-2 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => saveEdit(task._id)}
                    className="bg-blue-600 px-3 py-1 rounded-xl shadow hover:shadow-lg transition-transform transform hover:scale-105"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingTask(null)}
                    className="bg-gray-600 px-3 py-1 rounded-xl shadow hover:shadow-lg transition-transform transform hover:scale-105"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-3">
                  <h3 className="font-semibold text-lg">{task.title}</h3>

                  <p className="text-sm text-gray-400">
                    Due:{" "}
                    {new Date(task.dueDate).toLocaleString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p
                    className={`text-xs mt-1 font-medium ${
                      task.status === "overdue"
                        ? "text-red-400"
                        : task.status === "completed"
                        ? "text-green-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {task.status}
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {task.status !== "completed" && (
                    <button
                      onClick={() => completeTask(task._id)}
                      className="bg-green-600 px-3 py-1 rounded-xl shadow hover:shadow-lg transition-transform transform hover:scale-105 cursor-pointer"
                    >
                      ✓
                    </button>
                  )}
                  <button
                    onClick={() => startEdit(task)}
                    className="bg-yellow-500 px-3 py-1 rounded-xl shadow hover:shadow-lg transition-transform transform hover:scale-105 cursor-pointer"
                  >
                    ✎
                  </button>
                  <button
                    onClick={() => deleteTask(task._id)}
                    className="bg-red-600 px-3 py-1 rounded-xl shadow hover:shadow-lg transition-transform transform hover:scale-105 cursor-pointer flex items-center justify-center"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
