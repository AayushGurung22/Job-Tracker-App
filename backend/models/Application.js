const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship", "Freelance"],
    },
    workMode: {
      type: String,
      enum: ["On-site", "Hybrid", "Remote"],
    },
    salary: {
      type: String,
      trim: true,
    },
    source: {
      type: String,
      enum: ["LinkedIn", "Company Website", "Naukri.com", "Indeed", "Referral", "Other"],
    },
    status: {
      type: String,
      enum: ["Saved", "Applied", "Assessment", "Interviewing", "Offer", "Rejected"],
      default: "Applied",
    },
    applicationDate: {
      type: Date,
    },
    jobUrl: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);