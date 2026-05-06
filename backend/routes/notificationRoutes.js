import express from 'express';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  createNotification,
  deleteNotification,
} from '../controllers/notificationController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all notifications for logged-in user
router.route('/').get(protect, getNotifications).post(protect, admin, createNotification);

// Mark all as read
router.put('/read-all', protect, markAllAsRead);

// Mark single as read / delete single
router.route('/:id/read').put(protect, markAsRead);
router.route('/:id').delete(protect, deleteNotification);

export default router;
