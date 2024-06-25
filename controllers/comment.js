import { createError } from "../error.js";
import Comment from "../models/Comment.js";
import Video from "../models/Video.js";

export const addComment = async (req, res, next) => {
  const newComment = new Comment({ ...req.body, userId: req.user.id });
  try {
    const savedComment = await newComment.save();
    res.status(200).send(savedComment);
  } catch (err) {
    next(err);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    // Find the comment by its ID
    const comment = await Comment.findById(req.params.id);
    
    // Find the video by its ID (if needed, adjust as per your schema)
    // const video = await Video.findById(req.params.videoId);
    
    // Check if the comment exists
    if (!comment) {
      return next(createError(404, 'Comment not found.'));
    }
    
    // Check if the logged-in user is authorized to delete the comment
    if (req.user.id !== comment.userId) {
      return next(createError(403, 'You are not authorized to delete this comment.'));
    }
    
    // Delete the comment
    await Comment.findByIdAndDelete(req.params.id);
    
    // Respond with a success message
    res.status(200).json({ message: 'The comment has been deleted.' });
    
    // Optionally log success
    console.log(`Comment with ID ${req.params.id} deleted successfully.`);
  } catch (err) {
    // Pass the error to the error handling middleware
    next(err);
    
    // Optionally log the error for debugging purposes
    console.error('Error deleting comment:', err);
  }
};


export const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ videoId: req.params.videoId });
    res.status(200).json(comments);
  } catch (err) {
    next(err);
  }
};
