'use client';

import React, { useContext } from 'react';
import ManageServices from '../components/ManageServices';
import AdminLayout from '../components/AdminLayout';
import { AuthContext } from '../../context/AuthContext';

const ServicesPage: React.FC = () => {
  const { user, initialized } = useContext(AuthContext);

  if (!initialized) {
    return <div>Loading...</div>;
  }

  if (!user || !user.email) {
    return <div>You are not logged in. Please log in to continue.</div>;
  }

  return (
    <AdminLayout user={user}>
      <ManageServices />
    </AdminLayout>
  );
};

export default ServicesPage;
