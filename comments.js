// Create web server
// Created: 06/18/2021 10:32 PM

const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');
const auth = require('../middleware/auth');

// Get all comments
router.get('/', async (req, res) => {
  try {
    const comments = await Comment.find();
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all comments for a post
router.get('/:post_id', async (req, res) => {
  try {
    const comments = await Comment.find({ post_id: req.params.post_id });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a comment
router.post('/', auth, async (req, res) => {
  const comment = new Comment({
    post_id: req.body.post_id,
    user_id: req.body.user_id,
    comment: req.body.comment,
    date_created: req.body.date_created,
  });

  try {
    const newComment = await comment.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a comment
router.patch('/:id', auth, getComment, async (req, res) => {
  if (req.body.comment != null) {
    res.comment.comment = req.body.comment;
  }

  try {
    const updatedComment = await res.comment.save();
    res.json(updatedComment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a comment
router.delete('/:id', auth, getComment, async (req, res) => {
  try {
    await res.comment.remove();
    res.json({ message: 'Comment has been deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware
async function getComment(req, res, next) {
  let comment;
  try {
    comment = await Comment.findById(req.params.id);

    if (comment == null) {
      return res.status(404).json({ message: 'Cannot