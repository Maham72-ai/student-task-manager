import express from 'express';
import Task from '../models/Task.js';

const router = express.Router();

// GET all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST add task
router.post('/', async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || title.trim() === '') {
      return res.status(400).json({ success: false, message: 'Task title cannot be empty' });
    }
    const newTask = await Task.create({ title: title.trim() });
    res.status(201).json({ success: true, message: 'Task added', data: newTask });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE task by ID
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.status(200).json({ success: true, message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// BONUS: Mark complete
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    task.completed = !task.completed;
    await task.save();
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
