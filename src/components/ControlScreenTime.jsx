import React, { useState, useEffect } from 'react';
import { getIsRunningApi, blockDeviceApi, unblockDeviceApi } from '../api/deviceApi';
import { useAuth } from '../context/AuthContext';
import { updateChildTime } from '../api/timeControlApi';
import './ControlScreenTime.css';

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
    <div className="control-screen-time-container">
      <h5 className="control-screen-time-header">Screen Time</h5>

      <div className="control-section">
        <div className="control-card">
          <div className="control-card-body">
            <h5 className="section-title">Total Screen Time</h5>
            <div className="time-amount-box total-time-box">
              {totalScreenTime} min
            </div>

            <h5 className="section-title add-reduce-title">
              Add/Reduce Time
            </h5>
            <div className="time-amount-container">
              <button
                type="button"
                onClick={handleDecrementTime}
                className="time-adjust-button"
                disabled={!selectedChildId}
              >
                -
              </button>
              <div className="time-amount-box">
                {timeToAddReduce} min
              </div>
              <button
                type="button"
                onClick={handleIncrementTime}
                className="time-adjust-button"
                disabled={!selectedChildId}
              >
                +
              </button>
            </div>
            <button
              type="button"
              onClick={handleSaveTime}
              className="save-time-button"
              disabled={!selectedChildId}
            >
              Save
            </button>
            <p className="card-explanation">
              Adjust screen time limit by adding or removing minutes from the
              child's daily allowance.
            </p>
          </div>
        </div>
      </div>

      <div className="control-section">
        <div className="control-card">
          <div className="control-card-body">
            <h5 className="section-title">Stop Time Now</h5>
            <div className="time-control-buttons">
              <button
                type="button"
                onClick={handleBlock}
                disabled={isBlocked || !selectedChildId}
                className="control-button control-button-block"
              >
                Block
              </button>
              <button
                type="button"
                onClick={handleUnblock}
                disabled={!isBlocked || !selectedChildId}
                className="control-button control-button-unblock"
              >
                Unblock
              </button>
            </div>
            <p className="card-explanation">
              Instantly block or unblock screen time access for the selected
              child.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ControlScreenTime;

