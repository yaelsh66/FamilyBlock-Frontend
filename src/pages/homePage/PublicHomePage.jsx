import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import './PublicHomePage.css';

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = useMemo(
    () => [
      {
        icon: '📅',
        title: 'Weekly task planner',
        description: 'Build repeatable weekly routines and keep everyone aligned.',
      },
      {
        icon: '⏱',
        title: 'Daily time limits',
        description: 'Set sensible daily caps that adjust automatically as time is earned.',
      },
      {
        icon: '📆',
        title: 'Smart schedules',
        description: 'Create school/homework schedules so access matches your family’s rhythm.',
      },
      {
        icon: '🛡',
        title: 'App & site blocking',
        description: 'Block distracting apps and sites with school-friendly rules.',
      },
      {
        icon: '⚡',
        title: 'Instant actions',
        description: 'Block or unblock immediately when you need to intervene.',
      },
      {
        icon: '👨‍👩‍👧',
        title: 'Parent & child dashboards',
        description: 'Parents set guardrails; kids see what’s next and what they’ve earned.',
      },
    ],
    []
  );

  const handleScrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setIsMenuOpen(false);
  };

  return (
    <div className="home">

      {/* ================= NAVBAR ================= */}
      <nav className="nav">
        <div className="nav-inner">
          <Link to="/" className="logo" onClick={() => setIsMenuOpen(false)}>
            Worth It
          </Link>

          <button
            type="button"
            className="nav-toggle"
            aria-label="Toggle navigation"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>

          <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
            <button type="button" className="home-nav-link" onClick={() => handleScrollTo('how')}>How it works</button>
            <button type="button" className="home-nav-link" onClick={() => handleScrollTo('features')}>Features</button>
            <button type="button" className="home-nav-link" onClick={() => handleScrollTo('why')}>Why us</button>
            <Link to="/login" className="nav-btn" onClick={() => setIsMenuOpen(false)}>Login</Link>
          </div>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-content">
            <div className="hero-badge">Screen time that kids earn</div>
            <h1>
              Screen Time That’s <span>Worth It</span>
            </h1>
            <p>
              A calmer way to manage screen time.
              Kids earn access by completing weekly tasks.
              Parents control schedules, apps, and daily limits—without daily battles.
            </p>

            <div className="hero-buttons">
              <Link to="/signup" className="primary">Get Started</Link>
              <button type="button" className="secondary" onClick={() => handleScrollTo('how')}>See how it works</button>
            </div>

            <div className="hero-metrics" aria-label="Product highlights">
              <div className="metric">
                <div className="metric-value">Weekly</div>
                <div className="metric-label">planning</div>
              </div>
              <div className="metric">
                <div className="metric-value">Daily</div>
                <div className="metric-label">limits</div>
              </div>
              <div className="metric">
                <div className="metric-value">Instant</div>
                <div className="metric-label">block/unblock</div>
              </div>
            </div>
          </div>

          <div className="hero-mock" aria-label="Product preview cards">
            <div className="dashboard-card">
              <div className="card-kicker">Weekly planner</div>
              <h4>Tasks → earned minutes</h4>
              <p>Recurring routines, approvals, and a clear weekly view.</p>
              <div className="card-list">
                <span>Auto-assigned recurring tasks</span>
                <span>Earned: 1h 40m</span>
                <span>Pending approvals</span>
              </div>
            </div>

            <div className="dashboard-card parent">
              <div className="card-kicker">Parent controls</div>
              <h4>Limits that match your rules</h4>
              <p>Schedules, daily caps, and focused blocking when it matters.</p>
              <div className="card-list">
                <span>Daily limit: 1h 30m</span>
                <span>Schedule: 16:00–19:00</span>
                <span>Blocked: TikTok, games</span>
              </div>
              <div className="tiny-actions">
                <button type="button">Block now</button>
                <button type="button" className="outline">Unblock</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section id="how" className="section">
        <div className="container">
          <h2>How it works</h2>
          <p className="section-subtitle">
            Set expectations once, then let routines do the work. Kids earn time by completing tasks; parents approve and control access.
          </p>

          <div className="cards-3">
            <div className="card">
              <div className="step">01</div>
              <h3>Plan the week</h3>
              <p>
                Parents and kids create tasks in a shared weekly chart.
                Tasks can repeat and assign automatically.
              </p>
            </div>

            <div className="card">
              <div className="step">02</div>
              <h3>Earn screen time</h3>
              <p>
                Completed tasks convert into minutes. Parents approve with one click—clear, fair, and consistent.
              </p>
            </div>

            <div className="card">
              <div className="step">03</div>
              <h3>Control access smartly</h3>
              <p>
                Daily limits, schedules, selective blocking, and instant block/unblock when you need it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= WHY ================= */}
      <section id="why" className="section light">
        <div className="container">
          <h2>Why Worth It is different</h2>
          <p className="section-subtitle">
            Traditional tools rely on restrictions alone. Worth It pairs boundaries with responsibility—so you spend less time negotiating.
          </p>

          <div className="compare">
            <div className="compare-box red">
              <h4>Traditional controls</h4>
              <ul>
                <li>Blocks & restrictions</li>
                <li>Constant conflict</li>
                <li>All-or-nothing access</li>
              </ul>
            </div>

            <div className="compare-box green">
              <h4>Worth It</h4>
              <ul>
                <li>Builds responsibility</li>
                <li>Teaches time management</li>
                <li>School-friendly blocking</li>
                <li>Positive reinforcement</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="section">
        <div className="container">
          <h2>Core features</h2>
          <p className="section-subtitle">
            Everything you need to set clear boundaries—while helping kids build better habits.
          </p>

          <div className="grid features-grid">
            {features.map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon" aria-hidden="true">{f.icon}</div>
                <div className="feature-body">
                  <h3>{f.title}</h3>
                  <p>{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-inner">
          <div>© 2026 Worth It</div>
          <div className="footer-links">
            <button type="button" className="footer-link" onClick={() => handleScrollTo('features')}>Features</button>
            <button type="button" className="footer-link" onClick={() => handleScrollTo('how')}>How it works</button>
            <Link className="footer-link" to="/login">Login</Link>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default HomePage;
