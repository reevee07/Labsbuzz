import SearchBar from '../components/home/SearchBar';
import PopularTests from '../components/home/PopularTests';
import HowItWorks from '../components/home/HowItWorks';
import './HomePage.css';
import heroDoctor from '../assets/images/hero-doctor.png';

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