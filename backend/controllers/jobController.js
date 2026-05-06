import Job from '../models/jobModel.js';
import Notification from '../models/notificationModel.js';

const notifyUser = async (userId, msg) => {
  if (userId) {
    await Notification.create({ recipient: userId, message: msg });
  }
};

export const createJob = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const jobClient = req.user._id;

    if (!jobClient) { res.status(400); throw new Error('Client ID is required'); }

    const job = new Job({ title, description, client: jobClient, status: 'PENDING' });
    const createdJob = await job.save();

    res.status(201).json(createdJob);
  } catch (err) { next(err); }
};

export const getJobs = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'CLIENT') query.client = req.user._id;
    else if (req.user.role === 'TECHNICIAN') query.technician = req.user._id;

    const jobs = await Job.find(query).populate('client', 'name email').populate('technician', 'name email');
    res.json(jobs);
  } catch (err) { next(err); }
};

export const updateJob = async (req, res, next) => {
  try {
    const { status, technician, scheduledAt, noteText } = req.body;
    const job = await Job.findById(req.params.id);

    if (!job) { res.status(404); throw new Error('Job not found'); }

    if (req.user.role === 'CLIENT' && String(job.client) !== String(req.user._id)) { res.status(403); throw new Error('Not authorized'); }
    if (req.user.role === 'TECHNICIAN' && String(job.technician) !== String(req.user._id)) { res.status(403); throw new Error('Not authorized'); }

    if (req.user.role === 'ADMIN') {
      if (technician && String(job.technician) !== technician) {
        job.technician = technician;
        await notifyUser(technician, `You have been assigned to job "${job.title}".`);
      }
      if (scheduledAt) job.scheduledAt = scheduledAt;
    }

    if (status && status !== job.status) {
      job.status = status;
      if (req.user.role !== 'CLIENT') {
        await notifyUser(job.client, `Your job "${job.title}" status changed to ${status}.`);
      }
    }

    if (noteText) {
      job.notes.push({ text: noteText, author: req.user._id });
    }

    const updatedJob = await job.save();
    res.json(updatedJob);
  } catch (err) { next(err); }
};
