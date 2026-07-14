import { Search, SlidersHorizontal, CalendarCheck } from 'lucide-react';
import Card from '../common/Card';
import './HowItWorks.css';

const STEPS = [
  {
    icon: Search,
    title: 'Search Your Test',
    desc: 'Find any blood test, scan, or health package by name.',
  },
  {
    icon: SlidersHorizontal,
    title: 'Compare & Filter',
    desc: 'Compare prices, ratings, and turnaround time across certified labs near you.',
  },
  {
    icon: CalendarCheck,
    title: 'Book Instantly',
    desc: 'Pick a date and time, and confirm your booking in seconds.',
  },
];

const HowItWorks = () => (
  <section className="lb-how">
    <div className="container">
      <h2 className="lb-section-title">How Labsbuzz Works</h2>
      <div className="lb-how__grid">
        {STEPS.map(({ icon: Icon, title, desc }, i) => (
          <Card key={title} hoverable className="lb-how__card">
            <span className="lb-how__badge">{i + 1}</span>
            <div className="lb-how__icon">
              <Icon size={22} />
            </div>
            <h3>{title}</h3>
            <p>{desc}</p>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
