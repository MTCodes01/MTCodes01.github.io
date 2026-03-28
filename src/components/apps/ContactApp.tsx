import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID = 'service_llj9ec5';
const EMAILJS_TEMPLATE_ID = 'kgg_5CeC9iLmez-Ck';
const EMAILJS_PUBLIC_KEY = 'kgg_5CeC9iLmez-Ck';

const SOCIALS = [
  { label: 'GitHub',    short: 'GH', url: 'https://github.com/MTCodes01' },
  { label: 'LinkedIn',  short: 'LI', url: 'https://www.linkedin.com/in/sreedevss/' },
  { label: 'Instagram', short: 'IG', url: 'https://www.instagram.com/_mt_yt_' },
  { label: 'YouTube',   short: 'YT', url: 'https://www.youtube.com/@MT_yt' },
];

const ContactApp: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formData,
        EMAILJS_PUBLIC_KEY
      );

      if (res.status === 200) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setStatus('idle'), 4000);
      } else {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 4000);
      }
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  const inputClass = "w-full px-4 py-3 bg-black/40 border border-white/10 focus:border-[#00f0ff] text-white focus:outline-none transition-all font-inter text-sm placeholder-white/20 focus:bg-black/60 focus:shadow-[0_0_0_1px_rgba(0,240,255,0.15)]";

  return (
    <div className="h-full overflow-auto p-6 text-white font-inter bg-dot-pattern">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-7 border-b border-white/8 pb-5"
        >
          <h2 className="text-3xl font-space-grotesk font-bold mb-1.5 text-white uppercase tracking-tight">
            Get In Touch
          </h2>
          <p className="font-jetbrains text-[10px] text-[#00f0ff]/60 uppercase tracking-widest">
            Open to freelance · collaboration · full-time
          </p>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 space-y-4"
          >
            {[
              {
                icon: '@',
                label: 'Email',
                value: 'sreedevss05@gmail.com',
                href: 'mailto:sreedevss05@gmail.com',
              },
              {
                icon: '#',
                label: 'Location',
                value: 'Thiruvananthapuram, Kerala, India',
                href: null,
              },
            ].map(item => (
              <div
                key={item.label}
                className="border border-white/8 p-5 bg-black/20 hover:border-[#00f0ff]/30 hover:bg-[#00f0ff]/[0.02] transition-all group relative"
              >
                <div className="absolute top-0 right-0 w-2 h-2 bg-white/8 group-hover:bg-[#00f0ff]/40 transition-colors" />
                <div className="flex items-center gap-3 mb-1.5">
                  <span className="text-[#00f0ff] font-jetbrains font-bold text-lg leading-none">{item.icon}</span>
                  <h3 className="font-space-grotesk font-bold text-[11px] uppercase tracking-widest text-white/60">
                    {item.label}
                  </h3>
                </div>
                {item.href ? (
                  <a href={item.href} className="font-inter text-sm text-white/70 hover:text-[#00f0ff] transition-colors pl-7 break-all block">
                    {item.value}
                  </a>
                ) : (
                  <p className="font-inter text-sm text-white/50 pl-7 break-words">{item.value}</p>
                )}
              </div>
            ))}

            {/* Social links */}
            <div className="pt-2">
              <p className="font-jetbrains text-[9px] text-white/25 uppercase tracking-widest mb-3">Socials</p>
              <div className="grid grid-cols-2 gap-2">
                {SOCIALS.map(s => (
                  <a
                    key={s.short}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2.5 border border-white/8 bg-white/[0.03] hover:bg-[#00f0ff]/8 hover:border-[#00f0ff]/30 text-white/40 hover:text-[#00f0ff] transition-all font-jetbrains text-xs uppercase tracking-wider"
                  >
                    <span className="font-bold">{s.short}</span>
                    <span className="text-white/25 text-[9px]">↗</span>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="md:col-span-3"
          >
            <div className="border border-white/8 p-7 bg-black/30 relative">
              {/* Corner accents */}
              <div className="absolute -top-px -left-px w-5 h-5 border-t-2 border-l-2 border-[#00f0ff]" />
              <div className="absolute -bottom-px -right-px w-5 h-5 border-b-2 border-r-2 border-[#00f0ff]" />

              <h3 className="font-space-grotesk text-sm font-bold uppercase tracking-widest text-white/70 border-b border-white/8 pb-4 mb-6">
                Send a Message
              </h3>

              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-12 text-center border border-[#00f0ff]/20 bg-[#00f0ff]/5"
                  >
                    <div className="text-[#00f0ff] text-5xl mb-4">✓</div>
                    <h4 className="text-xl font-space-grotesk font-bold text-[#00f0ff] uppercase tracking-widest mb-1">
                      Message Sent!
                    </h4>
                    <p className="font-jetbrains text-[11px] text-white/40">I'll get back to you soon.</p>
                  </motion.div>
                ) : status === 'error' ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-8 text-center border border-[#ff003c]/20 bg-[#ff003c]/5"
                  >
                    <div className="text-[#ff003c] text-4xl mb-3">✕</div>
                    <p className="font-jetbrains text-sm text-[#ff003c]">Failed to send. Try again or email directly.</p>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="font-jetbrains text-[10px] text-white/40 uppercase tracking-widest block">
                          Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className={inputClass}
                          placeholder="Your name"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-jetbrains text-[10px] text-white/40 uppercase tracking-widest block">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className={inputClass}
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-jetbrains text-[10px] text-white/40 uppercase tracking-widest block">
                        Message
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className={`${inputClass} resize-none`}
                        placeholder="What's on your mind?"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="w-full py-3.5 bg-[#00f0ff] text-black font-space-grotesk font-bold text-sm uppercase tracking-widest hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {status === 'sending' ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                          Sending…
                        </span>
                      ) : (
                        'Send Message'
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactApp;
