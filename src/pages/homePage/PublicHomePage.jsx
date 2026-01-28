import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
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
      imagePlaceholder: 'hero-setup', // NEW IMAGE NEEDED: Family setup screen or installation process
    },
    {
      step: '2',
      title: 'Configure Controls',
      description: 'Block Windows apps and websites, set daily time limits, and create schedules for school time, bedtime, and more.',
      imagePlaceholder: 'control-panel', // NEW IMAGE NEEDED: Parent control dashboard showing blocking options
    },
    {
      step: '3',
      title: 'Create Tasks',
      description: 'Any family member can create tasks with time rewards. Assign tasks to children with specific time values.',
      imagePlaceholder: 'create-task', // NEW IMAGE NEEDED: Task creation interface
    },
    {
      step: '4',
      title: 'Complete & Submit',
      description: 'Children complete assigned tasks and submit them for parent approval. Track pending approvals in real-time.',
      imagePlaceholder: 'submit-task', // NEW IMAGE NEEDED: Child submitting completed task
    },
    {
      step: '5',
      title: 'Approve & Earn Time',
      description: 'Parents review and approve or reject task completions. Approved tasks automatically add time to the child\'s daily limit.',
      imagePlaceholder: 'approve-task', // NEW IMAGE NEEDED: Parent approval interface showing approve/reject buttons
    },
  ];

  return (
    <div className="public-home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center min-vh-50">
            <Col lg={6} className="hero-content">
              <Badge bg="primary" className="hero-badge mb-3">
                🖥️ Desktop Parental Control
              </Badge>
              <h1 className="hero-title">
                Complete Control Over Your <span className="highlight">Child's Computer</span>
              </h1>
              <p className="hero-description">
                Block Windows apps and websites, set daily time limits, create schedules, and reward tasks. 
                Powerful parental control for Windows desktops and laptops with task-based screen time rewards.
              </p>
              <div className="hero-cta">
                <Button 
                  as={Link} 
                  to="/signup" 
                  variant="primary" 
                  size="lg" 
                  className="me-3 mb-2"
                >
                  🚀 Get Started Free
                </Button>
                <Button 
                  as={Link} 
                  to="/login" 
                  variant="outline-primary" 
                  size="lg"
                  className="mb-2"
                >
                  🔑 Login
                </Button>
              </div>
              <div className="hero-demo mt-4">
                <small className="text-muted">
                  <strong>Try it now:</strong> Parent: a@a.com / Child: b@b.com | Password: 098765
                </small>
              </div>
            </Col>
            <Col lg={6} className="hero-image-col">
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
            </Col>
          </Row>
        </Container>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section py-5">
        <Container>
          <Row>
            <Col className="text-center mb-5">
              <h2 className="section-title">How It Works</h2>
              <p className="section-subtitle">
                Complete desktop control and task-based rewards. Set up in minutes and manage from anywhere.
              </p>
            </Col>
          </Row>
          <div className="how-it-works-grid">
            {howItWorks.map((item, index) => (
              <Card key={index} className="how-it-works-card h-100">
                  <div className="step-number">{item.step}</div>
                  <div className="how-it-works-image-placeholder">
                    {/* NEW IMAGE NEEDED: {item.imagePlaceholder} */}
                    <div className="placeholder-content">
                      <div className="placeholder-icon">📷</div>
                      <div className="placeholder-text">Image: {item.imagePlaceholder}</div>
                    </div>
                  </div>
                  <Card.Body>
                    <Card.Title className="how-it-works-title">{item.title}</Card.Title>
                    <Card.Text className="how-it-works-text">{item.description}</Card.Text>
                  </Card.Body>
                </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="features-section py-5 bg-light">
        <Container>
          <Row>
            <Col className="text-center mb-5">
              <h2 className="section-title">Powerful Features</h2>
              <p className="section-subtitle">
                Complete desktop parental control with task-based rewards. Everything you need to manage your child's computer usage.
              </p>
            </Col>
          </Row>
          <Row className="g-4">
            {features.map((feature, index) => (
              <Col key={index} xs={12} md={6} lg={4}>
                <Card className="feature-card h-100">
                  <Card.Body>
                    <div className="feature-icon">{feature.icon}</div>
                    <Card.Title className="feature-title">{feature.title}</Card.Title>
                    <Card.Text className="feature-text">{feature.description}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-5">
        <Container>
          <Row>
            <Col className="text-center">
              <h2 className="cta-title">Ready to Take Control?</h2>
              <p className="cta-description mb-4">
                Join families who are already using FamilyBlock to control their children's desktop usage and reward responsible behavior.
              </p>
              <Button 
                as={Link} 
                to="/signup" 
                variant="primary" 
                size="lg"
                className="me-3 mb-2"
              >
                🚀 Create Free Account
              </Button>
              <Button 
                as={Link} 
                to="/login" 
                variant="outline-light" 
                size="lg"
                className="mb-2"
              >
                🔑 Login to Existing Account
              </Button>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
}

export default PublicHomePage;
