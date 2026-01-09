import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

const weekDayNames = [
  'Sunday', 'Monday', 'Tuesday',
  'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

function WeekDayPicker({ onChange, onDone}) {

  
    const [selectedDays, setSelectedDays] = useState([]);
    const [selectedTime, setSelectedTime] = useState('09:00')
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
            <div className='mt-2 d-flex justify-content-end'>
                <Button onClick={() => onDone(selectedDays, selectedTime)}>Done</Button>
            </div>
        </div>
    );
}

export default WeekDayPicker;