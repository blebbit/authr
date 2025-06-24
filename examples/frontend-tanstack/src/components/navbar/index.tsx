import React from 'react';
import { useNavigate, Link } from '@tanstack/react-router';

import { AuthrButton, DropdownMenuItem } from '@blebbit/authr-react-tanstack';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div className='flex bg-blue-600 px-2 items-center'>
      <header className='text-white p-3'>
        <Link to="/">Authr Example</Link>
      </header>
      <div className="flex flex-grow">
        <div className="flex flex-grow justify-center gap-4">
          <Link to="/pages" className='text-white hover:underline'>Pages</Link>
          <Link to="/groups" className='text-white hover:underline'>Groups</Link>
        </div>
      </div>
      <AuthrButton>
        <DropdownMenuItem onSelect={() => navigate({ to: "/groups" })}>
          Groups
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => navigate({ to: "/pages" })}>
          Pages
        </DropdownMenuItem>
      </AuthrButton>
    </div>
  );
}

export default Navbar;