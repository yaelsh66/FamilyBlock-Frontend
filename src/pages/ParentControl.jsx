import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert, Card, Button } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import './ParentControl.css';
import { updateChildAppsApi, updateChildSitesApi, getChildAppsApi, getChildSitesApi } from '../api/deviceApi';
import { updateDailyTimeApi, updateScheduleTimeApi, getDailyTimeApi, getScheduleTimesApi, deleteScheduleTimeApi } from '../api/timeControlApi';
function ParentControl({ selectedChildId, children = [], initialSection = null }) {

    const sites = [
        { id: 1, name: "Roblox", url: "roblox.com" },
        { id: 2, name: "Online Games", url: ["coolmathgames.com", "friv.com", "y8.com", "kizi.com", "agame.com", "miniclip.com", "playhop.com",
            "lagged.com", "mathplayground.com", "iogames.space", "iogames.fun", "solitaired.com", "247solitaire.com",
            "worldofsolitaire.com", "cardgames.io", "arkadium.com", "freegames.org", "addictinggames.com", "crazygames.com", "poki.com"] },
        { id: 3, name: "YouTube", url: ["youtube.com", "youtubekids.com"] },
        { id: 4, name: "Netflix", url: "netflix.com" },
        { id: 5, name: "TikTok", url: "tiktok.com" },
        { id: 6, name: "Kan", url: ["kan.org.il", "kankids.org.il"] },
    ];
    
    const apps = [
        { id: 1, name: "Microsoft Games", processName: ["Solitaire.exe", "Minesweeper.exe", "Mahjong.exe", "Sudoku.exe", "BubbleBreaker.exe",
            "GameManagerService.exe", "Jigsaw.exe", "UltimateWordGames.exe"]},
        { id: 2, name: "Slack", processName: "slack.exe" },
        { id: 3, name: "Zoom", processName: "Zoom.exe" },
        { id: 4, name: "Telegram Desktop", processName: "telegram.exe" },
        { id: 5, name: "WhatsApp Desktop", processName: "WhatsApp.exe" },
        { id: 6, name: "Minecraft", processName: ["MinecraftLauncher.exe", "javaw.exe", "Minecraft.Windows.exe"] },
        { id: 7, name: "Xbox App", processName: "XboxApp.exe" },
        { id: 8, name: "Spotify", processName: "Spotify.exe" },
        { id: 9, name: "Netflix", processName: "Netflix.exe" },
        { id: 10, name: "YouTube", processName: "YouTube Music.exe" },
        { id: 11, name: "Roblox", processName: ["RobloxPlayerBeta.exe", "RobloxStudioBeta.exe", "RobloxPlayerLauncher.exe"] },
        { id: 12, name: "TikTok", processName: "TikTok.exe" },
        { id: 13, name: "Xbox Game Bar", processName: "GameBar.exe" },
        { id: 14, name: "mikmak2", processName: "mikmak2.exe" },
    ];

    const browsers = [
        { id: 1, name: "Google Chrome", processName: "chrome.exe" },
        { id: 2, name: "Microsoft Edge", processName: "msedge.exe" },
        { id: 3, name: "Mozilla Firefox", processName: "firefox.exe" },
        { id: 4, name: "Opera", processName: "opera.exe" },
        { id: 5, name: "Brave", processName: "brave.exe" },
        { id: 6, name: "Vivaldi", processName: "vivaldi.exe" },
        { id: 7, name: "Tor Browser", processName: "firefox.exe" },
        { id: 8, name: "Internet Explorer", processName: "iexplore.exe" }
    ];
    const { user, loading } = useAuth();
    const [error, setError] = useState('');
    const [selectedAppIds, setSelectedAppIds] = useState([]);
    const [selectedSiteIds, setSelectedSiteIds] = useState([]);
    const [activeSection, setActiveSection] = useState(initialSection);
    const [dailyTimeMinutes, setDailyTimeMinutes] = useState(30);
    const [dailyTimeDays, setDailyTimeDays] = useState([]);
    const [dailyTimes, setDailyTimes] = useState([]);
    const [editingDailyTimeIndex, setEditingDailyTimeIndex] = useState(null);
    const [scheduleTimes, setScheduleTimes] = useState([]);
    const [scheduleTimeDays, setScheduleTimeDays] = useState([]);
    const [scheduleTimeName, setScheduleTimeName] = useState('');
    const [scheduleTimeStart, setScheduleTimeStart] = useState('22:00');
    const [scheduleTimeEnd, setScheduleTimeEnd] = useState('06:00');
    const [editingScheduleTimeIndex, setEditingScheduleTimeIndex] = useState(null);
    const [selectedChild, setSelectedChild] = useState(null);

    const weekDays = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    const weekdays = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY'];
    const weekend = ['FRIDAY', 'SATURDAY'];
    
    const fetchDailyTime = async () => {
        if (!selectedChildId) {
            
            return;
        }
        try{
            
            setDailyTimes([]); // Clear the list before fetching
            const dailyTimeList = await getDailyTimeApi(selectedChildId, user.token);
            console.log('daily time list: ', dailyTimeList);
            setDailyTimes(dailyTimeList);
        }catch(error){
            console.error('Failed to get daily time for child:', error);
        }
    }
    
    
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
        if (!selectedChildId) {
            
            return;
        }
        const fetchChildApps = async () => {
            try{
                const apps = await getChildAppsApi(selectedChildId, user.token);
                setSelectedAppIds([]);
                if (!apps) return;
                const rawList = apps.appList;
                const appsArray = Array.isArray(rawList) ? rawList : (typeof rawList === 'string' ? JSON.parse(rawList) : []);
                const appIds = appsArray
                    .map((item) => findAppIdByProcessName(typeof item === 'string' ? item : item?.processName ?? item))
                    .filter(Boolean);
                setSelectedAppIds(appIds);
            }catch(error){
                console.error('Failed to get apps for child:', error);
            }
        }
        const fetchChildSites = async () => {
            try{
                const sites = await getChildSitesApi(selectedChildId, user.token);
                setSelectedSiteIds([]);
                if (!sites) return;
                const rawList = sites.siteList;
                const sitesArray = Array.isArray(rawList) ? rawList : (typeof rawList === 'string' ? JSON.parse(rawList || '[]') : []);
                const siteIds = sitesArray
                    .map((item) => findSiteIdByName(typeof item === 'string' ? item : item?.url ?? item))
                    .filter(Boolean);
                setSelectedSiteIds(siteIds);
            }catch(error){
                console.error('Failed to get sites for child:', error);
            }
        }

        const fetchScheduleTimes = async () => {
            try{
                const scheduleTimeList = await getScheduleTimesApi(selectedChildId, user.token);
                setScheduleTimes(scheduleTimeList);
            }catch(error){
                console.error('Failed to get schedule times for child:', error);
            }
        }

        fetchChildApps();
        fetchChildSites();
        fetchDailyTime();
        fetchScheduleTimes();
    }, [selectedChildId, user]);

    // Handle initialSection prop changes
    useEffect(() => {
        if (initialSection && (initialSection === 'apps' || initialSection === 'sites')) {
            setActiveSection(initialSection);
        }
    }, [initialSection]);

    const findSiteIdByName = (siteName) => {
        const search = String(siteName ?? '').toLowerCase();
        if (!search) return undefined;
        return sites.find((site) => {
            const u = site.url;
            if (Array.isArray(u)) return u.some((url) => String(url).toLowerCase() === search);
            return String(u ?? '').toLowerCase() === search;
        })?.id;
    };

    const findAppIdByProcessName = (processName) => {
        const raw = typeof processName === 'string' ? processName : (processName?.processName ?? processName);
        const search = String(raw ?? '').toLowerCase();
        if (!search) return undefined;
        return apps.find((app) => {
            const p = app.processName;
            if (Array.isArray(p)) {
                return p.some((name) => String(name).toLowerCase() === search);
            }
            return String(p ?? '').toLowerCase() === search;
        })?.id;
    };

    const toggleApp = (id) => {
        setSelectedAppIds((prev) =>
          prev.includes(id)
            ? prev.filter((appId) => appId !== id)
            : [...prev, id]
        );
      };
      
    const toggleSite = (id) => {
        setSelectedSiteIds((prev) =>
        prev.includes(id)
        ? prev.filter((siteId) => siteId !== id)
        : [...prev, id]
        );
    };

    const handleCardClick = (section) => {
        setActiveSection(section);
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            setActiveSection(null);
        }
    };

    const renderAppsContent = () => (
        <div className="apps-sites-modal-layout">
            <div className="apps-sites-checklist">
                <h3>Choose Apps:</h3>
                {[...apps].sort((a, b) => a.name.localeCompare(b.name)).map((app) => (
                    <div key={app.id}>
                        <input
                            type="checkbox"
                            checked={selectedAppIds.includes(app.id)}
                            onChange={() => toggleApp(app.id)}
                        />
                        {app.name}
                    </div>
                ))}
            </div>
            <div className="apps-sites-save-section">
                <Button onClick={handleSaveApps}>Save for All Children</Button>
                {
                    selectedChildId &&(  
                        <Button key={selectedChildId} onClick={() => handleSaveAppsForChild(selectedChildId)}>
                        Save for {selectedChild.nickname || selectedChild.email || selectedChild.uid}
                    </Button>
                    )
                }
                
            </div>
        </div>
    );

    const handleSaveApps = () => {
        for (const child of children) {
            handleSaveAppsForChild(child.id);
        }
    };

    const handleSaveAppsForChild = async(childId) => {
        const selectedProcessNames = selectedAppIds
            .flatMap((id) => {
                const p = apps.find((app) => app.id === id)?.processName;
                if (Array.isArray(p)) return p.map((n) => String(n).toLowerCase());
                if (p != null && p !== '') return [String(p).toLowerCase()];
                return [];
            });
        try{
            await updateChildAppsApi(childId, selectedProcessNames, user.token);
        }catch(error){
            console.error('Failed to save apps for child:', error);
        }
        
    }
    const renderSitesContent = () => (
        <div className="apps-sites-modal-layout">
            <div className="apps-sites-checklist">
                <h3>Choose Sites:</h3>
                {[...sites].sort((a, b) => a.name.localeCompare(b.name)).map((site) => (
                    <div key={site.id}>
                        <input
                            type="checkbox"
                            checked={selectedSiteIds.includes(site.id)}
                            onChange={() => toggleSite(site.id)}
                        />
                        {site.name}
                    </div>
                ))}
            </div>
            <div className="apps-sites-save-section">
                <Button onClick={handleSaveSites}>Save for All Children</Button>
                {children.map((child) => (
                    <Button key={child.uid} onClick={() => handleSaveSitesForChild(child.id)}>
                        Save for {child.nickname || child.email || child.uid}
                    </Button>
                ))}
            </div>
        </div>
    );

    const handleSaveSites = () => {
        for (const child of children) {
            handleSaveSitesForChild(child.id);
        }
    };

    const handleSaveSitesForChild = async (childId) => {
        const selectedSiteNames = selectedSiteIds.flatMap((id) => {
            const u = sites.find((site) => site.id === id)?.url;
            return Array.isArray(u) ? u : (u != null && u !== '' ? [u] : []);
        });

        try {
            await updateChildSitesApi(childId, selectedSiteNames, user.token);
        } catch (error) {
            console.error('Failed to save sites for child:', error);
        }
    };

    const renderTimeControlContent = () => (
        <div className="time-control-content">
            <h3 className="time-control-title">Time Control</h3>
            
            {/* Daily Time Section */}
            <div className="control-section">
                <h5 className="section-title">Choose Daily Time</h5>
                <div className="days-selection">
                    {weekDays.map((day) => (
                        <Button
                            key={day}
                            variant={dailyTimeDays.includes(day) ? "primary" : "outline-primary"}
                            size="sm"
                            onClick={() => handleToggleDay(day)}
                            className="day-button"
                        >
                            {day.substring(0, 3)}
                        </Button>
                    ))}
                </div>
                <div className="days-selection-special">
                    <Button
                        variant={dailyTimeDays.length === 7 ? "primary" : "outline-secondary"}
                        size="sm"
                        onClick={handleSelectAll}
                        className="special-day-button"
                    >
                        All
                    </Button>
                    <Button
                        variant={weekdays.every(day => dailyTimeDays.includes(day)) ? "primary" : "outline-secondary"}
                        size="sm"
                        onClick={handleSelectWeekdays}
                        className="special-day-button"
                    >
                        Weekdays
                    </Button>
                    <Button
                        variant={weekend.every(day => dailyTimeDays.includes(day)) ? "primary" : "outline-secondary"}
                        size="sm"
                        onClick={handleSelectWeekend}
                        className="special-day-button"
                    >
                        Weekend
                    </Button>
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
                <Button onClick={handleSaveDailyTime} className="save-time-button">
                    {editingDailyTimeIndex !== null ? 'Update' : 'Save'}
                </Button>
                {editingDailyTimeIndex !== null && (
                    <Button 
                        variant="secondary" 
                        onClick={handleCancelEditDailyTime}
                        className="save-time-button cancel-edit-button"
                    >
                        Cancel
                    </Button>
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
                                    // Find all daily time entries that include this day
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

            {/* Schedule Time Section */}
            <div className="control-section">
                <h5 className="section-title">Schedule Block</h5>
                <div className="days-selection">
                    {weekDays.map((day) => (
                        <Button
                            key={day}
                            variant={scheduleTimeDays.includes(day) ? "primary" : "outline-primary"}
                            size="sm"
                            onClick={() => handleToggleScheduleTimeDay(day)}
                            className="day-button"
                        >
                            {day.substring(0, 3)}
                        </Button>
                    ))}
                </div>
                <div className="days-selection-special">
                    <Button
                        variant={scheduleTimeDays.length === 7 ? "primary" : "outline-secondary"}
                        size="sm"
                        onClick={handleSelectAllScheduleTime}
                        className="special-day-button"
                    >
                        All
                    </Button>
                    <Button
                        variant={weekdays.every(day => scheduleTimeDays.includes(day)) ? "primary" : "outline-secondary"}
                        size="sm"
                        onClick={handleSelectWeekdaysScheduleTime}
                        className="special-day-button"
                    >
                        Weekdays
                    </Button>
                    <Button
                        variant={weekend.every(day => scheduleTimeDays.includes(day)) ? "primary" : "outline-secondary"}
                        size="sm"
                        onClick={handleSelectWeekendScheduleTime}
                        className="special-day-button"
                    >
                        Weekend
                    </Button>
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
                <Button onClick={handleSaveScheduleTime} className="save-time-button">
                    {editingScheduleTimeIndex !== null ? 'Update' : 'Save'}
                </Button>
                {editingScheduleTimeIndex !== null && (
                    <Button 
                        variant="secondary" 
                        onClick={handleCancelEditScheduleTime}
                        className="save-time-button cancel-edit-button"
                    >
                        Cancel
                    </Button>
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
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleDeleteScheduleTime(index)}
                                        className="action-button"
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );


    const handleToggleDay = (day) => {
        setDailyTimeDays(prev => 
            prev.includes(day) 
                ? prev.filter(d => d !== day)
                : [...prev, day].sort((a, b) => weekDays.indexOf(a) - weekDays.indexOf(b))
        );
    };

    const handleSelectAll = () => {
        // Toggle: if all days are selected, deselect all; otherwise select all
        if (dailyTimeDays.length === 7) {
            setDailyTimeDays([]);
        } else {
            setDailyTimeDays([...weekDays]);
        }
    };

    const handleSelectWeekdays = () => {
        // Toggle: if all weekdays are selected, deselect them; otherwise select all weekdays
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
        // Toggle: if all weekend days are selected, deselect them; otherwise select all weekend days
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
        if(dailyTimeMinutes <= 0){
            alert('Please add more time to save.');
            return;
        }
        if (dailyTimeDays.length === 0) {
            alert('Please select at least one day');
            return;
        }

        const dailyTime = {
            time: dailyTimeMinutes,
            days: [...dailyTimeDays]
        };

        try{
            await updateDailyTimeApi(selectedChildId, dailyTimeMinutes, dailyTimeDays, user.token);
            // Clear the list and fetch fresh data from server
            await fetchDailyTime();
        }catch(error){
            console.error('Failed to save daily time:', error);
        }

        // Reset form
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
        
        const scheduleTime = {
            name: '',
            days: [...scheduleTimeDays],
            startTime: scheduleTimeStart,
            endTime: scheduleTimeEnd
        };

        try{
            await updateScheduleTimeApi(selectedChildId, scheduleTime, user.token);
        }catch(error){
            console.error('Failed to save schedule time:', error);
        }


        if (editingScheduleTimeIndex !== null) {
            // Update existing schedule time
            setScheduleTimes(prev => {
                const updated = [...prev];
                updated[editingScheduleTimeIndex] = scheduleTime;
                return updated;
            });
            setEditingScheduleTimeIndex(null);
        } else {
            // Add new schedule time
            setScheduleTimes(prev => [...prev, scheduleTime]);
        }

        // Reset form
        setScheduleTimeDays([]);
        setScheduleTimeName('');
        setScheduleTimeStart('22:00');
        setScheduleTimeEnd('06:00');
    };

    const handleEditScheduleTime = (index) => {
        const scheduleTime = scheduleTimes[index];
        setScheduleTimeDays([...scheduleTime.days]);
        setScheduleTimeName(scheduleTime.name || '');
        setScheduleTimeStart(scheduleTime.startTime);
        setScheduleTimeEnd(scheduleTime.endTime);
        setEditingScheduleTimeIndex(index);
    };

    const handleDeleteScheduleTime = (index) => {
        if (window.confirm('Are you sure you want to delete this schedule time?')) {
            setScheduleTimes(prev => prev.filter((_, i) => i !== index));
            try{
                deleteScheduleTimeApi(scheduleTimes[index].id, user.token);
            }catch(error){
                    console.log('Failed to delete schedule time:', error);
            }
                
            if (editingScheduleTimeIndex === index) {
                // Cancel edit if deleting the item being edited
                handleCancelEditScheduleTime();
            } else if (editingScheduleTimeIndex > index) {
                // Adjust editing index if deleting an item before the one being edited
                setEditingScheduleTimeIndex(prev => prev - 1);
            }
        }
    };

    const handleCancelEditScheduleTime = () => {
        setEditingScheduleTimeIndex(null);
        setScheduleTimeDays([]);
        setScheduleTimeName('');
        setScheduleTimeStart('22:00');
        setScheduleTimeEnd('06:00');
    };

return(
    <Container>
        <h5 className="control-screen-time-header">Parent Control</h5>
        
        <div className="mb-4">
            <Card 
                className="quick-action-card clickable-card"
                onClick={() => handleCardClick('timeControl')}
            >
                <Card.Body>
                    <h5 className="section-title">Time Control</h5>
                    <p className="card-explanation">
                        Set daily time limits and schedule time restrictions for your children.
                    </p>
                </Card.Body>
            </Card>
        </div>
        
        <div className="mb-4">
            <Card 
                className="quick-action-card clickable-card"
                onClick={() => handleCardClick('apps')}
            >
                <Card.Body>
                    <h5 className="section-title">Apps Control</h5>
                    <p className="card-explanation">
                        Select which applications should be blocked or allowed for your children.
                    </p>
                </Card.Body>
            </Card>
        </div>
        
        <div className="mb-4">
            <Card 
                className="quick-action-card clickable-card"
                onClick={() => handleCardClick('sites')}
            >
                <Card.Body>
                    <h5 className="section-title">Sites Control</h5>
                    <p className="card-explanation">
                        Manage which websites your children can access. Block or allow specific domains.
                    </p>
                </Card.Body>
            </Card>
        </div>

        {activeSection && (
            <div
                className="modal-overlay"
                onClick={handleBackdropClick}
            >
                <Card
                    className="modal-card"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Card.Body className="modal-card-body">
                        {activeSection === 'apps' && renderAppsContent()}
                        {activeSection === 'sites' && renderSitesContent()}
                        {activeSection === 'timeControl' && renderTimeControlContent()}
                    </Card.Body>
                </Card>
            </div>
        )}
    </Container>
)
}

export default ParentControl;