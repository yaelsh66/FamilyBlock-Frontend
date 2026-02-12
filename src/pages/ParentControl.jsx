import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './ParentControl.css';
import { updateChildAppsApi, updateChildSitesApi, getChildAppsApi, getChildSitesApi } from '../api/deviceApi';
import TimeControl from '../components/TimeControl';
function ParentControl({ selectedChildId, children = [], initialSection = null }) {

    const sites = [
        { id: 1, name: "Roblox", url: "roblox.com" },
        { id: 2, name: "Online Games", url: ["coolmathgames.com", "friv.com", 
            "y8.com", "kizi.com", "agame.com", "miniclip.com", "playhop.com",
            "lagged.com", "mathplayground.com", "iogames.space", "iogames.fun", 
            "solitaired.com", "247solitaire.com", "worldofsolitaire.com", 
            "cardgames.io", "arkadium.com", "freegames.org", "addictinggames.com", 
            "crazygames.com", "poki.com", "yo-yoo.co.il"] },
        { id: 3, name: "YouTube", url: ["youtube.com", "youtubekids.com"] },
        { id: 4, name: "Netflix", url: "netflix.com" },
        { id: 5, name: "TikTok", url: "tiktok.com" },
        { id: 6, name: "Kan", url: ["kan.org.il", "kankids.org.il"] },
    ];
    
    const apps = [
        {
              id: 1,
              name: "Windows Games",
              processName: [
                "MicrosoftSolitaireCollection.exe",
                "MicrosoftMinesweeper.exe",
                "MicrosoftMahjong.exe",
                "MicrosoftSudoku.exe",
                "Jigsaw.exe",
                "GameBar.exe"
              ]
            },
          
            {
              id: 2,
              name: "Minecraft",
              processName: [
                "MinecraftLauncher.exe",
                "Minecraft.Windows.exe",
              ]
            },
          
            {
              id: 3,
              name: "Game Launchers",
              processName: [
                "steam.exe",
                "EpicGamesLauncher.exe",
                "Battle.net.exe",
                "RiotClientServices.exe",
                "XboxApp.exe",
                "GamingApp.exe"
              ]
            },
          
            {
              id: 4,
              name: "Social Media",
              processName: [
                "Discord.exe",
                "Telegram.exe",
                "WhatsApp.exe",
                "Instagram.exe",
                "Facebook.exe",
                "Messenger.exe",
                "Twitter.exe",
                "TikTok.exe"
              ]
            },
          
            {
              id: 5,
              name: "Communication",
              processName: [
                "slack.exe",
                "Zoom.exe"
              ]
            },
          
            {
              id: 6,
              name: "Video",
              processName: [
                "Netflix.exe",
                "YouTube.exe",
                "YouTube Music.exe"
              ]
            },
          
            {
              id: 7,
              name: "Music",
              processName: [
                "Spotify.exe"
              ]
            },
          
            {
              id: 8,
              name: "Roblox",
              processName: [
                "RobloxPlayerBeta.exe",
                "RobloxStudioBeta.exe",
              ]
            },
          
            {
              id: 9,
              name: "Custom",
              processName: [
                "mikmak2.exe"
              ]
            },
            {
                id: 10,
                name: "Browsers (Except Chrome)",
                processName: [
                  "firefox.exe",
                  "opera.exe",
                  "opera gx.exe",
                  "opera.exe",
                  "brave.exe",
                  "vivaldi.exe",
                  "tor.exe"
                ]
              }
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
    const [selectedAppIds, setSelectedAppIds] = useState([]);
    const [selectedSiteIds, setSelectedSiteIds] = useState([]);
    const [activeSection, setActiveSection] = useState(initialSection);
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

        fetchChildApps();
        fetchChildSites();
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
                    <label key={app.id} className="apps-sites-item">
                        <input
                            type="checkbox"
                            checked={selectedAppIds.includes(app.id)}
                            onChange={() => toggleApp(app.id)}
                        />
                        <span className="apps-sites-item-label">{app.name}</span>
                    </label>
                ))}
            </div>
            <div className="apps-sites-save-section">
                <button
                    type="button"
                    className="btn btn-primary apps-sites-save-button"
                    onClick={handleSaveApps}
                >
                    Save for All Children
                </button>
                {selectedChildId && selectedChild && (
                    <button
                        type="button"
                        className="btn btn-secondary apps-sites-save-button"
                        onClick={() => handleSaveAppsForChild(selectedChildId)}
                    >
                        Save for {selectedChild.nickname || selectedChild.email || selectedChild.uid}
                    </button>
                )}
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
                    <label key={site.id} className="apps-sites-item">
                        <input
                            type="checkbox"
                            checked={selectedSiteIds.includes(site.id)}
                            onChange={() => toggleSite(site.id)}
                        />
                        <span className="apps-sites-item-label">{site.name}</span>
                    </label>
                ))}
            </div>
            <div className="apps-sites-save-section">
                <button
                    type="button"
                    className="btn btn-primary apps-sites-save-button"
                    onClick={handleSaveSites}
                >
                    Save for All Children
                </button>
                {selectedChildId && selectedChild && (
                    <button
                        type="button"
                        className="btn btn-secondary apps-sites-save-button"
                        onClick={() => handleSaveSitesForChild(selectedChildId)}
                    >
                        Save for {selectedChild.nickname || selectedChild.email || selectedChild.uid}
                    </button>
                )}
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


return(
    <div className="parent-control-container">
        <h5 className="control-screen-time-header">Parent Control</h5>
        
        <div className="quick-actions-wrapper">
            <div className="quick-action-item">
                <div 
                    className="card quick-action-card clickable-card"
                    onClick={() => handleCardClick('timeControl')}
                >
                    <div className="card-body">
                        <h5 className="section-title">Time Control</h5>
                        <p className="card-explanation">
                            Set daily time limits and schedule time restrictions for your children.
                        </p>
                    </div>
                </div>
            </div>
            
            <div className="quick-action-item">
                <div 
                    className="card quick-action-card clickable-card"
                    onClick={() => handleCardClick('apps')}
                >
                    <div className="card-body">
                        <h5 className="section-title">Apps Control</h5>
                        <p className="card-explanation">
                            Select which applications should be blocked or allowed for your children.
                        </p>
                    </div>
                </div>
            </div>
            
            <div className="quick-action-item">
                <div 
                    className="card quick-action-card clickable-card"
                    onClick={() => handleCardClick('sites')}
                >
                    <div className="card-body">
                        <h5 className="section-title">Sites Control</h5>
                        <p className="card-explanation">
                            Manage which websites your children can access. Block or allow specific domains.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {activeSection && (
            <div
                className="modal-overlay"
                onClick={handleBackdropClick}
            >
                <div
                    className="modal-card"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="modal-card-body">
                        {activeSection === 'apps' && renderAppsContent()}
                        {activeSection === 'sites' && renderSitesContent()}
                        {activeSection === 'timeControl' && (
                            <TimeControl selectedChildId={selectedChildId} children={children} />
                        )}
                    </div>
                </div>
            </div>
        )}
    </div>
)
}

export default ParentControl;