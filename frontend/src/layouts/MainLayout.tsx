import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-soc-bg text-soc-text font-sans">
      {/* Fixed top Navbar - h-14 to match Navbar height */}
      <Navbar />

      <div className="flex pt-14">
        {/* Fixed left Sidebar */}
        <Sidebar />

        {/* Independently scrolling main content */}
        <main className="flex-1 min-h-[calc(100vh-3.5rem)] ml-64 p-6 lg:p-8 overflow-y-auto bg-soc-bg">
          <div className="max-w-[1440px] mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
