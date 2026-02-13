import React from 'react';

const ResumeApp: React.FC = () => {
  return (
    <div className="h-full overflow-auto bg-[#0a0a0f] text-white p-8 font-mono">
      <div className="max-w-4xl mx-auto border border-white/10 p-12 min-h-full relative bg-grid-pattern">
         {/* Decorative Corner Borders */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/20" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/20" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/20" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/20" />

        <header className="flex justify-between items-start border-b-2 border-white/10 pb-8 mb-10">
          <div>
            <h1 className="text-5xl font-space-grotesk font-bold mb-2 uppercase tracking-tight text-white">John Doe</h1>
            <p className="text-xl text-[#00f0ff] font-medium tracking-widest uppercase">Full Stack Developer</p>
          </div>
          <div className="text-right text-xs text-white/40 space-y-1 font-mono">
            <div className="flex items-center justify-end gap-2">
              <span>john.doe@example.com</span>
              <span className="text-[#00f0ff]">::EMAIL</span>
            </div>
            <div className="flex items-center justify-end gap-2">
              <span>johndoe.dev</span>
              <span className="text-[#00f0ff]">::WEB</span>
            </div>
            <div className="flex items-center justify-end gap-2">
              <span>San Francisco, CA</span>
              <span className="text-[#00f0ff]">::LOC</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-12">
            <section>
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#00f0ff] mb-6 flex items-center gap-2 border-b border-[#00f0ff]/20 pb-2">
                <span className="text-lg">01.</span> Experience
              </h2>
              <div className="space-y-10">
                <div className="relative pl-6 border-l border-dashed border-white/20">
                  <div className="absolute -left-1.5 top-0 w-3 h-3 bg-[#00f0ff] rounded-none rotate-45"></div>
                  <h3 className="text-xl font-bold text-white font-space-grotesk">Senior Full Stack Developer</h3>
                  <p className="text-[#00f0ff]/80 text-xs mb-4 uppercase">Tech Corp • 2021 - Present</p>
                  <ul className="text-white/70 text-sm space-y-2 leading-relaxed list-none">
                    <li>{">"} Led development of microservices architecture serving 1M+ users</li>
                    <li>{">"} Implemented CI/CD pipelines reducing deployment time by 60%</li>
                    <li>{">"} Mentored junior developers and conducted code reviews</li>
                  </ul>
                </div>
                <div className="relative pl-6 border-l border-dashed border-white/20">
                  <div className="absolute -left-1 top-0 w-2 h-2 bg-white/50 rounded-none rotate-45"></div>
                  <h3 className="text-xl font-bold text-white font-space-grotesk">Full Stack Developer</h3>
                  <p className="text-white/50 text-xs mb-4 uppercase">Startup Inc • 2019 - 2021</p>
                  <ul className="text-white/70 text-sm space-y-2 leading-relaxed list-none">
                    <li>{">"} Built responsive web applications using React and Node.js</li>
                    <li>{">"} Designed and implemented RESTful APIs</li>
                    <li>{">"} Collaborated with design team on UI/UX improvements</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#00f0ff] mb-6 flex items-center gap-2 border-b border-[#00f0ff]/20 pb-2">
                <span className="text-lg">02.</span> Education
              </h2>
              <div>
                <h3 className="text-xl font-bold text-white font-space-grotesk">Bachelor of Science in Computer Science</h3>
                <p className="text-white/50 text-xs mt-1 uppercase">University of Technology • 2015 - 2019</p>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-10">
            <section>
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#00f0ff] mb-6 border-b border-[#00f0ff]/20 pb-2">
                <span className="text-lg">03.</span> Skills
              </h2>
              <div className="space-y-8">
                <div>
                  <h4 className="font-bold text-white mb-3 text-xs uppercase opacity-70">Frontend</h4>
                  <div className="flex flex-wrap gap-2">
                    {['React', 'TypeScript', 'Next.js', 'Tailwind'].map(skill => (
                      <span key={skill} className="px-2 py-1 bg-white/5 border border-white/10 text-[#00f0ff] text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-white mb-3 text-xs uppercase opacity-70">Backend</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Node.js', 'PostgreSQL', 'AWS', 'Docker'].map(skill => (
                      <span key={skill} className="px-2 py-1 bg-white/5 border border-white/10 text-white/70 text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <div className="pt-8 border-t-2 border-white/10">
              <a
                href="#"
                className="block w-full py-4 bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff] hover:bg-[#00f0ff] hover:text-black transition-all text-center font-bold text-sm uppercase tracking-wider group"
              >
                <span className="group-hover:translate-x-1 inline-block transition-transform duration-200">
                  [ Download PDF ]
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeApp;
