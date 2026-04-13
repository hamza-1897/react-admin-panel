import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password });
    // Navigate to dashboard automatically for demonstration purposes
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-br from-indigo-50/50 via-white to-purple-50/50 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="relative w-full max-w-6xl mx-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Branding - Left Side */}
        <div className="w-full max-w-md mx-auto lg:mx-0 text-center lg:text-left">
          <div className="space-y-8">
            {/* Logo */}
            <div className="mx-auto lg:mx-0 w-20 h-20 bg-linear-to-tr from-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center transform rotate-3 shadow-lg shadow-indigo-200">
              <span className="text-4xl font-bold text-white transform -rotate-3">N</span>
            </div>
            
            {/* Welcome Text */}
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
                Nazdeek
              </h1>
              <p className="text-lg text-gray-600 max-w-sm">
                Manage your platform with ease. Access all admin features from your secure dashboard.
              </p>
            </div>
          </div>
        </div>

        {/* Login Form - Right Side */}
        <div className="w-full shadow-lg max-w-md mx-auto lg:mx-0">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white p-8">
            
            {/* Form Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
              <p className="mt-2 text-sm text-gray-600">Please login to your admin account.</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="email">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full px-4 py-3 text-sm text-gray-900 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors placeholder:text-gray-400 outline-hidden"
                      placeholder="admin@nazdeek.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-gray-700" htmlFor="password">
                      Password
                    </label>
                    <a href="#" className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                      Forgot Password?
                    </a>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full px-4 py-3 text-sm text-gray-900 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors placeholder:text-gray-400 outline-hidden"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gray-900 hover:bg-gray-800 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all shadow-md active:scale-[0.98]"
                >
                  Sign in to Dashboard
                  <span className="absolute right-4 transform transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </button>
              </div>
            </form>
            
            {/* Footer */}
            <div className="mt-8 pt-6 text-center border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Secure admin portal for Nazdeek platform. <br/>
                &copy; {new Date().getFullYear()} Nazdeek Inc. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
