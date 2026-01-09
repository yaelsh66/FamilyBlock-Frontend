import { Card } from 'react-bootstrap';

function AmountBox({ label, time, size = 'medium', icon }) {
  const sizeStyles = {
    small: { fontSize: '1rem', padding: '0.5rem 1rem' },
    medium: { fontSize: '1.5rem', padding: '1rem 1.5rem' },
    large: { fontSize: '2rem', padding: '1.5rem 2rem' },
  };

  const boxStyle = {
    backgroundColor: '#FFE0B2', // light orange
    color: '#6d4c41', // dark brown text for contrast
    border: '1px solid #FFCC80',
    borderRadius: '12px',
    ...sizeStyles[size],
  };

  return (
    <Card className="mt-3 shadow-sm" style={boxStyle}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <div style={{ fontSize: '1.2rem', opacity: 0.9 }}>{label}</div>
            <div style={{ fontWeight: 'bold' }}>{time} min</div>
          </div>
          {icon && <div style={{ fontSize: '1.5rem' }}>{icon}</div>}
        </div>
      </Card.Body>
    </Card>
  );
}

export default AmountBox;
