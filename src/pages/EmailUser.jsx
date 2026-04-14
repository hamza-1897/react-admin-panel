import React, { useState } from 'react';
import { Mail, Send } from 'lucide-react';
import { adminAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Message from '../components/common/Message';

const EmailUser = () => {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSendEmail = async (event) => {
    event.preventDefault();

    if (!email.trim() || !subject.trim() || !message.trim()) {
      setError('Please fill in all fields before sending the email.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage('');

    try {
      await adminAPI.sendEmailToUser({ email: email.trim(), subject: subject.trim(), message: message.trim() });
      setSuccessMessage('Email sent successfully.');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err) {
      console.error('Error sending email:', err);
      setError('Unable to send email. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-full">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl bg-indigo-100 text-indigo-700">
            <Mail className="w-5 h-5" />
            <span className="text-sm font-semibold">Send Email</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Email User</h1>
          <p className="text-gray-600 max-w-2xl">
            Send a direct email to any user from the admin panel. Enter the recipient email, subject, and message below.
          </p>
        </div>
      </div>

      {error && <Message type="error" message={error} onClose={() => setError(null)} />}
      {successMessage && <Message type="success" message={successMessage} onClose={() => setSuccessMessage('')} />}

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
        <form onSubmit={handleSendEmail} className="space-y-6">
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Recipient Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Write the email subject"
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={8}
                placeholder="Write your message here..."
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="text-sm text-gray-500">
              Emails are sent from the admin panel and can be used to notify users directly.
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {loading ? 'Sending...' : 'Send Email'}
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailUser;
