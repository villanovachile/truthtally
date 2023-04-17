import React from 'react';
import Nav from './Nav';
import Link from 'next/link';
import Image from 'next/image';

const Header = () => {
  return (
    <header>
      <Link href="/" id="title">
        Truth Tally
        <Image
          src="/images/logo192.png"
          alt="Truth Tally logo"
          width={20}
          height={20}
          style={{ margin: '0px 0px 0px 20px' }}
        />
      </Link>

      <Nav />
    </header>
  );
};

export default Header;
