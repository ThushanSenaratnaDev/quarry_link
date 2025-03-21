import mongoose from "mongoose";

const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
  employeeId: { type: String, unique: true, required: true },
  userName: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  contactNumber: { type: Number, required: true },
  address: { type: String, required: true },
  qualification: { type: [String], required: true },
  bankAccount: { type: String, required: true },
  hireDate: { type: Date, required: true },
  employmentStatus: {
    type: String,
    required: true,
    enum: ["Full-Time", "Part-Time", "Contract", "Intern"],
  },
  emergencyContact: {
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    relationship: { type: String },
  },
  permissions: { type: [String], required: true },
  position: { type: String, required: true },
  salary: { type: Number, required: true },
});

EmployeeSchema.pre("save", async function (next) {
  if(!this.isModified("password"))return(next);
  this.password = await bcrypt.hash(this.password, 10);
});

const Employee = mongoose.model("Employee", EmployeeSchema);

export default Employee;