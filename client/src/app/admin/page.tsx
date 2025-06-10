'use client';

import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import AdminLayout from './components/AdminLayout';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import withAdminAuth from '../../utils/withAdminAuth';

const actions = [
  { title: 'Manage Providers', path: '/admin/providers', description: 'View and manage service providers' },
  { title: 'Manage Services', path: '/admin/services', description: 'View and manage services offered' },
  { title: 'Manage Users', path: '/admin/users', description: 'View and manage users and their roles' },
  {title: 'Manage Bookings', path: '/admin/bookings', description: 'View and manage bookings'}
];

const Dashboard: React.FC = () => {
  const { user, initialized } = useContext(AuthContext); 
  const [loading, setLoading] = useState(true); 
  const router = useRouter();

  useEffect(() => {
    if (!initialized) {
      return; 
    }


    console.log('User data from context:', user);


    if (!user) {
      console.log('No user found, redirecting to login...');
      router.push('/login');
    }

    setLoading(false); 
  }, [user, initialized, router]);


  if (loading || !initialized) {
    return <div>Loading...</div>;
  }


  return (
    <AdminLayout user={user}>
      <div className="admin-dashboard">
        <div className="dashboard-grid">
          {actions.map((action) => (
            <Link href={action.path} key={action.title}>
              <div className="dashboard-card">
                <h2>{action.title}</h2>
                <p>{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default withAdminAuth(Dashboard);
