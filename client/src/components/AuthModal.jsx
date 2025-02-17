// components/AuthModal.jsx
import React, { useState } from 'react';
import { X, Mail, Lock, User } from 'lucide-react';

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      password: ''
    });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(isLogin ? {
          email: formData.email,
          password: formData.password
        } : formData),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific field errors
        if (data.field) {
          setErrors({ [data.field]: data.message });
        } else if (data.errors) {
          // Handle multiple validation errors
          const errorObj = {};
          data.errors.forEach(err => {
            errorObj[err.field] = err.message;
          });
          setErrors(errorObj);
        } else {
          // Handle general error
          setErrors({ general: data.message || 'Authentication failed' });
        }
        setIsLoading(false);
        return;
      }

      // Success
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      resetForm();
      onClose();
      window.location.reload();

    } catch (err) {
      setErrors({ general: 'Network error. Please try again.' });
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-11/12 max-w-md relative border border-gray-200 dark:border-gray-700 shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          {isLogin ? 'Welcome Back!' : 'Create Account'}
        </h2>

        {errors.general && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`pl-10 w-full p-3 bg-gray-50 dark:bg-gray-700 border ${
                    errors.username ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent`}
                  placeholder="Enter your username"
                  required
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.username}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`pl-10 w-full p-3 bg-gray-50 dark:bg-gray-700 border ${
                  errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent`}
                placeholder="Enter your email"
                required
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`pl-10 w-full p-3 bg-gray-50 dark:bg-gray-700 border ${
                  errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } rounded-lg focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent`}
                placeholder="Enter your password"
                required
              />
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-lg transition-colors duration-200 ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={switchMode}
            className="text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;