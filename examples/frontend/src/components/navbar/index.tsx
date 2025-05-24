import React from 'react';
import { Link } from '@tanstack/react-router';

import { AuthrButton } from '@blebbit/authr-react';

const Navbar: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  return (
    <div className='flex bg-blue-600 px-2 items-center'>
      <header className='text-white p-4'>
        <Link to="/">Authr Example</Link>
      </header>
      <div className="flex flex-grow"> {children} </div>
      <AuthrButton />
    </div>
  );
}

export default Navbar;