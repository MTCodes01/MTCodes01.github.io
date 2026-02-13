import React, { useState } from 'react';

const ContactApp: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="h-full overflow-auto p-8 text-white font-mono bg-grid-pattern">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 border-b border-white/10 pb-8">
          <h2 className="text-5xl font-space-grotesk font-bold mb-4 text-white uppercase tracking-tight">
            Initiate Contact
          </h2>
          <p className="text-[#00f0ff] text-sm tracking-widest uppercase animate-pulse">
            {">>"} Awaiting Transmission...
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          {/* Contact Info Sidebar */}
          <div className="md:col-span-2 space-y-6">
            <div className="border border-white/10 p-6 bg-black/40 hover:border-[#00f0ff] transition-colors relative group">
              <div className="absolute top-0 right-0 w-2 h-2 bg-white/10 group-hover:bg-[#00f0ff] transition-colors" />
              <div className="flex items-center gap-4 mb-2">
                <span className="text-[#00f0ff] text-xl font-bold">@</span>
                <h3 className="font-bold text-sm uppercase tracking-wider">Email</h3>
              </div>
              <p className="text-white/70 text-sm font-mono pl-8">sreedevss05@gmail.com</p>
            </div>

            <div className="border border-white/10 p-6 bg-black/40 hover:border-[#00f0ff] transition-colors relative group">
               <div className="absolute top-0 right-0 w-2 h-2 bg-white/10 group-hover:bg-[#00f0ff] transition-colors" />
              <div className="flex items-center gap-4 mb-2">
                <span className="text-[#00f0ff] text-xl font-bold">#</span>
                <h3 className="font-bold text-sm uppercase tracking-wider">Location</h3>
              </div>
              <p className="text-white/70 text-sm font-mono pl-8">Thiruvananthapuram, India</p>
            </div>

            <div className="flex gap-4 justify-center pt-6">
              {[
                { label: 'GH', url: 'https://github.com/MTCodes01' },
                { label: 'LI', url: 'https://www.linkedin.com/in/sreedevss/' },
                { label: 'IG', url: 'https://www.instagram.com/_mt_yt_' },
                { label: 'YT', url: 'https://www.youtube.com/@MT_yt' }
              ].map(social => (
                <a 
                  key={social.url}
                  href={social.url} 
                  className="w-12 h-12 border border-white/10 bg-white/5 hover:bg-[#00f0ff] hover:text-black hover:border-[#00f0ff] flex items-center justify-center font-bold transition-all"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-3">
            <div className="border border-white/10 p-8 bg-black/60 relative">
              <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#00f0ff]" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#00f0ff]" />
              
              <h3 className="text-xl font-bold mb-6 font-space-grotesk uppercase border-b border-white/10 pb-4">
                Transmission Form
              </h3>
              
              {submitted ? (
                <div className="py-12 text-center border border-[#33ff00]/30 bg-[#33ff00]/5">
                  <div className="text-[#33ff00] text-6xl mb-4 text-shadow-neon">✓</div>
                  <h4 className="text-2xl font-bold mb-2 uppercase text-[#33ff00] tracking-widest">Sent</h4>
                  <p className="text-white/60 text-xs font-mono">TRANSMISSION COMPLETE</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#00f0ff] uppercase ml-1 block">Identity_Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-black border border-white/20 focus:border-[#00f0ff] text-white focus:outline-none focus:shadow-[0_0_10px_rgba(0,240,255,0.2)] transition-all font-mono text-sm placeholder-white/10"
                        placeholder="ENTER NAME..."
                      />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-[#00f0ff] uppercase ml-1 block">Identity_Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-black border border-white/20 focus:border-[#00f0ff] text-white focus:outline-none focus:shadow-[0_0_10px_rgba(0,240,255,0.2)] transition-all font-mono text-sm placeholder-white/10"
                        placeholder="ENTER EMAIL..."
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#00f0ff] uppercase ml-1 block">Message_Data</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 bg-black border border-white/20 focus:border-[#00f0ff] text-white focus:outline-none focus:shadow-[0_0_10px_rgba(0,240,255,0.2)] transition-all font-mono text-sm placeholder-white/10 resize-none"
                      placeholder="INPUT MESSAGE SEQUENCE..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-8 py-4 bg-[#00f0ff] text-black font-bold text-lg uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-[4px_4px_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 block"
                  >
                    Execute Send
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactApp;
