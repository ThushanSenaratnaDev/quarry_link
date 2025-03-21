const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const employeeSchema = new mongoose.Schema(
  {
    // Core Employee Information
    employeeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      default: () => `QM-${Math.floor(1000 + Math.random() * 9000)}`, // Auto-generate ID (customize as needed)
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    contact: {
      phone: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      address: {
        street: String,
        city: String,
        state: String,
        country: String,
        zipCode: String,
      },
    },
    emergencyContacts: [
      {
        name: String,
        relationship: String,
        phone: String,
        email: String,
      },
    ],
    profilePhoto: {
      type: String, // URL to image stored in cloud (e.g., AWS S3, Cloudinary)
      default: 'default-profile.jpg',
    },

    // Employment Details
    jobRole: {
      type: String,
      required: true,
      enum: ['Operator', 'Supervisor', 'Maintenance Technician', 'Driver', 'Admin'], // Customize roles
    },
    employmentType: {
      type: String,
      required: true,
      enum: ['Full-time', 'Part-time', 'Contractor'],
    },

    // Skills & Certifications
    skills: [
      {
        name: String, // e.g., "Excavator License"
        certificationId: String,
        expiryDate: Date,
      },
    ],

    // Time Tracking
    timeLogs: [
      {
        date: { type: Date, default: Date.now },
        clockIn: { type: Date },
        clockOut: { type: Date },
        hoursWorked: { type: Number }, // Calculated automatically (see pre-save hook)
      },
    ],

    // Absence Records
    absences: [
      {
        type: { type: String, enum: ['Sick', 'Vacation', 'Unapproved'] },
        startDate: Date,
        endDate: Date,
        notes: String,
        status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
      },
    ],

    // Payroll & Bank Details
    bankDetails: {
      accountNumber: { type: String, required: true },
      bankName: { type: String, required: true },
      routingNumber: { type: String, required: true },
    },
    salary: {
      basePay: { type: Number, required: true }, // Monthly/yearly
      overtimeRate: { type: Number, default: 0 }, // Per hour
      bonuses: { type: Number, default: 0 },
    },

    // System Access & Permissions
    userAccount: {
      username: { type: String, unique: true, sparse: true }, // Optional (only for system users)
      password: { type: String, select: false }, // Hashed
    },
    roles: {
      type: [String],
      default: ['employee'],
      enum: ['employee', 'supervisor', 'admin', 'hr'], // Role-based access control
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt
);

// Hash password before saving
employeeSchema.pre('save', async function (next) {
  if (this.isModified('userAccount.password')) {
    this.userAccount.password = await bcrypt.hash(this.userAccount.password, 10);
  }
  next();
});

// Calculate hours worked when clocking out
employeeSchema.methods.calculateHoursWorked = function (clockOutTime) {
  const log = this.timeLogs[this.timeLogs.length - 1];
  if (log && log.clockIn && !log.clockOut) {
    log.clockOut = clockOutTime;
    log.hoursWorked = (log.clockOut - log.clockIn) / (1000 * 60 * 60); // Convert ms to hours
  }
};

const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;