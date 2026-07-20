import SearchBar from '../components/home/SearchBar';
import PopularTests from '../components/home/PopularTests';
import HowItWorks from '../components/home/HowItWorks';
import './HomePage.css';
import heroDoctor from '../assets/images/hero-doctor.png';
import { ShieldCheck, Home as HomeIcon, Tag, Lock } from 'lucide-react';

const trustItems = [
  { icon: ShieldCheck, title: 'Certified Labs', desc: '100% Verified' },
  { icon: HomeIcon, title: 'Home Collection', desc: 'Safe & Convenient' },
  { icon: Tag, title: 'Best Prices', desc: 'Compare & Save' },
  { icon: Lock, title: 'Secure Reports', desc: 'Fast & Reliable' },
];

const HomePage = () => (
  <div className="lb-home">
    <section className="lb-hero">
      <div className="container lb-hero__inner">
        <div className="lb-hero__content">
          <h1 className="lb-hero__title">
            Get the best deals on test/scans
            <br />
            <span className="lb-hero__title--accent">from certified labs</span>
          </h1>
          <SearchBar />

          <div className="lb-trust-row">
            {trustItems.map(({ icon: Icon, title, desc }) => (
              <div className="lb-trust-item" key={title}>
                <span className="lb-trust-item__icon">
                  <Icon size={18} />
                </span>
                <span className="lb-trust-item__text">
                  <span className="lb-trust-item__title">{title}</span>
                  <span className="lb-trust-item__desc">{desc}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="lb-hero__media">
          <img
            src={heroDoctor}
            alt="Doctor"
            className="lb-hero__doctor-img"
          />
        </div>
      </div>
    </section>

    <PopularTests />
    <HowItWorks />
  </div>
);

export default HomePage;