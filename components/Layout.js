import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Layout = ({ children }) => {
  return (
    <div className="main-container">
      <Header />
      <div id="main-content">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
