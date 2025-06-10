'use client';

import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../app/context/AuthContext';

const withAdminAuth = (WrappedComponent: React.FC) => {
  return function ProtectedComponent(props: any) {
    const { user, initialized } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
      if (initialized && (!user || user.user_role !== 'admin')) {
        router.replace('/login'); 
      }
    }, [user, initialized, router]);
    console.log("Auth check →", {
  initialized,
  user,
  role: user?.user_role,
});


    if (!initialized || !user || user.user_role !== 'admin') {
      return null; 
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAdminAuth;
