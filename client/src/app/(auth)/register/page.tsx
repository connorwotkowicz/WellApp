'use client';

import { useState, useRef, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'provider'>('user'); 
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { login } = useContext(AuthContext);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);


    if (password.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok || !data.token || !data.user) {
        if (res.status === 409 || data.error?.includes('exists')) {
          toast.error('An account with this email already exists.');
        } else {
          toast.error(data.error || 'Registration failed.');
        }
        throw new Error(data.error || `Registration failed (${res.status})`);
      }



      login(data.user, data.token);
      localStorage.setItem('token', data.token);
      localStorage.setItem('userEmail', data.user.email);

      toast.success('Registration successful! Welcome!');
      

      setName('');
      setEmail('');
      setPassword('');


      router.push('/account');
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message);
    }
  };

  return (
    <div className="register-page">
      <div className="logo-wrapper">{}</div>

      <div className="register-container">
        <div className="my-beat">
          <h3>myW2k25</h3>
        </div>

        <div className="inner-content">
          <div className="logreg-title">
            <h2>Register</h2>
            {error && <p className="error-message">This email is already associated with another account</p>}
          </div>

          <div className="login-instr">
            <h4>Enter your email and set a password to create your account.</h4>
          </div>

          <form className="register-form" onSubmit={handleSubmit}>
            <div className="log-input-group">
              <input
                type="text"
                value={name}
                ref={nameRef}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your name"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter email"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Set password"
              />
              <div className="role-selection">
                <label>Role:</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'user' | 'provider')}
                  required
                >
                  <option value="user">User</option>
                  <option value="provider">Provider</option>
                </select>
              </div>
            </div>
            <button type="submit" className="reg-button">
              Register
            </button>
          </form>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              textAlign: 'center',
              margin: '1rem 0',
            }}
          >
            <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #ccc' }} />
          </div>

          <div className="sign-up-link">
            <p>Already have an account? <Link href="/login"><strong>Login</strong></Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
