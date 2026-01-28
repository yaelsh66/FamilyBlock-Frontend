import React, { useMemo, useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import { getIsRunningApi, blockDeviceApi, unblockDeviceApi } from '../api/deviceApi';
import { useAuth } from '../context/AuthContext';
import { updateChildTime } from '../api/timeControlApi';

function ControlScreenTime({ selectedChildId, childrenList = [] }) {
  const [totalScreenTime, setTotalScreenTime] = useState();
  const [timeToAddReduce, setTimeToAddReduce] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const { user, loading } = useAuth();
  const [childId, setChildId] = useState(null);
  const STEP_MINUTES = 5;
  useEffect(() => {

    const childId = Number(selectedChildId);
    setChildId(childId);

    const fetchTotalScreenTime = async () => {
      if (!selectedChildId) {
        setTotalScreenTime(0);
        return;
      }
      const total = childrenList.find((c) => c.id === childId)?.totalTime;
      if (!total) {
        setTotalScreenTime(0);
        return;
      }
      setTotalScreenTime(total);
    };

    const fetchIsBlocked = async () => {
      if (!selectedChildId) {
        setIsBlocked(false);
        return;
      }
      try{
        const res = await getIsRunningApi(childId, user.token);
        const isRunning = res.isRunning;
        console.log('isRunning: ', isRunning);
        setIsBlocked(isRunning);
      }catch(error){
        console.error('Failed to get is running:', error);
        setIsBlocked(false);
      }
    };

    fetchTotalScreenTime();
    fetchIsBlocked();
  }, [selectedChildId]);

  
  const handleBlock =async () => {
    setIsBlocked(true);
    try{
      await blockDeviceApi(childId, user.token);
    }catch(error){
      console.error('Failed to block device:', error);
      setIsBlocked(false);
    }
    console.log('Block', selectedChildId);
  };

  const handleUnblock = async () => {
    setIsBlocked(false);
    try{
      if(totalScreenTime <= 0){
        alert('Please add more time to unlock the device.');
        setIsBlocked(true);
        return;
      }
      await unblockDeviceApi(childId, user.token);
    }catch(error){
      console.error('Failed to block device:', error);
      setIsBlocked(false);
    }
    console.log('Unblock', selectedChildId);
  };

  const handleIncrementTime = () => {
    setTimeToAddReduce(timeToAddReduce + STEP_MINUTES);
    console.log('Increment time');
  };

  const handleDecrementTime = () => {
    if (timeToAddReduce * -1 >= totalScreenTime) {
      return;
    }
    setTimeToAddReduce(timeToAddReduce - STEP_MINUTES);
    console.log('Decrement time');
  };

  const handleSaveTime = async () => {
    try{
      
      const res = await updateChildTime(childId, timeToAddReduce, user.token);
      const newTotal = res.total;
      setTotalScreenTime(newTotal);
      setTimeToAddReduce(0);
    }catch(error){
      console.error('Failed to update child time:', error);
    }
    
  };
  
  return (
    <>
      <h5 className="control-screen-time-header">Screen Time</h5>

      <div className="mb-4">
        <Card className="quick-action-card">
          <Card.Body>
            <h5 className="section-title">Total Screen Time</h5>
            <div className="time-amount-box total-time-box">
              {totalScreenTime} min
            </div>

            <h5 className="section-title" style={{ marginTop: '1rem' }}>
              Add/Reduce Time
            </h5>
            <div className="time-amount-container">
              <Button
                onClick={handleDecrementTime}
                className="time-adjust-button"
                disabled={!selectedChildId}
              >
                -
              </Button>
              <div className="time-amount-box">
                {timeToAddReduce} min
              </div>
              <Button
                onClick={handleIncrementTime}
                className="time-adjust-button"
                disabled={!selectedChildId}
              >
                +
              </Button>
            </div>
            <Button
              onClick={handleSaveTime}
              className="save-time-button"
              disabled={!selectedChildId}
            >
              Save
            </Button>
            <p className="card-explanation">
              Adjust screen time limit by adding or removing minutes from the
              child's daily allowance.
            </p>
          </Card.Body>
        </Card>
      </div>

      <div className="mb-4">
        <Card className="quick-action-card">
          <Card.Body>
            <h5 className="section-title">Stop Time Now</h5>
            <div className="time-control-buttons">
              <Button
                variant="danger"
                onClick={handleBlock}
                disabled={isBlocked || !selectedChildId}
                className="control-button"
              >
                Block
              </Button>
              <Button
                variant="success"
                onClick={handleUnblock}
                disabled={!isBlocked || !selectedChildId}
                className="control-button"
              >
                Unblock
              </Button>
            </div>
            <p className="card-explanation">
              Instantly block or unblock screen time access for the selected
              child.
            </p>
          </Card.Body>
        </Card>
      </div>
    </>
  );
}

export default ControlScreenTime;

