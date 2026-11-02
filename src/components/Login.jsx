import React, { useState } from 'react';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password minimal 6 karakter!');
      return;
    }

    if (email === 'user@gmail.com' && password === '123456') {
      const userLogin = { email: email, role: 'peserta' };
      localStorage.setItem('user', JSON.stringify(userLogin));
      alert('Login berhasil!');
    } else {
      setError('Email atau password salah');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-5">
          <div className="card shadow-sm p-4">
            <h3 className="text-center mb-4">Login Jabar EventGo</h3>

            {error && <div className="alert alert-danger py-2">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Masuk
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;