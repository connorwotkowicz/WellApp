import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

interface Booking {
  booking_id: number;
  user_id: number;
  provider_id: number;
  service_id: number;
  booking_time: string;
  status: string;
  service_name: string;
  provider_name: string;
  user_name: string;
}

const ManageBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [newProviderId, setNewProviderId] = useState<number | null>(null);
  const [newServiceId, setNewServiceId] = useState<number | null>(null);
  const [newTime, setNewTime] = useState<string>('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get<Booking[]>('/api/bookings');
        setBookings(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setError('Failed to fetch bookings');
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleEditClick = (booking: Booking) => {
    setEditingBooking(booking);
    setNewProviderId(booking.provider_id);
    setNewServiceId(booking.service_id);
    setNewTime(booking.booking_time);
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBooking) {
      const updatedBooking = {
        provider_id: newProviderId,
        service_id: newServiceId,
        time: newTime,
      };

      try {
        const response = await axios.put(`/api/bookings/${editingBooking.booking_id}`, updatedBooking);
        const updatedBookingData = response.data;
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking.booking_id === updatedBookingData.booking_id
              ? { ...booking, ...updatedBookingData }
              : booking
          )
        );
        setEditingBooking(null); 
        toast.success('Booking updated successfully');
      } catch (error) {
        console.error('Error updating booking:', error);
        toast.error('Failed to update booking');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingBooking(null); 
  };

  const deleteBooking = async (id: number) => {
    try {
      const response = await axios.delete(`/api/bookings/${id}`);
      if (response.status === 200) {
        setBookings(bookings.filter((booking) => booking.booking_id !== id));
        toast.success('Booking deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast.error('Failed to delete booking');
    }
  };

  const handleStatusChange = async (bookingId: number, status: string) => {
    try {
      const response = await axios.put(`/api/bookings/${bookingId}/status`, { status });
      const updatedBooking = response.data;
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.booking_id === updatedBooking.booking_id
            ? { ...booking, status: updatedBooking.status }
            : booking
        )
      );
      toast.success('Booking status updated');
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="manage-bookings">
      <h1>Manage Bookings</h1>
      <table>
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>User Name</th>
            <th>Provider Name</th>
            <th>Service Name</th>
            <th>Booking Time</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.booking_id}>
              <td>{booking.booking_id}</td>
              <td>{booking.user_name}</td>
              <td>{booking.provider_name}</td>
              <td>{booking.service_name}</td>
              <td>{booking.booking_time}</td>
              <td>
                <select
                  value={booking.status || ""}
                  onChange={(e) => handleStatusChange(booking.booking_id, e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </td>
              <td>
                <button  className="action-btn edit-btn" onClick={() => handleEditClick(booking)} >Edit</button>
                <button className="action-btn delete-btn"  onClick={() => deleteBooking(booking.booking_id)} >Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>


{editingBooking && (
  <div className="modal show">
    <div className="modal-content">
      <span className="modal-close" onClick={handleCancelEdit}>&times;</span>
      <h2>Edit Booking</h2>
      <form onSubmit={handleSubmitEdit}>
        <div className="modal-body">
          <div className="form-group">
            <label>Provider ID:</label>
            <input
              type="number"
              value={newProviderId ?? ''}
              onChange={(e) => setNewProviderId(Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label>Service ID:</label>
            <input
              type="number"
              value={newServiceId ?? ''}
              onChange={(e) => setNewServiceId(Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label>Booking Time:</label>
            <input
              type="datetime-local"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="modal-button" type="submit">Save</button>
          <button className="modal-button" type="button" onClick={handleCancelEdit}>Cancel</button>
        </div>
      </form>
    </div>
  </div>
)}

      
      <ToastContainer />
    </div>
  );
};

export default ManageBookings;
