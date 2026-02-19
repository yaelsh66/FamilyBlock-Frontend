import React, { useState, useEffect } from 'react';
import './WeekDayPicker.css';

const weekDayNames = [
  'SUNDAY', 'MONDAY', 'TUESDAY',
  'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'
];

function WeekDayPicker({ onChange, onDone, onCancel, initialSelectedDays, initialSelectedTime }) {
  const [selectedDays, setSelectedDays] = useState(() =>
    Array.isArray(initialSelectedDays) ? initialSelectedDays : []
  );
  const [selectedTime, setSelectedTime] = useState(() =>
    initialSelectedTime ?? '09:00'
  );

  useEffect(() => {
    if (Array.isArray(initialSelectedDays)) setSelectedDays(initialSelectedDays);
    if (initialSelectedTime != null) setSelectedTime(initialSelectedTime);
  }, [initialSelectedDays, initialSelectedTime]);

  const toggleDay = idx => {
        setSelectedDays(prev => {
        const next = prev.includes(idx)
            ? prev.filter(d => d !== idx)
            : [...prev, idx];
       // onChange(next);    // <- only fire when the user toggles
        return next;
        });
    };

    return (
        <div className="weekday-picker panel">
            <div className="weekday-picker-form">
            {weekDayNames.map((name, idx) => (
                <label key={idx} className="form-check">
                <input
                    type="checkbox"
                    id={`weekday-${idx}`}
                    checked={selectedDays.includes(idx)}
                    onChange={() => toggleDay(idx)}
                />
                {name}
                </label>
            ))}     
            <div className="form-group mt-3">
                <label className="form-label" htmlFor="timeInput">Pick a time</label>
                <input
                    id="timeInput"
                    type="time"
                    className="form-control"
                    value={selectedTime}
                    onChange={e => setSelectedTime(e.target.value)}
                />
            </div>
            </div>
            <div className="mt-2 d-flex justify-content-end gap-2">
                {onCancel && (
                  <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Cancel</button>
                )}
                <button type="button" className="btn btn-primary" onClick={() => onDone(selectedDays, selectedTime)}>Done</button>
            </div>
        </div>
    );
}

export default WeekDayPicker;