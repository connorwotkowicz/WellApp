'use client';

import { useState, useRef, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import axios from 'axios';

import { AuthContext } from '../../context/AuthContext';

const API = process.env.NEXT_PUBLIC_API_BASE_URL!;

interface RegisterResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    user_role: string;
  };
}

function isAxiosErrorWithMessage(err: unknown): err is { response: { data: { error?: string } } } {
  return (
    typeof err === 'object' &&
    err !== null &&
    'response' in err &&
    typeof (err as any).response === 'object' &&
    'data' in (err as any).response &&
    typeof (err as any).response.data === 'object'
  );
}

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
      const res = await axios.post<RegisterResponse>(`${API}/api/auth/register`, {
        name,
        email,
        password,
        role,
      });

      const data = res.data;

      if (!data.token || !data.user) {
        throw new Error('Invalid registration response');
      }

      login(data.user, data.token);
      localStorage.setItem('token', data.token);
      localStorage.setItem('userEmail', data.user.email);
      localStorage.setItem('userRole', data.user.user_role);

      toast.success('Registration successful! Welcome!');
      router.push('/account');
    } catch (err: unknown) {
      console.error('Registration error:', err);

      const message =
        isAxiosErrorWithMessage(err) && err.response.data?.error
          ? err.response.data.error
          : err instanceof Error
          ? err.message
          : 'Registration failed';

      setError(message);
      toast.error(message);
    }
  };

  return (
    <div className="register-page">
      <div className="logo-wrapper"></div>

      <div className="register-container">
        <div className="my-beat">
          <h3>Well2k25</h3>
        </div>

        <div className="inner-content">
          <div className="logreg-title">
            <h2>Register</h2>
            {error && (
              <p className="error-message">
                {error.includes('exists') ? 'This email is already associated with another account' : error}
              </p>
            )}
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
            <button type="submit" className="book-modal-button">
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
            <p>
              Already have an account?{' '}
              <Link href="/login">
                <strong>Login</strong>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
