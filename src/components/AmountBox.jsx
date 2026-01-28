import './AmountBox.css';

function AmountBox({ label, time, size = 'medium', icon }) {
  return (
    <div className={`amount-box amount-box-${size}`}>
      <div className="amount-box-content">
        <div className="amount-box-text-container">
          <div className={`amount-box-label amount-box-label-${size}`}>{label}</div>
          <div className={`amount-box-time amount-box-time-${size}`}>{time} min</div>
        </div>
        {icon && <div className={`amount-box-icon amount-box-icon-${size}`}>{icon}</div>}
      </div>
    </div>
  );
}

export default AmountBox;
