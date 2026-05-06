import Notification from '../models/notificationModel.js';

// @desc  Get logged-in user's notifications
// @route GET /api/notifications
// @access Private
const getNotifications = async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50);
  res.json(notifications);
};

// @desc  Mark a single notification as read
// @route PUT /api/notifications/:id/read
// @access Private
const markAsRead = async (req, res) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    recipient: req.user._id,
  });

  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  notification.read = true;
  await notification.save();
  res.json(notification);
};

// @desc  Mark all notifications as read
// @route PUT /api/notifications/read-all
// @access Private
const markAllAsRead = async (req, res) => {
  await Notification.updateMany(
    { recipient: req.user._id, read: false },
    { read: true }
  );
  res.json({ message: 'All notifications marked as read' });
};

// @desc  Create a notification (used internally by other controllers)
// @route POST /api/notifications
// @access Private + Admin
const createNotification = async (req, res) => {
  const { recipientId, message } = req.body;

  if (!recipientId || !message) {
    res.status(400);
    throw new Error('recipientId and message are required');
  }

  const notification = await Notification.create({
    recipient: recipientId,
    message,
  });

  res.status(201).json(notification);
};

// @desc  Delete a notification
// @route DELETE /api/notifications/:id
// @access Private
const deleteNotification = async (req, res) => {
  const notification = await Notification.findOneAndDelete({
    _id: req.params.id,
    recipient: req.user._id,
  });

  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  res.json({ message: 'Notification deleted' });
};

export {
  getNotifications,
  markAsRead,
  markAllAsRead,
  createNotification,
  deleteNotification,
};
