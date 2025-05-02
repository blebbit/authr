"use client";

import React from 'react';
import { Outlet } from '@tanstack/react-router';


import Navbar from '../navbar';

const Layout: React.FC<{ }> = ({  }) => {
  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar><></></Navbar>
      <main
        className='flex-grow p-4'
      ><Outlet /></main>
      <footer className='bg-gray-800 text-white p-4 w-full justify-center flex'>
        <p>&copy; 2025 example.com</p>
      </footer>
    </div>
  );
}

export default Layout;