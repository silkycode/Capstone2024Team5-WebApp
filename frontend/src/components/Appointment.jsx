import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  // Fetch appointments from the backend
  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/appointments');
      setAppointments(response.data);
    } catch (error) {
      console.error('Failed to fetch appointments', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/appointments', { title, date, time });
      // Refresh the appointments list
      fetchAppointments();
      // Clear the form fields
      setTitle('');
      setDate('');
      setTime('');
    } catch (error) {
      console.error('Failed to create appointment', error);
    }
  };

  const handleDelete = async (appointmentId) => {
    try {
      await axios.delete(`http://localhost:5000/appointments/${appointmentId}`);
      // Refresh the appointments list
      fetchAppointments();
    } catch (error) {
      console.error('Failed to delete appointment', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
        <button type="submit">Make Appointment</button>
      </form>

      <div>
        <h2>Appointments</h2>
        {appointments.map((appointment) => (
          <div key={appointment.appointment_id}>
            <p>{appointment.title} - {appointment.date} at {appointment.time}</p>
            <button onClick={() => handleDelete(appointment.appointment_id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Appointment;
