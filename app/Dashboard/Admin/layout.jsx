import React from 'react';

import Navbar from '@/components/Commun/navbar/page';
import Sidebar from '@/components/Commun/sidebar/page';

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-grow">
        <Navbar />
        <main className="flex-grow ">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;