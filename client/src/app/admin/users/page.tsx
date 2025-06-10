'use client';

import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import AdminLayout from '../components/AdminLayout';
import ManageUsers from '../components/ManagerUsers';

const UsersPage: React.FC = () => {
  const { user } = useContext(AuthContext);

  if (!user) return <div>Loading...</div>; 

  return (
    <AdminLayout user={user}>
      <ManageUsers />
    </AdminLayout>
  );
};

export default UsersPage;
