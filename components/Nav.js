import Link from 'next/link';
import { slide as Menu } from 'react-burger-menu';
import { useState } from 'react';
import styles from '@/styles/Nav.module.css';
import { firebase, auth } from '@/middlewares/firebase';
import { useAuth } from '@/utils/auth-context';

const Nav = () => {
  const { user, isSignedIn } = useAuth();

  const [isOpen, setOpen] = useState(false);
  const handleIsOpen = () => {
    setOpen(!isOpen);
  };

  const closeSideBar = () => {
    setOpen(false);
  };

  return (
    <div className="nav">
      <div id={styles['nav-desktop']}>
        <Link href="/">Home</Link>
        <Link href="/list">Create List</Link>
        <Link href="/lists/unranked">Unranked Lists</Link>
        <Link href="/lists/ranked">Ranked Lists</Link>
      </div>
      <div id={styles['nav-mobile']}>
        <Menu right isOpen={isOpen} onOpen={handleIsOpen} onClose={handleIsOpen}>
          <Link href="/" onClick={closeSideBar}>
            Home
          </Link>
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
