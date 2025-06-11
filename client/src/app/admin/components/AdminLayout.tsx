import { useEffect, useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';

interface User {
  name?: string;
  user_role: string;
  email: string;
}

interface AdminLayoutProps {
  user: User | null;
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ user, children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    document.body.classList.add('admin-page');
    return () => {
      document.body.classList.remove('admin-page');
    };
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="admin-layout-wrapper">
      <div className="admin-console">
        <AdminTopbar /> 
        <AdminSidebar user={user} isOpen={isSidebarOpen} />
        <div className="admin-content">
          <main className="admin-main">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
