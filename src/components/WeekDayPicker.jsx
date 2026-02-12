import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';

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
        <div className='p-2 border rounded bg-light'>
            <Form className="p-2 border rounded bg-light">
            {weekDayNames.map((name, idx) => (
                <Form.Check
                key={idx}
                type="checkbox"
                id={`weekday-${idx}`}
                label={name}
                checked={selectedDays.includes(idx)}
                onChange={() => toggleDay(idx)}
                className="mb-1"
                />
            ))}     
            {/* —— Time picker —— */}
            <Form.Group controlId="timeInput" className="mt-3">
                <Form.Label>Pick a time</Form.Label>
                <Form.Control
                    type="time"
                    value={selectedTime}
                    onChange={e => setSelectedTime(e.target.value)}
                />
            </Form.Group>
            </Form>
            <div className='mt-2 d-flex justify-content-end gap-2'>
                {onCancel && (
                  <Button variant="outline-secondary" onClick={onCancel}>Cancel</Button>
                )}
                <Button onClick={() => onDone(selectedDays, selectedTime)}>Done</Button>
            </div>
        </div>
    );
}

export default WeekDayPicker;