import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const MainLayout = () => (
  <>
    <div className="bg-orb-top" />
    <div className="bg-orb-bottom" />
    <Navbar />
    <main>
      <Outlet />
    </main>
    <Footer />
  </>
);

export default MainLayout;
