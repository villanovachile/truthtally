import Header from '@/components/Header';

const Layout = ({ children }) => {
  return (
    <div className="main-container">
      <Header />
      {children}
    </div>
  );
};

export default Layout;
