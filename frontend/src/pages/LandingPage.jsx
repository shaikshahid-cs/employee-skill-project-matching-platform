import { Link } from 'react-router-dom';
import { Briefcase, Zap, ShieldCheck, Search, Users, ArrowRight, CheckCircle2, Sparkles, FileText, Cpu, Award } from 'lucide-react';
import { useAuth } from '../context/useAuth';

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-base)', color: 'var(--text-main)' }}>
      {/* LANDING NAVBAR */}
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '70px',
        backgroundColor: 'rgba(11, 15, 23, 0.8)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-color)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 700, fontSize: '1.35rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'var(--primary-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)'
          }}>
            <Briefcase size={22} />
          </div>
          <span style={{ letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            MatchPulse
          </span>
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <a href="#how-it-works" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>How It Works</a>
          <a href="#employees" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>For Employees</a>
          <a href="#managers" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>For Managers</a>
          <a href="#matching" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>Skill Matching</a>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user ? (
            <Link
              to={user.role === 'EMPLOYEE' ? '/employee/dashboard' : user.role === 'MANAGER' ? '/manager/dashboard' : '/admin/dashboard'}
              className="btn btn-primary"
            >
              Go to Portal <ArrowRight size={16} />
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary">
                Get Started <ArrowRight size={16} />
              </Link>
            </>
          )}
        </div>
      </header>

      {/* HERO SECTION */}
      <section style={{
        paddingTop: '160px',
        paddingBottom: '100px',
        paddingLeft: '2rem',
        paddingRight: '2rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glowing Background Orbs */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '600px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.05) 50%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '850px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(99, 102, 241, 0.12)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            color: 'var(--primary)',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '1.5rem'
          }}>
            <Sparkles size={16} /> Intelligent Employee Matching & Internal Recruitment Platform
          </div>

          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: '1.5rem' }}>
            Connect the Right People with the <span style={{ background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Right Opportunities</span>
          </h1>

          <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2.5rem', maxWidth: '720px', margin: '0 auto 2.5rem' }}>
            Automate candidate-job alignment through document extraction, verified skill matrices, and explainable deterministic matching algorithms.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
            <Link to="/register" className="btn btn-primary" style={{ padding: '0.85rem 1.85rem', fontSize: '1rem', fontWeight: 600 }}>
              Join as Employee / Manager <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-secondary" style={{ padding: '0.85rem 1.85rem', fontSize: '1rem' }}>
              Sign In to Portal
            </Link>
          </div>
        </div>

        {/* HERO MOCKUP CARD */}
        <div style={{ maxWidth: '1100px', margin: '4rem auto 0', position: 'relative', zIndex: 10 }}>
          <div className="glass-card" style={{ padding: '1.5rem', borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.12)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444' }}></span>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></span>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 500 }}>Live Candidate-Job Match Matrix</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', textAlign: 'left' }}>
              <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>Senior Java Backend Developer</h4>
                  <span style={{ padding: '0.25rem 0.65rem', borderRadius: '9999px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontSize: '0.8rem', fontWeight: 700 }}>92% Match</span>
                </div>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Engineering Dept • Required: Java, Spring Boot, MySQL, REST APIs</p>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <span className="badge badge-indigo">Java (Advanced)</span>
                  <span className="badge badge-indigo">Spring Boot (Advanced)</span>
                  <span className="badge badge-indigo">MySQL</span>
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-surface)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>Full Stack Engineer</h4>
                  <span style={{ padding: '0.25rem 0.65rem', borderRadius: '9999px', backgroundColor: 'rgba(99, 102, 241, 0.15)', color: '#6366f1', fontSize: '0.8rem', fontWeight: 700 }}>85% Match</span>
                </div>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Product Dept • Required: React, Java, TypeScript, REST APIs</p>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <span className="badge badge-indigo">React</span>
                  <span className="badge badge-indigo">Java</span>
                  <span className="badge badge-amber">Missing: Docker</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ padding: '80px 2rem', backgroundColor: 'rgba(19, 27, 46, 0.3)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 700, marginBottom: '1rem' }}>How MatchPulse Works</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '4rem', maxWidth: '650px', margin: '0 auto 4rem' }}>
            A transparent 4-step pipeline that bridges employee credentials with manager job descriptions.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
            {[
              { icon: FileText, step: '1', title: 'Upload & Parse', desc: 'Employees upload resumes; managers upload JDs. Apache Tika extracts clean text.' },
              { icon: Cpu, step: '2', title: 'Skill Identification', desc: 'Automated skill extraction matches database technologies and allows manual review.' },
              { icon: Zap, step: '3', title: 'Deterministic Match', desc: '5-factor scoring calculates match % with explainable reasons and missing skill callouts.' },
              { icon: CheckCircle2, step: '4', title: 'Application & Review', desc: 'Employees apply seamlessly; managers review candidates with full match insights.' },
            ].map((st, i) => {
              const Icon = st.icon;
              return (
                <div key={i} className="glass-card" style={{ textAlign: 'left', padding: '1.75rem', position: 'relative' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                    <Icon size={22} />
                  </div>
                  <span style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', fontSize: '1.5rem', fontWeight: 800, color: 'var(--border-color)' }}>0{st.step}</span>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '0.5rem' }}>{st.title}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{st.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FOR EMPLOYEES & MANAGERS */}
      <section id="employees" style={{ padding: '90px 2rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '3rem' }}>
          {/* FOR EMPLOYEES */}
          <div className="glass-card" style={{ padding: '2.5rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', marginBottom: '1.5rem' }}>
              <Users size={24} />
            </div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem' }}>For Employees</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              Maintain your professional profile, track your profile completeness, upload resumes with automated skill detection, and discover high-fit internal opportunities.
            </p>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', listStyle: 'none', padding: 0 }}>
              {['Profile completeness indicator & missing items guide', 'Resume text & skill extraction with manual review', 'Personalized job recommendations sorted by match %', 'Transparent application tracking & status updates'].map((item, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                  <CheckCircle2 size={18} style={{ color: 'var(--success)' }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* FOR MANAGERS */}
          <div className="glass-card" id="managers" style={{ padding: '2.5rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--secondary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', marginBottom: '1.5rem' }}>
              <Briefcase size={24} />
            </div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem' }}>For Managers</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              Create targeted job openings, extract requirements from JD documents, discover ranked matching candidates, and process candidate applications efficiently.
            </p>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', listStyle: 'none', padding: 0 }}>
              {['Multi-step job creation wizard with JD document upload', 'Automated JD skill extraction with custom importance weights', 'Ranked candidates list with explainable skill gap analysis', 'Streamlined candidate review (Shortlist, Under Review, Accept, Reject)'].map((item, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                  <CheckCircle2 size={18} style={{ color: 'var(--secondary)' }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '3rem 2rem', textAlign: 'center', backgroundColor: 'var(--bg-base)' }}>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-dim)' }}>
          © 2026 MatchPulse Employee Matching Platform • Built with Java Spring Boot, Spring Security, JWT, JPA/Hibernate, MySQL & React.
        </p>
      </footer>
    </div>
  );
}
