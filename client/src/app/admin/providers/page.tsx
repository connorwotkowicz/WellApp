'use client'; 

import React, { useContext, useState, useEffect } from 'react';
import ManageProviders from '../components/ManageProviders';
import AdminLayout from '../components/AdminLayout';
import { AuthContext } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import withAdminAuth from '../../../utils/withAdminAuth';


const ProvidersPage: React.FC = () => {
  const { user, initialized } = useContext(AuthContext);  
  const [loading, setLoading] = useState(true); 
  const router = useRouter();


  useEffect(() => {
    if (!initialized) return; 


    console.log('User data from context:', user);


    if (!user || !user.email) {
      console.log('User is not logged in, redirecting to login...');
      router.push('/login');  
    }

    setLoading(false); 
  }, [user, initialized, router]);


  if (loading || !initialized) {
    return <div>Loading...</div>;
  }

  return (
    <AdminLayout user={user}>
      <ManageProviders />  {}
    </AdminLayout>
  );
};

export default withAdminAuth(ProvidersPage);
