import React from 'react';
import { Link } from 'react-router-dom';
import './PublicHomePage.css';

function PublicHomePage() {
  const features = [
    {
      icon: '🖥️',
      title: 'Desktop & Laptop Control',
      description: 'Complete parental control for Windows desktops and laptops. Monitor and manage your child\'s computer usage from anywhere.',
    },
    {
      icon: '🚫',
      title: 'Block Apps & Websites',
      description: 'Block specific Windows applications and websites. Instantly block or unblock access with a single click.',
    },
    {
      icon: '⏰',
      title: 'Daily Time Limits',
      description: 'Set daily screen time limits for each child. Control how much time they can spend on their computer each day.',
    },
    {
      icon: '📅',
      title: 'Schedule Management',
      description: 'Create custom schedules like school time and bedtime. Automatically block or allow access during specific hours.',
    },
    {
      icon: '✅',
      title: 'Task-Based Rewards',
      description: 'Family members create tasks with time rewards. Children complete tasks and earn screen time through parent approval.',
    },
    {
      icon: '👨‍👩‍👧',
      title: 'Family Collaboration',
      description: 'All family members can create tasks. Parents approve or reject task completions, and time is automatically added when approved.',
    },
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Set Up Your Family',
      description: 'Create accounts for parents and children. Install the desktop app on your child\'s Windows computer or laptop.',
      imagePlaceholder: 'hero-setup',
    },
    {
      step: '2',
      title: 'Configure Controls',
      description: 'Block Windows apps and websites, set daily time limits, and create schedules for school time, bedtime, and more.',
      imagePlaceholder: 'control-panel',
    },
    {
      step: '3',
      title: 'Create Tasks',
      description: 'Any family member can create tasks with time rewards. Assign tasks to children with specific time values.',
      imagePlaceholder: 'create-task',
    },
    {
      step: '4',
      title: 'Complete & Submit',
      description: 'Children complete assigned tasks and submit them for parent approval. Track pending approvals in real-time.',
      imagePlaceholder: 'submit-task',
    },
    {
      step: '5',
      title: 'Approve & Earn Time',
      description: 'Parents review and approve or reject task completions. Approved tasks automatically add time to the child\'s daily limit.',
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
                🖥️ Desktop Parental Control
              </span>
              <h1 className="hero-title">
                Complete Control Over Your <span className="highlight">Child's Computer</span>
              </h1>
              <p className="hero-description">
                Block Windows apps and websites, set daily time limits, create schedules, and reward tasks.
                Powerful parental control for Windows desktops and laptops with task-based screen time rewards.
              </p>
              <div className="hero-cta">
                <Link to="/signup" className="btn btn-primary btn-lg">
                  🚀 Get Started Free
                </Link>
                <Link to="/login" className="btn btn-outline-primary btn-lg">
                  🔑 Login
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
              Complete desktop control and task-based rewards. Set up in minutes and manage from anywhere.
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
            <h2 className="section-title">Powerful Features</h2>
            <p className="section-subtitle">
              Complete desktop parental control with task-based rewards. Everything you need to manage your child's computer usage.
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
            <h2 className="cta-title">Ready to Take Control?</h2>
            <p className="cta-description">
              Join families who are already using FamilyBlock to control their children's desktop usage and reward responsible behavior.
            </p>
            <div className="cta-buttons">
              <Link to="/signup" className="btn btn-primary btn-lg">
                🚀 Create Free Account
              </Link>
              <Link to="/login" className="btn btn-outline-light btn-lg">
                🔑 Login to Existing Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PublicHomePage;
