const appointments = [];
let doctorAppointments = {
  "Dr. John Doe": [
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "1:00 PM - 2:00 PM",
  ],
  "Dr. Jane Smith": ["9:00 AM - 10:00 AM", "2:00 PM - 3:00 PM"],
  "Dr. Emily Clark": [
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "1:00 PM - 2:00 PM",
  ],
};
const doctors = ["Dr. John Doe", "Dr. Jane Smith", "Dr. Emily Clark"];

exports.bookAppointment = (req, res) => {
  const { firstName, lastName, email, timeSlot, doctorName } = req.body;

  if (!doctorAppointments[doctorName]) {
    return res.status(404).json({ message: "Doctor not found" });
  }

  const availableSlots = doctorAppointments[doctorName];
  if (!availableSlots.includes(timeSlot)) {
    return res.status(400).json({ message: "Time slot is not available" });
  }

  const existingAppointment = appointments.find(
    (a) => a.timeSlot === timeSlot && a.doctorName === doctorName
  );

  if (existingAppointment) {
    return res.status(400).json({ message: "Time slot already booked" });
  }

  const newAppointment = { firstName, lastName, email, timeSlot, doctorName };
  appointments.push(newAppointment);

  res.status(201).json({
    message: "Appointment booked successfully",
    appointment: newAppointment,
  });
};

exports.viewAppointment = (req, res) => {
  const { email } = req.query;
  const appointment = appointments.find((a) => a.email === email);

  if (!appointment) {
    return res
      .status(404)
      .json({ message: "No appointment found for this email" });
  }

  res.status(200).json(appointment);
};

exports.viewAllAppointments = (req, res) => {
  const { doctorName } = req.query;

  if (!doctors.includes(doctorName)) {
    return res.status(400).json({ message: "Invalid doctor name" });
  }

  const doctorAppointments = appointments.filter(
    (a) => a.doctorName === doctorName
  );

  res.status(200).json(doctorAppointments);
};

exports.cancelAppointment = (req, res) => {
  const { email, timeSlot } = req.body;

  const index = appointments.findIndex(
    (a) => a.email === email && a.timeSlot === timeSlot
  );

  if (index === -1) {
    return res.status(404).json({ message: "No appointment found to cancel" });
  }

  appointments.splice(index, 1);
  res.status(200).json({ message: "Appointment cancelled successfully" });
};

exports.modifyAppointment = (req, res) => {
  const { email, originalTimeSlot, newTimeSlot } = req.body;

  const appointment = appointments.find(
    (a) => a.email === email && a.timeSlot === originalTimeSlot
  );

  if (!appointment) {
    return res.status(404).json({ message: "No appointment found to modify" });
  }

  const availableSlots = doctorAppointments[appointment.doctorName];
  if (!availableSlots.includes(newTimeSlot)) {
    return res.status(400).json({ message: "Time slot is not available" });
  }

  const existingAppointment = appointments.find(
    (a) => a.timeSlot === newTimeSlot && a.doctorName === appointment.doctorName
  );
  if (existingAppointment) {
    return res.status(400).json({ message: "New time slot already booked" });
  }

  appointment.timeSlot = newTimeSlot;
  res.status(200).json({
    message: "Appointment modified successfully",
    appointment,
  });
};
