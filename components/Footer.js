import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer>
      <Link href="/about">About</Link>
      <Link href="/privacy">Privacy</Link>
      <Link href="/contact">Contact</Link>
    </footer>
  );
};

export default Footer;
