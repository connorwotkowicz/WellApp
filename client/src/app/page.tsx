'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Welcome to Wellness 2k25</h1>
        <p> Book 1:1 sessions with top practitioners in Yoga, Meditation, and more.</p>
        <Link href="/services">
          <button className="back-modal-button">Explore</button>
        </Link>
      </div>

      <div className="features-section">
        <h2>Why Choose Us?</h2>
        <div className="feature-item">
          <h3>Easy Booking</h3>
          <p>Quickly book sessions with your chosen practitioner.</p>
        </div>
        <div className="feature-item">
          <h3>Wide Range of Services</h3>
          <p>Browse through a wide range of services from Yoga to Therapy.</p>
        </div>
        <div className="feature-item">
          <h3>Verified Practitioners</h3>
          <p>All of our practitioners are vetted and experienced in their field.</p>
        </div>
      </div>


    </div>
  );
}
