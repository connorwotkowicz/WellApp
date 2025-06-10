
'use client';

import React, { useContext } from 'react';  
import ManageBookings from '../components/ManageBookings'; 
import AdminLayout from '../components/AdminLayout';
import { AuthContext } from '../../context/AuthContext';  

const AdminBookingsPage: React.FC = () => {
  const { user, initialized } = useContext(AuthContext); 


  if (!initialized) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Admin Bookings Dashboard</h1>
      <AdminLayout user={user}> 
        <ManageBookings />
      </AdminLayout>
    </div>
  );
};

export default AdminBookingsPage;
