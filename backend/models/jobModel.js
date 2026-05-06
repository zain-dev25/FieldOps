import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ['PENDING', 'SCHEDULED', 'EN_ROUTE', 'IN_PROGRESS', 'COMPLETED'],
      default: 'PENDING',
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    technician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    scheduledAt: { type: Date },
    notes: [noteSchema],
  },
  { timestamps: true }
);

const Job = mongoose.model('Job', jobSchema);
export default Job;
