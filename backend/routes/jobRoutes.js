import express from 'express';
import { createJob, getJobs, updateJob } from '../controllers/jobController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createJob).get(protect, getJobs);
router.route('/:id').put(protect, updateJob);

export default router;
