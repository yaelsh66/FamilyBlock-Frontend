import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
    updateDailyTimeApi, 
    updateScheduleTimeApi, 
    getDailyTimeApi, 
    getScheduleTimesApi, 
    deleteScheduleTimeApi 
} from '../api/timeControlApi';

function TimeControl({ selectedChildId, children = [] }) {
    const { user } = useAuth();

    const [dailyTimeMinutes, setDailyTimeMinutes] = useState(30);
    const [dailyTimeDays, setDailyTimeDays] = useState([]);
    const [dailyTimes, setDailyTimes] = useState([]);
    const [editingDailyTimeIndex, setEditingDailyTimeIndex] = useState(null);

    const [scheduleTimes, setScheduleTimes] = useState([]);
    const [scheduleTimeDays, setScheduleTimeDays] = useState([]);
    const [scheduleTimeStart, setScheduleTimeStart] = useState('22:00');
    const [scheduleTimeEnd, setScheduleTimeEnd] = useState('06:00');
    const [editingScheduleTimeIndex, setEditingScheduleTimeIndex] = useState(null);

    const weekDays = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const weekdays = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY'];
    const weekend = ['FRIDAY', 'SATURDAY'];
    const [selectedChild, setSelectedChild] = useState(null);
    
    
    useEffect(() => {
        if (selectedChildId && children.length > 0) {
            let foundChild = null;
            // Use for...of loop similar to how map iterates
            for (const child of children) {
                if (child.id === selectedChildId || 
                    Number(child.id) === Number(selectedChildId) ||
                    String(child.id) === String(selectedChildId)) {
                    foundChild = child;
                    break;
                }
            }
            
            setSelectedChild(foundChild);
            console.log('Found child:', foundChild ? foundChild.id : 'not found');
        } else {
            setSelectedChild(null);
        }
    }, [selectedChildId, children]);

    useEffect(() => {
        if (!selectedChildId || !user) {
            setDailyTimes([]);
            setScheduleTimes([]);
            return;
        }
        fetchDailyTime();
        fetchScheduleTimes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedChildId, user]);

    const fetchDailyTime = async () => {
        if (!selectedChildId || !user) {
            return;
        }
        try {
            setDailyTimes([]);
            const dailyTimeList = await getDailyTimeApi(selectedChildId, user.token);
            setDailyTimes(dailyTimeList);
        } catch (error) {
            console.error('Failed to get daily time for child:', error);
        }
    };

    const fetchScheduleTimes = async () => {
        if (!selectedChildId || !user) {
            return;
        }
        try {
            const scheduleTimeList = await getScheduleTimesApi(selectedChildId, user.token);
            setScheduleTimes(scheduleTimeList);
        } catch (error) {
            console.error('Failed to get schedule times for child:', error);
        }
    };

    const handleToggleDay = (day) => {
        setDailyTimeDays(prev =>
            prev.includes(day)
                ? prev.filter(d => d !== day)
                : [...prev, day].sort((a, b) => weekDays.indexOf(a) - weekDays.indexOf(b))
        );
    };

    const handleSelectAll = () => {
        if (dailyTimeDays.length === 7) {
            setDailyTimeDays([]);
        } else {
            setDailyTimeDays([...weekDays]);
        }
    };

    const handleSelectWeekdays = () => {
        const isWeekdaysSelected = weekdays.every(day => dailyTimeDays.includes(day));
        if (isWeekdaysSelected) {
            setDailyTimeDays(prev => prev.filter(day => !weekdays.includes(day)));
        } else {
            setDailyTimeDays(prev => {
                const withoutWeekdays = prev.filter(day => !weekdays.includes(day));
                return [...withoutWeekdays, ...weekdays].sort((a, b) => weekDays.indexOf(a) - weekDays.indexOf(b));
            });
        }
    };

    const handleSelectWeekend = () => {
        const isWeekendSelected = weekend.every(day => dailyTimeDays.includes(day));
        if (isWeekendSelected) {
            setDailyTimeDays(prev => prev.filter(day => !weekend.includes(day)));
        } else {
            setDailyTimeDays(prev => {
                const withoutWeekend = prev.filter(day => !weekend.includes(day));
                return [...withoutWeekend, ...weekend].sort((a, b) => weekDays.indexOf(a) - weekDays.indexOf(b));
            });
        }
    };

    const handleSaveDailyTime = async () => {
        if (dailyTimeMinutes <= 0) {
            alert('Please add more time to save.');
            return;
        }
        if (dailyTimeDays.length === 0) {
            alert('Please select at least one day');
            return;
        }
        if (!user) {
            return;
        }

        try {
            if (children && children.length > 0) {
                await Promise.all(
                    children.map((child) =>
                        updateDailyTimeApi(child.id, dailyTimeMinutes, dailyTimeDays, user.token)
                    )
                );
            } else {
                alert('No children available to save settings for.');
                return;
            }
        } catch (error) {
            console.error('Failed to save daily time:', error);
        }

        setDailyTimeDays([]);
        setDailyTimeMinutes(30);
        setEditingDailyTimeIndex(null);
    };

    const handleSaveDailyTimeForChild = async (childId) => {
        if (dailyTimeMinutes <= 0) {
            alert('Please add more time to save.');
            return;
        }
        if (dailyTimeDays.length === 0) {
            alert('Please select at least one day');
            return;
        }
        if (!user || !childId) {
            return;
        }

        try {
            await updateDailyTimeApi(childId, dailyTimeMinutes, dailyTimeDays, user.token);
            if (childId === selectedChildId) {
                await fetchDailyTime();
            }
        } catch (error) {
            console.error('Failed to save daily time for child:', error);
        }

        setDailyTimeDays([]);
        setDailyTimeMinutes(30);
        setEditingDailyTimeIndex(null);
    };

    const handleCancelEditDailyTime = () => {
        setEditingDailyTimeIndex(null);
        setDailyTimeDays([]);
        setDailyTimeMinutes(30);
    };

    const handleToggleScheduleTimeDay = (day) => {
        setScheduleTimeDays(prev =>
            prev.includes(day)
                ? prev.filter(d => d !== day)
                : [...prev, day].sort((a, b) => weekDays.indexOf(a) - weekDays.indexOf(b))
        );
    };

    const handleSelectAllScheduleTime = () => {
        if (scheduleTimeDays.length === 7) {
            setScheduleTimeDays([]);
        } else {
            setScheduleTimeDays([...weekDays]);
        }
    };

    const handleSelectWeekdaysScheduleTime = () => {
        const isWeekdaysSelected = weekdays.every(day => scheduleTimeDays.includes(day));
        if (isWeekdaysSelected) {
            setScheduleTimeDays(prev => prev.filter(day => !weekdays.includes(day)));
        } else {
            setScheduleTimeDays(prev => {
                const withoutWeekdays = prev.filter(day => !weekdays.includes(day));
                return [...withoutWeekdays, ...weekdays].sort((a, b) => weekDays.indexOf(a) - weekDays.indexOf(b));
            });
        }
    };

    const handleSelectWeekendScheduleTime = () => {
        const isWeekendSelected = weekend.every(day => scheduleTimeDays.includes(day));
        if (isWeekendSelected) {
            setScheduleTimeDays(prev => prev.filter(day => !weekend.includes(day)));
        } else {
            setScheduleTimeDays(prev => {
                const withoutWeekend = prev.filter(day => !weekend.includes(day));
                return [...withoutWeekend, ...weekend].sort((a, b) => weekDays.indexOf(a) - weekDays.indexOf(b));
            });
        }
    };

    const handleSaveScheduleTime = async () => {
        if (scheduleTimeDays.length === 0) {
            alert('Please select at least one day');
            return;
        }
        if (!user) {
            return;
        }

        const scheduleTime = {
            name: '',
            days: [...scheduleTimeDays],
            startTime: scheduleTimeStart,
            endTime: scheduleTimeEnd
        };

        try {
            if (children && children.length > 0) {
                await Promise.all(
                    children.map((child) =>
                        updateScheduleTimeApi(child.id, scheduleTime, user.token)
                    )
                );
            } else {
                alert('No children available to save settings for.');
                return;
            }
        } catch (error) {
            console.error('Failed to save schedule time:', error);
        }

        if (editingScheduleTimeIndex !== null) {
            setScheduleTimes(prev => {
                const updated = [...prev];
                updated[editingScheduleTimeIndex] = scheduleTime;
                return updated;
            });
            setEditingScheduleTimeIndex(null);
        } else {
            setScheduleTimes(prev => [...prev, scheduleTime]);
        }

        setScheduleTimeDays([]);
        
        setScheduleTimeStart('22:00');
        setScheduleTimeEnd('06:00');
    };

    const handleSaveScheduleTimeForChild = async (childId) => {
        if (scheduleTimeDays.length === 0) {
            alert('Please select at least one day');
            return;
        }
        if (!user || !childId) {
            return;
        }

        const scheduleTime = {
            name: '',
            days: [...scheduleTimeDays],
            startTime: scheduleTimeStart,
            endTime: scheduleTimeEnd
        };

        try {
            await updateScheduleTimeApi(childId, scheduleTime, user.token);
        } catch (error) {
            console.error('Failed to save schedule time for child:', error);
        }

        if (editingScheduleTimeIndex !== null) {
            setScheduleTimes(prev => {
                const updated = [...prev];
                updated[editingScheduleTimeIndex] = scheduleTime;
                return updated;
            });
            setEditingScheduleTimeIndex(null);
        } else {
            setScheduleTimes(prev => [...prev, scheduleTime]);
        }

        setScheduleTimeDays([]);
        
        setScheduleTimeStart('22:00');
        setScheduleTimeEnd('06:00');
    };

    const handleDeleteScheduleTime = (index) => {
        if (!user) {
            return;
        }
        if (window.confirm('Are you sure you want to delete this schedule time?')) {
            setScheduleTimes(prev => prev.filter((_, i) => i !== index));
            try {
                deleteScheduleTimeApi(scheduleTimes[index].id, user.token);
            } catch (error) {
                console.log('Failed to delete schedule time:', error);
            }

            if (editingScheduleTimeIndex === index) {
                handleCancelEditScheduleTime();
            } else if (editingScheduleTimeIndex > index) {
                setEditingScheduleTimeIndex(prev => prev - 1);
            }
        }
    };

    const handleCancelEditScheduleTime = () => {
        setEditingScheduleTimeIndex(null);
        setScheduleTimeDays([]);
        setScheduleTimeStart('22:00');
        setScheduleTimeEnd('06:00');
    };

    return (
        <div className="time-control-content">
            <h3 className="time-control-title">Time Control</h3>

            <div className="control-section">
                <h5 className="section-title">Choose Daily Time</h5>
                <div className="days-selection">
                    {weekDays.map((day) => (
                        <button
                            key={day}
                            type="button"
                            onClick={() => handleToggleDay(day)}
                            className={`btn day-button ${dailyTimeDays.includes(day) ? 'btn-primary' : 'btn-outline-primary'}`}
                        >
                            {day.substring(0, 3)}
                        </button>
                    ))}
                </div>
                <div className="days-selection-special">
                    <button
                        type="button"
                        onClick={handleSelectAll}
                        className={`btn special-day-button ${dailyTimeDays.length === 7 ? 'btn-primary' : 'btn-outline-secondary'}`}
                    >
                        All
                    </button>
                    <button
                        type="button"
                        onClick={handleSelectWeekdays}
                        className={`btn special-day-button ${weekdays.every(day => dailyTimeDays.includes(day)) ? 'btn-primary' : 'btn-outline-secondary'}`}
                    >
                        Weekdays
                    </button>
                    <button
                        type="button"
                        onClick={handleSelectWeekend}
                        className={`btn special-day-button ${weekend.every(day => dailyTimeDays.includes(day)) ? 'btn-primary' : 'btn-outline-secondary'}`}
                    >
                        Weekend
                    </button>
                </div>
                <div className="time-input-container">
                    <label htmlFor="daily-time-input">Time (minutes): </label>
                    <input
                        id="daily-time-input"
                        type="number"
                        min="0"
                        value={dailyTimeMinutes}
                        onChange={(e) => setDailyTimeMinutes(parseInt(e.target.value) || 0)}
                    />
                </div>
                <button
                    type="button"
                    className="btn btn-primary save-time-button"
                    onClick={handleSaveDailyTime}
                >
                    Save for All Children
                </button>
                {selectedChildId && selectedChild && (
                    <button
                        type="button"
                        className="btn btn-secondary save-time-button"
                        onClick={() => handleSaveDailyTimeForChild(selectedChildId)}
                    >
                        Save for {selectedChild.nickname || selectedChild.email || selectedChild.uid}
                    </button>
                )}
                {editingDailyTimeIndex !== null && (
                    <button
                        type="button"
                        className="btn btn-secondary save-time-button cancel-edit-button"
                        onClick={handleCancelEditDailyTime}
                    >
                        Cancel
                    </button>
                )}

                {dailyTimes.length > 0 && (
                    <div className="schedule-time-list">
                        <h5 className="section-subtitle">Existing Daily Times</h5>
                        <div className="daily-times-grid">
                            <div className="daily-times-days-row">
                                {weekDays.map((day) => {
                                    const dayShortcut = day.substring(0, 3);
                                    return (
                                        <div key={day} className="daily-time-day-cell">
                                            <strong>{dayShortcut}</strong>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="daily-times-values-row">
                                {weekDays.map((day) => {
                                    const dayEntries = dailyTimes
                                        .filter(dt => dt.days && dt.days.includes(day));

                                    return (
                                        <div key={day} className="daily-time-value-cell">
                                            {dayEntries.length > 0 ? (
                                                dayEntries.map((dt, entryIndex) => (
                                                    <div key={entryIndex}>
                                                        {dt.time || 0} min
                                                    </div>
                                                ))
                                            ) : (
                                                <div>-</div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="control-section">
                <h5 className="section-title">Schedule Block</h5>
                <div className="days-selection">
                    {weekDays.map((day) => (
                        <button
                            key={day}
                            type="button"
                            onClick={() => handleToggleScheduleTimeDay(day)}
                            className={`btn day-button ${scheduleTimeDays.includes(day) ? 'btn-primary' : 'btn-outline-primary'}`}
                        >
                            {day.substring(0, 3)}
                        </button>
                    ))}
                </div>
                <div className="days-selection-special">
                    <button
                        type="button"
                        onClick={handleSelectAllScheduleTime}
                        className={`btn special-day-button ${scheduleTimeDays.length === 7 ? 'btn-primary' : 'btn-outline-secondary'}`}
                    >
                        All
                    </button>
                    <button
                        type="button"
                        onClick={handleSelectWeekdaysScheduleTime}
                        className={`btn special-day-button ${weekdays.every(day => scheduleTimeDays.includes(day)) ? 'btn-primary' : 'btn-outline-secondary'}`}
                    >
                        Weekdays
                    </button>
                    <button
                        type="button"
                        onClick={handleSelectWeekendScheduleTime}
                        className={`btn special-day-button ${weekend.every(day => scheduleTimeDays.includes(day)) ? 'btn-primary' : 'btn-outline-secondary'}`}
                    >
                        Weekend
                    </button>
                </div>
                <div className="schedule-time-inputs">
                    <div className="time-input-container">
                        <label htmlFor="schedule-time-start">Start Time: </label>
                        <input
                            id="schedule-time-start"
                            type="time"
                            value={scheduleTimeStart}
                            onChange={(e) => setScheduleTimeStart(e.target.value)}
                        />
                    </div>
                    <div className="time-input-container">
                        <label htmlFor="schedule-time-end">End Time: </label>
                        <input
                            id="schedule-time-end"
                            type="time"
                            value={scheduleTimeEnd}
                            onChange={(e) => setScheduleTimeEnd(e.target.value)}
                        />
                    </div>
                </div>
                <button
                    type="button"
                    className="btn btn-primary save-time-button"
                    onClick={handleSaveScheduleTime}
                >
                    Save for All Children
                </button>
                {selectedChildId && selectedChild && (
                    <button
                        type="button"
                        className="btn btn-secondary save-time-button"
                        onClick={() => handleSaveScheduleTimeForChild(selectedChildId)}
                    >
                        Save for {selectedChild.nickname || selectedChild.email || selectedChild.uid}
                    </button>
                )}
                {editingScheduleTimeIndex !== null && (
                    <button
                        type="button"
                        className="btn btn-secondary save-time-button cancel-edit-button"
                        onClick={handleCancelEditScheduleTime}
                    >
                        Cancel
                    </button>
                )}

                {scheduleTimes.length > 0 && (
                    <div className="schedule-time-list">
                        <h5 className="section-subtitle">Existing Schedule Times</h5>
                        {scheduleTimes.map((st, index) => (
                            <div key={index} className="schedule-time-item">
                                <div className="schedule-time-info">
                                    <div><strong>Days:</strong> {st.days.join(', ') || 'None'}</div>
                                    <div><strong>Start:</strong> {st.startTime}</div>
                                    <div><strong>End:</strong> {st.endTime}</div>
                                </div>
                                <div className="schedule-time-actions">
                                    <button
                                        type="button"
                                        className="btn btn-danger btn-sm action-button"
                                        onClick={() => handleDeleteScheduleTime(index)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default TimeControl;

