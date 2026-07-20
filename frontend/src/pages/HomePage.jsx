import SearchBar from '../components/home/SearchBar';
import PopularTests from '../components/home/PopularTests';
import HowItWorks from '../components/home/HowItWorks';
import './HomePage.css';

/**
 * Homepage - matches the approved mockup exactly:
 * hero title + gradient background orbs (already global via bg-orb-*),
 * large pill search bar, popular tests, how-it-works.
 */
const HomePage = () => (
  <div className="lb-home">
    <section className="lb-hero">
      <div className="container lb-hero__inner">
        <h1 className="lb-hero__title">
          Get the best deals on test/scans
          <br />
          <span className="lb-hero__title--accent">from certified labs</span>
        </h1>
        <SearchBar  />
      </div>
    </section>

    <PopularTests />
    <HowItWorks />
  </div>
);

export default HomePage;
