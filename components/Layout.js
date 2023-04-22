import { useAuth } from '@/utils/auth-context';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Layout = ({ children }) => {
  const { user, isSignedIn } = useAuth();

  return (
    <div className="main-container">
      <Header user={user} />
      <div id="main-content">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
