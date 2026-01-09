// src/pages/PublicHomePage.jsx
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import "./PublicHomePage.css";

function PublicHomePage() {
  const steps = [
    {
      title: "1. Family signs in",
      desc: "Each parent and child gets their own login.",
      img: "/Image1.jpeg",
    },
    {
      title: "2. Add chores",
      desc: "Assign screen time as a reward for each task.",
      img: "/Image2.jpeg",
    },
    {
      title: "3. Complete & submit",
      desc: "Kids complete chores and submit them for approval.",
      img: "/Image3.jpeg",
    },
    {
      title: "4. Approval = screen time",
      desc: "Once approved, kids earn minutes!",
      img: "/Image4.PNG",
    },
    {
      title: "5. Use time wisely",
      desc: "Kids can spend time and see their balance update.",
      img: "/Image5.jpeg",
    },
  ];

  return (
    <Container className="public-home py-5">
      <header className="text-center mb-5">
        <h1 className="display-4 fw-bold">🏡 Working Family App</h1>
        <p className="lead fs-4">
          Kids earn screen time by doing household chores 💪📱
        </p>
        <Button as={Link} to="/signup" variant="success" size="lg" className="mt-3">
          🚀 Get Started
        </Button>
      </header>

      <section className="mb-5">
        <h2 className="text-center mb-4 how-title">
          🛠️ How does it work?
        </h2>
        <Row xs={1} sm={2} md={3} lg={5} className="g-4 text-center">
          {steps.map((step, idx) => (
            <Col key={idx}>
              <Card className="h-100 shadow-sm rounded-4">
                <Card.Img
                  variant="top"
                  src={step.img}
                  alt={step.title}
                  className="step-image"
                />
                <Card.Body>
                  <Card.Title className="fs-5">{step.title}</Card.Title>
                  <Card.Text>{step.desc}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      <section className="text-center mt-5">
        <h2 className="mb-4">✨ Key Features</h2>
        <Row xs={1} md={3} className="g-4">
          <Col>
            <Card className="h-100 shadow-sm text-center p-3 border-0 bg-light rounded-4">
              <Card.Img
                variant="top"
                src="https://img.icons8.com/external-flaticons-lineal-color-flat-icons/64/000000/external-chores-household-flaticons-lineal-color-flat-icons.png"
                className="mx-auto"
              />
              <Card.Body>
                <Card.Title>Assign Chores</Card.Title>
                <Card.Text>
                  Add tasks and attach screen time rewards easily.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className="h-100 shadow-sm text-center p-3 border-0 bg-light rounded-4">
              <Card.Img
                variant="top"
                src="https://img.icons8.com/external-justicon-flat-justicon/64/000000/external-edit-user-interface-justicon-flat-justicon.png"
                className="mx-auto"
              />
              <Card.Body>
                <Card.Title>Change Rewards Anytime</Card.Title>
                <Card.Text>
                  Update screen time values or chore details live.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card className="h-100 shadow-sm text-center p-3 border-0 bg-light rounded-4">
              <Card.Img
                variant="top"
                src="https://img.icons8.com/external-flat-icons-inmotus-design/64/000000/external-whatsapp-social-media-flat-icons-inmotus-design.png"
                className="mx-auto"
              />
              <Card.Body>
                <Card.Title>Notify Parents</Card.Title>
                <Card.Text>
                  Kids notify the parents when chores are ready for approval.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>
    </Container>
  );
}

export default PublicHomePage;
