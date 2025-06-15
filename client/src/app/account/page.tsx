'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../context/AuthContext';

interface Booking {
  id: string;
  booking_date: string;  
  provider: { name: string };
  service: { name: string };  
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  address: string | null;
  phone: string | null;
}

export default function AccountPage() {
  const { user: contextUser, token, logout, initialized } = useContext(AuthContext);
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialized && !token) {
      router.replace('/login');
      return;
    }

    if (!initialized || !token) return;

    async function fetchAccountData() {
      try {
        setLoading(true);
        setError(null);
        
     
        const userRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        if (!userRes.ok) throw new Error('Failed to fetch user profile');
        const userData: UserProfile = await userRes.json();
        setUserProfile(userData);
        
     
        const bookingsRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/bookings/user`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        if (!bookingsRes.ok) throw new Error('Failed to fetch bookings');
        const bookingsData: Booking[] = await bookingsRes.json();
        setBookings(bookingsData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAccountData();
  }, [initialized, token, router]);

  if (!initialized) return <p>Loading...</p>;
  if (!token) return null;

  return (
    <div className="account-page">
      <section className="stripe default greeting-stripe">
        <div className="account-wrapper greeting-wrap">
         <h2 className="account-title">
  Welcome, {contextUser?.name || 'User'}!
</h2>
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
          <p className="sub-greeting">
            You're signed in with {userProfile?.email || contextUser?.email}
          </p>
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
                    <strong>Provider:</strong> {b.provider?.name || 'Unknown'}
                  </span>
                  <span>
                    <strong>Service:</strong> {b.service?.name || 'Unknown'}
                  </span>
                  <span>
                    <strong>Time:</strong> {new Date(b.booking_date).toLocaleString()}
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
                <p>{userProfile?.address || 'No address added'}</p>
              </div>
              <div className="settings-block">
                <h4>Contact Info</h4>
                <p>
                  <strong>Email: </strong>
                  <span className="contact-info">
                    {userProfile?.email || contextUser?.email}
                  </span>
                  <br />
                  <strong>Phone: </strong>
                  <span className="contact-info">
                    {userProfile?.phone || 'No phone number added'}
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