import React from 'react';
import Nav from './Nav';
import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  return (
    <header>
      <Link href="/" id="title">
        <Image
          src="/images/logo192.png"
          alt="Truth Tally logo"
          width={25}
          height={25}
          style={{ margin: '0px 50px 0px 0px' }}
        />
      </Link>

      <Nav />
    </header>
  );
};

export default Header;
