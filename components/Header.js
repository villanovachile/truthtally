import React from 'react';
import Nav from './Nav';
import Link from 'next/link';

const Header = () => {
  return (
    <header>
      <Link href="/" id="title">
        Truth Tally
      </Link>

      <Nav />
    </header>
  );
};

export default Header;
