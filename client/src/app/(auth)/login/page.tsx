'use client';

import { useState, useRef, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext'; 

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!data.token || !data.user) throw new Error('Invalid login response');

      login(data.user, data.token);
      localStorage.setItem('token', data.token);
      localStorage.setItem('userEmail', data.user.email);

      if (data.user.user_role === 'admin') {
        toast.success(`Welcome Admin ${data.user.name}`, { autoClose: 2500 });
        router.push('/admin');
      } else {
        toast.success(`Welcome back, ${data.user.name}`, { autoClose: 2500 });
        router.push('/account'); 
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="login-page">
      <div className="logo-wrapper"></div>

      <div className="login-container">
        <div className="my-discog">
          <h3>well2k25</h3>
        </div>

        <div className="inner-content">
          <div className="logreg-title">
            <h2>Enter your email to continue</h2>
            {error && <p className="error-message">{error}</p>}
          </div>

          <div className="login-instr">
            <h4>
              Log in to DiscogMVP with your email. If you don't have an account,
              click the link below to create one.
            </h4>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="log-input-group">
              <input
                type="email"
                placeholder="Email"
                value={email}
                ref={emailRef}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="book-modal-button">
              Sign in
            </button>
          </form>

          <div className="login-instr">
                <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #ccc' }} />
            <h4>New to DiscogMVP?</h4>
            <div className="sign-up-link">
              <Link href="/register">
                <h4>Sign up</h4>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
