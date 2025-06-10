'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../context/AuthContext';

interface Booking {
  id: string;
  time: string;
  providerName: string;
  userId: string;
}

export default function AccountPage() {
  const { user, token, logout, initialized } = useContext(AuthContext);
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    if (initialized && !token) {
      router.replace('/login');
      return;
    }

    if (!initialized) return; 

    async function fetchBookings() {
      try {
        const res = await fetch('/api/bookings', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch bookings');
        const data: Booking[] = await res.json();
        setBookings(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, [initialized, token, router]);

  if (!initialized) return <p>Loading...</p>; 
  if (!token) return null;

  return (
    <div className="account-page">
    
      <section className="stripe default greeting-stripe">
        <div className="account-wrapper greeting-wrap">
          <h2 className="account-title">Welcome, {user?.name ?? 'User'}!</h2>
          <hr />
          <button
            className="signout-button"
            onClick={() => {
              logout();
              router.push('/login');
            }}
          >
            Sign out
          </button>
          <p className="sub-greeting">You’re signed in with {user?.email}</p>
        </div>
      </section>

      <section className="stripe grey">
        <div className="account-wrapper">
          <h3>Your Bookings</h3>
          {loading && <p>Loading bookings...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {!loading && bookings.length === 0 && <p>No bookings found.</p>}
          {!loading && bookings.length > 0 && (
            <ul className="booking-list">
              {bookings.map((b) => (
                <li key={b.id} className="booking-card">
                  <span>
                    <strong>Provider:</strong> {b.providerName}
                  </span>
                  <span>
                    <strong>Time:</strong> {new Date(b.time).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

 
      <section className="stripe default">
        <div className="account-wrapper">
          <div className="account-settings">
            <h3>Account Settings</h3>
            <div className="settings-columns">
              <div className="settings-block">
                <h4>Address</h4>
                <p>{user?.address || 'No address available'}</p>
              </div>
              <div className="settings-block">
             <h4>Contact Info</h4>
<p>
  <a>
    <strong>Email: </strong>
  </a>
  <span className="contact-info">{user?.email}</span>
  <br />
  <a>
    <strong>Phone: </strong>
  </a>
  <span className="contact-info">
    {user?.phone || 'No phone number available'}
  </span>
</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
