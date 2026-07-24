// frontend/src/pages/SupportPage.jsx
import { useState } from 'react';
import { Mail, Phone, MessageCircle, ChevronDown } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { submitSupportRequest } from '../services/supportService';
import './SupportPage.css';

const FAQS = [
  {
    q: 'How do I book a lab test?',
    a: 'Search for the test or scan you need on the homepage, compare prices and turnaround times across labs, then click "Book Now" on the option that works for you.',
  },
  {
    q: 'Can I get home sample collection?',
    a: 'Yes — labs offering home collection are marked with a "Home Collection" badge on their listing. You can filter results to show only those labs.',
  },
  {
    q: 'How do I cancel or reschedule a booking?',
    a: 'Go to My Bookings from your dashboard, find the relevant booking, and use the cancel option there. Rescheduling support is coming soon.',
  },
  {
    q: 'Are the labs on Labsbuzz certified?',
    a: 'We highlight NABL-certified labs with a badge, and all listed labs go through a verification step before appearing in search results.',
  },
  {
    q: 'I run a lab — how do I list it on Labsbuzz?',
    a: 'Click "Register Labs" in the navigation bar to create a lab owner account and start listing your tests and pricing.',
  },
];

const validate = ({ name, email, subject, message }) => {
  const errors = {};
  if (!name || name.trim().length < 2) errors.name = 'Name must be at least 2 characters';
  if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = 'Invalid email address';
  if (!subject || subject.trim().length < 3) errors.subject = 'Subject must be at least 3 characters';
  if (!message || message.trim().length < 10) errors.message = 'Message must be at least 10 characters';
  return errors;
};

const FaqItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="lb-faq-item">
      <button
        type="button"
        className="lb-faq-item__question"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span>{q}</span>
        <ChevronDown size={18} className={`lb-faq-item__chevron ${open ? 'lb-faq-item__chevron--open' : ''}`} />
      </button>
      {open && <p className="lb-faq-item__answer">{a}</p>}
    </div>
  );
};

const SupportPage = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    setSuccess(null);

    const errors = validate(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      await submitSupportRequest(form);
      setSuccess("Thanks for reaching out — we'll get back to you within 24 hours.");
      setForm({ name: '', email: '', subject: '', message: '' });
      setFieldErrors({});
    } catch (err) {
      setApiError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lb-support-page">
      <div className="container">
        <div className="lb-support-hero">
          <h1 className="lb-support-hero__title">How can we help?</h1>
          <p className="lb-support-hero__subtitle">
            Search our FAQs below, or send us a message and we'll get back to you.
          </p>
        </div>

        <div className="lb-support-contact-row">
          <Card className="lb-support-contact-card">
            <Mail size={40} />
            <div>
              <h4>Email Us</h4>
              <p>labsbuzz.in@gmail.com</p>
            </div>
          </Card>
          <Card className="lb-support-contact-card">
            <Phone size={40} />
            <div>
              <h4>Call Us</h4>
              <p>1800 0000 0000</p>
            </div>
          </Card>
          <Card className="lb-support-contact-card">
            <MessageCircle size={40} />
            <div>
              <h4>Live Chat</h4>
              <p>Mon–Sat, 9am–7pm</p>
            </div>
          </Card>
        </div>

        <div className="lb-support-grid">
          <section className="lb-support-faq">
            <h2 className="lb-section-title">Frequently Asked Questions</h2>
            <div className="lb-faq-list">
              {FAQS.map((item) => (
                <FaqItem key={item.q} {...item} />
              ))}
            </div>
          </section>

          <section className="lb-support-form-section">
            <Card padded className="lb-support-form-card">
              <h2 className="lb-support-form-card__title">Send us a message</h2>

              <form className="lb-auth-form" onSubmit={handleSubmit} noValidate>
                {apiError && <div className="lb-auth-form__error">{apiError}</div>}
                {success && <div className="lb-auth-form__success">{success}</div>}

                <Input
                  label="Full Name"
                  name="name"
                  autoComplete="name"
                  value={form.name}
                  onChange={handleChange}
                  error={fieldErrors.name}
                />
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  error={fieldErrors.email}
                />
                <Input
                  label="Subject"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  error={fieldErrors.subject}
                />
                <div className="lb-field">
                  <label htmlFor="message" className="lb-field__label">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    className="lb-support-textarea"
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                  />
                  {fieldErrors.message && (
                    <span className="lb-field__error">{fieldErrors.message}</span>
                  )}
                </div>

                <Button type="submit" fullWidth loading={loading}>
                  Send Message
                </Button>
              </form>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;