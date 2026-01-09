// src/pages/ChildHomePage.jsx
import  '../../App.css';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AmountBox from '../../components/AmountBox';


import { useScreenTime } from '../../context/ScreenTimeContext';

function ChildHomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { totalScreenTime, pendingScreenTime, withdrawScreenTime, refreshScreenTime } = useScreenTime();

  

  const handleGoToTasks = () => {
    navigate('/child/tasks');
  };

  const handleWithdraw = async () => {
  const input = prompt('How many minutes would you like to withdraw?');

  const minutes = parseFloat(input);
  if (isNaN(minutes) || minutes <= 0) {
    alert('Please enter a valid number greater than 0');
    return;
  }

  if (minutes > totalScreenTime) {
    alert('You cannot withdraw more than your total time.');
    return;
  }

  try {
 
    await withdrawScreenTime(minutes); // ✅ update local state and database
    alert(`✅ You successfully withdrew ${minutes} minutes.`);

  } catch (err) {
    console.error(err);
    alert('❌ Withdrawal failed.');
  }
};


  return (
    <div style={{ minHeight: '100vh', paddingTop: '50px' }}>
      <Container className="text-center">
        <h2 className="mb-4">Hi 👦 {user?.nickname}</h2>

        <Button className="btn-orange" size="lg" onClick={handleGoToTasks}>
          Start Working
        </Button>


        <Row className="justify-content-center mt-5">
          <Col md={6}>
            <AmountBox label="🕒 My Screen Time" time={totalScreenTime} />
            <Button
              className="btn btn-danger mt-2"
              onClick={() => handleWithdraw()}
              disabled={totalScreenTime <= 0}
            >
              Withdraw Time
            </Button>
          </Col>
          <Col md={2}>
            <AmountBox label="🕒 Waiting for approval" time={pendingScreenTime} />
          </Col>
          <Col>
            <Button onClick={refreshScreenTime}>🔄 Refresh Time</Button>

          </Col>
        </Row>
        
      </Container>
    </div>
  );
}

export default ChildHomePage;
