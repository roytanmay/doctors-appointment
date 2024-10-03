const {
  bookAppointment,
  viewAppointment,
  viewAllAppointments,
  cancelAppointment,
  modifyAppointment,
} = require("../controllers/appointmentController");

let req, res;

let mockAppointments = [];

beforeEach(() => {
  req = {};
  res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  mockAppointments = [];
});

test("should book an appointment successfully", () => {
  req.body = {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    timeSlot: "10:00 AM - 11:00 AM",
    doctorName: "Dr. John Doe",
  };

  bookAppointment(req, res);

  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith({
    message: "Appointment booked successfully",
    appointment: {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      timeSlot: "10:00 AM - 11:00 AM",
      doctorName: "Dr. John Doe",
    },
  });
});

test("should return appointment details for a valid patient email", () => {
  req.query = { email: "john@example.com" };

  viewAppointment(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    timeSlot: "10:00 AM - 11:00 AM",
    doctorName: "Dr. John Doe",
  });
});

test("should modify the appointment time slot successfully", () => {
  mockAppointments.push({
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    timeSlot: "10:00 AM - 11:00 AM",
    doctorName: "Dr. John Doe",
  });

  req.body = {
    email: "john@example.com",
    originalTimeSlot: "10:00 AM - 11:00 AM",
    newTimeSlot: "11:00 AM - 12:00 PM",
  };

  modifyAppointment(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({
    message: "Appointment modified successfully",
    appointment: {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      timeSlot: "11:00 AM - 12:00 PM",
      doctorName: "Dr. John Doe",
    },
  });
});

test("should return all appointments for a specific doctor", () => {
  req.query = { doctorName: "Dr. John Doe" };

  viewAllAppointments(req, res);

  console.log("Res.json was called with:", res.json.mock.calls[0][0]);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith([
    {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      timeSlot: "11:00 AM - 12:00 PM",
      doctorName: "Dr. John Doe",
    },
  ]);
});

test("should cancel the appointment successfully", () => {
  req.body = {
    email: "john@example.com",
    timeSlot: "11:00 AM - 12:00 PM",
  };

  cancelAppointment(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({
    message: "Appointment cancelled successfully",
  });

  expect(mockAppointments).toHaveLength(0);
});

test("should return error if appointment is not found for cancellation", () => {
  req.body = {
    email: "jane@example.com",
    timeSlot: "10:00 AM - 11:00 AM",
  };

  cancelAppointment(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({
    message: "No appointment found to cancel",
  });
});
