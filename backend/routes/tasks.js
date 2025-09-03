import express from "express";
import { body, validationResult } from "express-validator";
import auth from "../middleware/auth.js";
import Task from "../models/Task.js";

const router = express.Router();

function computeStatus(task) {
  if (task.completed) return "completed";
  const now = new Date();
  if (new Date(task.dueDate) < now) return "overdue";
  return "pending";
}
router.get("/", auth, async (req, res) => {
  try {
    const statusFilter = req.query.status || "all";
    const query = { owner: req.user.id };

    let tasks = await Task.find(query).sort({ dueDate: 1, createdAt: -1 });
    tasks = tasks.map((t) => {
      const obj = t.toObject();
      obj.status = computeStatus(obj);
      return obj;
    });

    if (statusFilter !== "all")
      tasks = tasks.filter((t) => t.status === statusFilter);

    const summary = tasks.reduce((acc, t) => {
      acc[t.status] = (acc[t.status] || 0) + 1;
      return acc;
    }, {});

    res.json({ tasks, summary });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});
router.post(
  "/",
  [
    auth,
    body("title", "Title is required").notEmpty(),
    body("dueDate", "Valid dueDate required").isISO8601(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const { title, description, dueDate } = req.body;
      const task = new Task({
        title,
        description,
        dueDate,
        owner: req.user.id,
      });
      await task.save();
      const obj = task.toObject();
      obj.status = computeStatus(obj);
      res.status(201).json(obj);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

router.put(
  "/:id",
  [auth, body("dueDate").optional().isISO8601()],
  async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);
      if (!task) return res.status(404).json({ message: "Task not found" });
      if (task.owner.toString() !== req.user.id)
        return res.status(403).json({ message: "Unauthorized" });

      const { title, description, dueDate } = req.body;
      if (title !== undefined) task.title = title;
      if (description !== undefined) task.description = description;
      if (dueDate !== undefined) task.dueDate = dueDate;

      await task.save();
      const obj = task.toObject();
      obj.status = computeStatus(obj);
      res.json(obj);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);


router.patch("/:id/complete", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    if (task.owner.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    task.completed = true; 
    await task.save();

    const obj = task.toObject();
    obj.status = computeStatus(obj);
    res.json(obj);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    if (task.owner.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    await task.deleteOne();
    res.json({ message: "Task removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});



// Update task (title, dueDate)
router.put("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    if (task.owner.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    const { title, dueDate } = req.body;
    if (title) task.title = title;
    if (dueDate) task.dueDate = dueDate;

    await task.save();
    const obj = task.toObject();
    obj.status = computeStatus(obj);

    res.json(obj);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


export default router;
