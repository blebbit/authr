import React from 'react';
import { useNavigate, Link } from '@tanstack/react-router';

import { AuthrButton, DropdownMenuItem } from '@blebbit/authr-react-tanstack';

const Navbar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  return (
    <div className='flex bg-blue-600 px-2 items-center'>
      <header className='text-white p-4'>
        <Link to="/">Authr Example</Link>
      </header>
      <div className="flex flex-grow"> {children} </div>
      <AuthrButton>
        <DropdownMenuItem onSelect={() => navigate({ to: "/groups" })}>
          Groups
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => navigate({ to: "/posts" })}>
          Posts 
        </DropdownMenuItem>
      </AuthrButton>
    </div>
  );
}

export default Navbar;