import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, AlertCircle, Key, ShieldCheck, Sparkles, RefreshCw, ExternalLink } from 'lucide-react';

export default function EmailSettingsTab({ settings, onSaveSettings }) {
  const [formData, setFormData] = useState({
    adminNotificationEmail: settings?.adminNotificationEmail || 'rovescentsofficial@gmail.com',
    smtpUser: settings?.smtpUser || 'rovescentsofficial@gmail.com',
    smtpPass: settings?.smtpPass || '',
    smtpHost: settings?.smtpHost || '',
    smtpPort: settings?.smtpPort || '465'
  });

  const [testEmailTarget, setTestEmailTarget] = useState(settings?.adminNotificationEmail || 'rovescentsofficial@gmail.com');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSaveSettings(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving email settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendTest = async () => {
    setIsSendingTest(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/email/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmailTarget, ...formData })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTestResult({
          type: 'success',
          message: `Test email sent successfully to ${testEmailTarget}! Check your inbox/spam folder.`
        });
      } else {
        setTestResult({
          type: 'error',
          message: data.error || 'Failed to send test email. Please check your Gmail App Password.'
        });
      }
    } catch (err) {
      setTestResult({
        type: 'error',
        message: 'Could not connect to email server.'
      });
    } finally {
      setIsSendingTest(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Mail className="text-gold-400" size={24} />
          <h2 className="text-2xl font-serif font-bold text-white">Order Email Notifications</h2>
        </div>
        <p className="text-xs text-zinc-400 mt-1">
          Automated customer order receipts and real-time alerts sent to <strong>rovescentsofficial@gmail.com</strong>
        </p>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-[#141414] border border-[#242424] space-y-1">
          <div className="flex items-center gap-2 text-gold-400 font-bold text-xs uppercase tracking-wider">
            <CheckCircle2 size={16} />
            <span>New Order Alert</span>
          </div>
          <p className="text-[11px] text-zinc-400">
            Instant invoice with customer address, phone number & items delivered to rovescentsofficial@gmail.com.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#141414] border border-[#242424] space-y-1">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <Sparkles size={16} />
            <span>Customer Receipt</span>
          </div>
          <p className="text-[11px] text-zinc-400">
            Branded luxury email automatically sent to customer confirming order details & COD estimate.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#141414] border border-[#242424] space-y-1">
          <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
            <ShieldCheck size={16} />
            <span>Status Updates</span>
          </div>
          <p className="text-[11px] text-zinc-400">
            Notification emails triggered when an order is Shipped, Delivered, or Cancelled.
          </p>
        </div>
      </div>

      {/* Settings Form */}
      <div className="bg-[#141414] border border-[#242424] rounded-2xl p-6">
        <form onSubmit={handleSave} className="space-y-5">
          <h3 className="text-sm font-serif font-bold text-white uppercase tracking-wider border-b border-[#242424] pb-3 flex items-center gap-2">
            <Key size={16} className="text-gold-400" />
            <span>Email & SMTP Credentials</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Admin Notification Email (Receives Orders) *
              </label>
              <input
                type="email"
                required
                value={formData.adminNotificationEmail}
                onChange={(e) => setFormData({ ...formData, adminNotificationEmail: e.target.value })}
                placeholder="rovescentsofficial@gmail.com"
                className="w-full bg-[#1c1c1c] border border-[#333] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
              />
              <span className="text-[10px] text-zinc-500 block mt-1">All new order summaries are sent here</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Sender Gmail Address (SMTP User) *
              </label>
              <input
                type="email"
                required
                value={formData.smtpUser}
                onChange={(e) => setFormData({ ...formData, smtpUser: e.target.value })}
                placeholder="rovescentsofficial@gmail.com"
                className="w-full bg-[#1c1c1c] border border-[#333] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
              />
              <span className="text-[10px] text-zinc-500 block mt-1">Email address used to send emails</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">
              Google App Password (16 characters) *
            </label>
            <input
              type="password"
              value={formData.smtpPass}
              onChange={(e) => setFormData({ ...formData, smtpPass: e.target.value })}
              placeholder="e.g. abcd efgh ijkl mnop"
              className="w-full bg-[#1c1c1c] border border-[#333] rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-gold-500"
            />
            
            {/* Helpful Guide on App Password */}
            <div className="mt-2 p-3 rounded-lg bg-[#1c190d] border border-gold-500/30 text-[11px] text-zinc-300 space-y-1">
              <div className="font-semibold text-gold-400 flex items-center gap-1.5">
                <span>💡 1-Minute Guide to get Google App Password:</span>
              </div>
              <ol className="list-decimal pl-4 space-y-0.5 text-zinc-400">
                <li>Apne Google Account mein jayein: <a href="https://myaccount.google.com/security" target="_blank" rel="noreferrer" className="text-gold-400 hover:underline inline-flex items-center gap-1">Security Settings <ExternalLink size={11} /></a></li>
                <li><strong>2-Step Verification</strong> on karein.</li>
                <li>Search bar mein type karein <strong>"App passwords"</strong> (ya Security ke niche jayein).</li>
                <li>App name mein likhein <strong>"ROVE SCENTS"</strong> aur <em>Create</em> click karein.</li>
                <li>Google aapko 16-character ka code dega (e.g. <code className="text-white bg-black/50 px-1 rounded">xxxx xxxx xxxx xxxx</code>), use yahan paste karke <strong>Save</strong> kardein!</li>
              </ol>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#242424]">
            <div className="text-xs">
              {saveSuccess && (
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 size={14} />
                  Settings saved successfully!
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-400 hover:to-amber-500 text-black font-bold text-xs uppercase tracking-wider transition shadow flex items-center gap-2"
            >
              <CheckCircle2 size={15} />
              <span>{isSaving ? 'Saving...' : 'Save Email Settings'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Test Email Section */}
      <div className="bg-[#141414] border border-[#242424] rounded-2xl p-6">
        <h3 className="text-sm font-serif font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
          <Send size={16} className="text-gold-400" />
          <span>Send Verification Test Email</span>
        </h3>
        <p className="text-xs text-zinc-400 mb-4">
          Click below to test sending an email to make sure your Gmail credentials are fully active.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={testEmailTarget}
            onChange={(e) => setTestEmailTarget(e.target.value)}
            placeholder="rovescentsofficial@gmail.com"
            className="flex-grow bg-[#1c1c1c] border border-[#333] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500"
          />
          <button
            type="button"
            disabled={isSendingTest}
            onClick={handleSendTest}
            className="px-5 py-2 rounded-lg bg-[#222] hover:bg-gold-500 hover:text-black border border-[#333] text-gold-300 font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shrink-0"
          >
            <Send size={13} className={isSendingTest ? 'animate-pulse' : ''} />
            <span>{isSendingTest ? 'Sending Test...' : 'Send Test Email'}</span>
          </button>
        </div>

        {testResult && (
          <div className={`mt-4 p-3 rounded-lg border text-xs flex items-center gap-2 ${
            testResult.type === 'success' 
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' 
              : 'bg-red-950/40 border-red-500/40 text-red-300'
          }`}>
            {testResult.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{testResult.message}</span>
          </div>
        )}
      </div>
    </div>
  );
}
