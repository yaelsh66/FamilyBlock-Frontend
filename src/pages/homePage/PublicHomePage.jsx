import React from 'react';
import { Link } from 'react-router-dom';
import './PublicHomePage.css';

function PublicHomePage() {
  const features = [
    {
      icon: '🖥️',
      title: 'Control the PC',
      description: 'Parent control for your kid\'s Windows PC. Lock games and block websites so screen time stays in your hands.',
    },
    {
      icon: '🚫',
      title: 'Block Games & Sites',
      description: 'Choose which apps and websites to block. When time runs out or a schedule starts, they\'re locked—no exceptions.',
    },
    {
      icon: '⏰',
      title: 'Daily Time',
      description: 'Set a daily time allowance. Add or remove minutes anytime and start or stop time control with one tap.',
    },
    {
      icon: '📅',
      title: 'Time Schedules',
      description: 'Build schedules (e.g. school, homework). When it\'s time, games and sites are blocked and the PC becomes Work/School mode.',
    },
    {
      icon: '✅',
      title: 'Tasks That Earn Time',
      description: 'Create tasks; kids assign and complete them, then send for approval. You approve or reject—approved tasks add time to their balance.',
    },
    {
      icon: '👨‍👩‍👧',
      title: 'Family Tasks',
      description: 'The whole family can create tasks. Kids complete and submit; parents decide. Approved = time added to the child\'s balance.',
    },
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Set Up Your Family',
      description: 'Create parent and child accounts. Install Worth It on your kid\'s Windows PC so you can lock apps and sites from anywhere.',
      imagePlaceholder: 'hero-setup',
    },
    {
      step: '2',
      title: 'Lock Games & Sites',
      description: 'Choose which apps and websites to block. Set daily time and build schedules so the PC switches to Work/School when time is up.',
      imagePlaceholder: 'control-panel',
    },
    {
      step: '3',
      title: 'Add or Remove Time',
      description: 'Give or take minutes anytime. Start or stop time control when you need to—full control from your phone or browser.',
      imagePlaceholder: 'time-control',
    },
    {
      step: '4',
      title: 'Create & Complete Tasks',
      description: 'Family creates tasks; kids assign and complete them, then send for approval. You see everything in one place.',
      imagePlaceholder: 'submit-task',
    },
    {
      step: '5',
      title: 'Approve → Time Added',
      description: 'Approve or reject completions. When you approve, time is added to the child\'s balance. Screen time that\'s earned—Worth It.',
      imagePlaceholder: 'approve-task',
    },
  ];

  return (
    <div className="public-home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-row">
            <div className="hero-content">
              <span className="hero-badge">
                🖥️ Parent Control for Kids' PC
              </span>
              <h1 className="hero-title">
                Screen Time That's <span className="highlight">Worth It</span>
              </h1>
              <p className="hero-description">
                Lock games and block websites. Set daily time and schedules. When time runs out, the PC becomes Work/School. 
                Kids can earn more time by completing tasks, you approve, and the balance updates. Simple, fair, under your control.
              </p>
              <p className="hero-tagline">Free to start · No credit card required</p>
              <div className="hero-cta">
                <Link to="/signup" className="btn btn-primary btn-lg">
                  Get Started Free
                </Link>
                <Link to="/login" className="btn btn-outline-primary btn-lg">
                  Login
                </Link>
              </div>
              <div className="hero-demo">
                <small>
                  <strong>Try it now:</strong> Parent: a@a.com / Child: b@b.com | Password: 098765
                </small>
              </div>
            </div>
            <div className="hero-image-col">
              <div className="hero-image-wrapper">
                <div className="floating-card card-1">
                  <div className="card-icon">🚫</div>
                  <div className="card-text">App Blocked</div>
                </div>
                <div className="floating-card card-2">
                  <div className="card-icon">⏰</div>
                  <div className="card-text">School Time</div>
                </div>
                <div className="floating-card card-3">
                  <div className="card-icon">✅</div>
                  <div className="card-text">Task Approved</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">
              Lock apps and sites, set daily time and schedules, add or remove time, and reward tasks. Worth It puts you in control.
            </p>
          </div>
          <div className="how-it-works-grid">
            {howItWorks.map((item, index) => (
              <article key={index} className="how-it-works-card">
                <div className="step-number">{item.step}</div>
                <div className="how-it-works-image-placeholder">
                  <div className="placeholder-content">
                    <div className="placeholder-icon">📷</div>
                    <div className="placeholder-text">Image: {item.imagePlaceholder}</div>
                  </div>
                </div>
                <div className="how-it-works-card-body">
                  <h3 className="how-it-works-title">{item.title}</h3>
                  <p className="how-it-works-text">{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">What You Get</h2>
            <p className="section-subtitle">
              Block games and sites, daily time and schedules, add/remove time, start/stop control, and a task system that adds time when you approve.
            </p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <article key={index} className="feature-card">
                <div className="feature-card-body">
                  <div className="feature-icon">{feature.icon}</div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-text">{feature.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Make Screen Time Worth It</h2>
            <p className="cta-description">
              Lock games and sites, set daily time and schedules, and let kids earn time through tasks. You stay in control—they learn that time is earned.
            </p>
            <div className="cta-buttons">
              <Link to="/signup" className="btn btn-primary btn-lg">
                Create Free Account
              </Link>
              <Link to="/login" className="btn btn-outline-light btn-lg">
                Login to Existing Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PublicHomePage;
