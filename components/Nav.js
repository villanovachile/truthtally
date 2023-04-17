import Link from 'next/link';
import { slide as Menu } from 'react-burger-menu';
import { useState, useEffect } from 'react';
import styles from '@/styles/Nav.module.css';

const Nav = () => {
  const [isOpen, setOpen] = useState(false);

  const handleIsOpen = () => {
    setOpen(!isOpen);
  };

  const closeSideBar = () => {
    setOpen(false);
  };
  //   const [hamburger, setHamburger] = useState(false);

  //   useEffect(() => {
  //     window.innerWidth > 768 ? setHamburger(false) : setHamburger(true);
  //     const handleResize = () => {
  //       window.innerWidth > 768 ? setHamburger(false) : setHamburger(true);
  //       // setShowContent(true);
  //       // setIsCollapsed(false);
  //     };

  //     window.addEventListener('resize', handleResize);
  //     return () => window.removeEventListener('resize', handleResize);
  //   }, []);

  return (
    <div className="nav">
      <div id={styles['nav-desktop']}>
        <Link href="/list">Create List</Link>
        <Link href="/lists/unranked">Unranked Lists</Link>
        <Link href="/lists/ranked">Ranked Lists</Link>
      </div>
      <div id={styles['nav-mobile']}>
        <Menu right isOpen={isOpen} onOpen={handleIsOpen} onClose={handleIsOpen}>
          <Link href="/list" onClick={closeSideBar}>
            Create List
          </Link>
          <Link href="/lists/unranked" onClick={closeSideBar}>
            Unranked Lists
          </Link>
          <Link href="/lists/ranked" onClick={closeSideBar}>
            Ranked Lists
          </Link>
        </Menu>
      </div>
    </div>
  );
};
export default Nav;
