import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import './ParentControl.css';
import '../components/ControlScreenTime.css';
import { updateChildAppsApi, updateChildSitesApi, getChildAppsApi, getChildSitesApi, getChildPermanentSitesApi, updateChildPermanentSitesApi } from '../api/deviceApi';
import TimeControl from '../components/TimeControl';
function ParentControl({ selectedChildId, children = [], initialSection = null }) {

    const sites = [
        { id: 1, name: "Roblox", url: "roblox.com" },
        { id: 2, name: "Online Games", url: ["coolmathgames.com", "friv.com", 
            "y8.com", "kizi.com", "agame.com", "miniclip.com", "playhop.com",
            "lagged.com", "mathplayground.com", "iogames.space", "iogames.fun", 
            "solitaired.com", "247solitaire.com", "worldofsolitaire.com", 
            "cardgames.io", "arkadium.com", "freegames.org", "addictinggames.com", 
            "crazygames.com", "poki.com", "yo-yoo.co.il",
             "www.yo-yoo.co.il/games/gameshttp/nahashim.htm", "id.blooket.com", 
             "dashboard.blooket.com", "www.msn.com", "www.msn.com/en-us/news/world", "kids.hidabroot.org", "kids.hidabroot.org/games"] },
        { id: 3, name: "YouTube", url: ["youtube.com", "youtubekids.com"] },
        { id: 4, name: "Netflix", url: "netflix.com" },
        { id: 5, name: "TikTok", url: "tiktok.com" },
        { id: 6, name: "Kan", url: ["kan.org.il", "kankids.org.il"] },
        { id: 7, name: "Facebook", url: "facebook.com" },
        { id: 8, name: "Instagram", url: "instagram.com" },
        { id: 9, name: "Twitter", url: "twitter.com" },
        { id: 10, name: "LinkedIn", url: "linkedin.com" },
        { id: 11, name: "Reddit", url: "reddit.com" },
        { id: 12, name: "Pinterest", url: "pinterest.com" },
        { id: 13, name: "Snapchat", url: "snapchat.com" },
        { id: 14, name: "Tumblr", url: "tumblr.com" },
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
                "mikmak2.exe",
                "devenv.exe"
              ]
            },
            {
                id: 10,
                name: "Browsers (Site Block applies to Chrome and Edge)",
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
    const [selectedPermanentSiteIds, setSelectedPermanentSiteIds] = useState([]);
    const [selectedAppPartial, setSelectedAppPartial] = useState({});
    const [selectedSitePartial, setSelectedSitePartial] = useState({});
    const [selectedPermanentSitePartial, setSelectedPermanentSitePartial] = useState({});
    const [expandedAppIds, setExpandedAppIds] = useState([]);
    const [expandedSiteIds, setExpandedSiteIds] = useState([]);
    const [expandedPermanentSiteIds, setExpandedPermanentSiteIds] = useState([]);
    const appCategoryCheckboxRefs = useRef({});
    const siteCategoryCheckboxRefs = useRef({});
    const permanentSiteCategoryCheckboxRefs = useRef({});
    const [activeSection, setActiveSection] = useState(initialSection);
    const [selectedChild, setSelectedChild] = useState(null);

    const getAppProcessNames = (app) => {
        const p = app.processName;
        return Array.isArray(p) ? p.map((n) => String(n).toLowerCase()) : (p != null && p !== '' ? [String(p).toLowerCase()] : []);
    };
    const getSiteUrls = (site) => {
        const u = site.url;
        return Array.isArray(u) ? u.map((url) => String(url).toLowerCase()) : (u != null && u !== '' ? [String(u).toLowerCase()] : []);
    };
    
    
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
            try {
                const appsRes = await getChildAppsApi(selectedChildId, user.token);
                setSelectedAppIds([]);
                setSelectedAppPartial({});
                if (!appsRes) return;
                const rawList = appsRes.appList;
                const appsArray = Array.isArray(rawList) ? rawList : (typeof rawList === 'string' ? JSON.parse(rawList) : []);
                const allowedSet = new Set(
                    appsArray.map((item) => String((typeof item === 'string' ? item : item?.processName ?? item) ?? '').toLowerCase()).filter(Boolean)
                );
                const fullIds = [];
                const partial = {};
                apps.forEach((app) => {
                    const names = getAppProcessNames(app);
                    const inList = names.filter((n) => allowedSet.has(n));
                    if (inList.length === 0) return;
                    if (inList.length === names.length) fullIds.push(app.id);
                    else partial[app.id] = inList;
                });
                setSelectedAppIds(fullIds);
                setSelectedAppPartial(partial);
            } catch (error) {
                console.error('Failed to get apps for child:', error);
            }
        };
        const fetchChildSites = async () => {
            try {
                const sitesRes = await getChildSitesApi(selectedChildId, user.token);
                setSelectedSiteIds([]);
                setSelectedSitePartial({});
                if (!sitesRes) return;
                const rawList = sitesRes.siteList;
                const sitesArray = Array.isArray(rawList) ? rawList : (typeof rawList === 'string' ? JSON.parse(rawList || '[]') : []);
                const allowedSet = new Set(
                    sitesArray.map((item) => String((typeof item === 'string' ? item : item?.url ?? item) ?? '').toLowerCase()).filter(Boolean)
                );
                const fullIds = [];
                const partial = {};
                sites.forEach((site) => {
                    const urls = getSiteUrls(site);
                    const inList = urls.filter((u) => allowedSet.has(u));
                    if (inList.length === 0) return;
                    if (inList.length === urls.length) fullIds.push(site.id);
                    else partial[site.id] = inList;
                });
                setSelectedSiteIds(fullIds);
                setSelectedSitePartial(partial);
            } catch (error) {
                console.error('Failed to get sites for child:', error);
            }
        };
        const fetchChildPermanentSites = async () => {
            try {
                const res = await getChildPermanentSitesApi(selectedChildId, user.token);
                setSelectedPermanentSiteIds([]);
                setSelectedPermanentSitePartial({});
                if (!res) return;
                const rawList = res.siteList;
                const sitesArray = Array.isArray(rawList) ? rawList : (typeof rawList === 'string' ? JSON.parse(rawList || '[]') : []);
                const allowedSet = new Set(
                    sitesArray.map((item) => String((typeof item === 'string' ? item : item?.url ?? item) ?? '').toLowerCase()).filter(Boolean)
                );
                const fullIds = [];
                const partial = {};
                sites.forEach((site) => {
                    const urls = getSiteUrls(site);
                    const inList = urls.filter((u) => allowedSet.has(u));
                    if (inList.length === 0) return;
                    if (inList.length === urls.length) fullIds.push(site.id);
                    else partial[site.id] = inList;
                });
                setSelectedPermanentSiteIds(fullIds);
                setSelectedPermanentSitePartial(partial);
            } catch (error) {
                console.error('Failed to get permanent sites for child:', error);
            }
        };

        fetchChildApps();
        fetchChildSites();
        fetchChildPermanentSites();
    }, [selectedChildId, user]);

    // Handle initialSection prop changes
    useEffect(() => {
        if (initialSection && (initialSection === 'apps' || initialSection === 'sites' || initialSection === 'permanentSites')) {
            setActiveSection(initialSection);
        }
    }, [initialSection]);

    useEffect(() => {
        Object.keys(appCategoryCheckboxRefs.current).forEach((id) => {
            const el = appCategoryCheckboxRefs.current[id];
            if (el) el.indeterminate = isAppCategoryIndeterminate(Number(id));
        });
    }, [selectedAppIds, selectedAppPartial]);

    useEffect(() => {
        Object.keys(siteCategoryCheckboxRefs.current).forEach((id) => {
            const el = siteCategoryCheckboxRefs.current[id];
            if (el) el.indeterminate = isSiteCategoryIndeterminate(Number(id));
        });
    }, [selectedSiteIds, selectedSitePartial]);

    useEffect(() => {
        Object.keys(permanentSiteCategoryCheckboxRefs.current).forEach((id) => {
            const el = permanentSiteCategoryCheckboxRefs.current[id];
            if (el) el.indeterminate = isPermanentSiteCategoryIndeterminate(Number(id));
        });
    }, [selectedPermanentSiteIds, selectedPermanentSitePartial]);

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

    const isAppCategoryFull = (id) => selectedAppIds.includes(id);
    const getAppCategoryPartial = (id) => selectedAppPartial[id] || [];
    const isAppCategoryIndeterminate = (id) => {
        if (selectedAppIds.includes(id)) return false;
        const partial = selectedAppPartial[id];
        return partial && partial.length > 0;
    };
    const toggleAppCategory = (id) => {
        const app = apps.find((a) => a.id === id);
        if (!app) return;
        const names = getAppProcessNames(app);
        if (selectedAppIds.includes(id)) {
            setSelectedAppIds((prev) => prev.filter((appId) => appId !== id));
            setSelectedAppPartial((prev) => ({ ...prev, [id]: [] }));
        } else {
            setSelectedAppIds((prev) => [...prev, id]);
            setSelectedAppPartial((prev) => {
                const next = { ...prev };
                delete next[id];
                return next;
            });
        }
    };
    const toggleAppItem = (categoryId, processName) => {
        const key = String(processName).toLowerCase();
        const app = apps.find((a) => a.id === categoryId);
        if (!app) return;
        const allNames = getAppProcessNames(app);
        setSelectedAppIds((prev) => prev.filter((id) => id !== categoryId));
        setSelectedAppPartial((prev) => {
            const current = prev[categoryId] || [];
            const has = current.includes(key);
            const next = has ? current.filter((n) => n !== key) : [...current, key];
            if (next.length === 0) {
                const { [categoryId]: _, ...rest } = prev;
                return rest;
            }
            if (next.length === allNames.length) {
                setSelectedAppIds((p) => [...p, categoryId]);
                const { [categoryId]: __, ...rest } = { ...prev };
                return rest;
            }
            return { ...prev, [categoryId]: next };
        });
    };
    const isAppItemSelected = (categoryId, processName) => {
        if (selectedAppIds.includes(categoryId)) return true;
        const partial = selectedAppPartial[categoryId] || [];
        return partial.includes(String(processName).toLowerCase());
    };
    const toggleExpandApp = (id) => {
        setExpandedAppIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    };

    const isSiteCategoryFull = (id) => selectedSiteIds.includes(id);
    const getSiteCategoryPartial = (id) => selectedSitePartial[id] || [];
    const isSiteCategoryIndeterminate = (id) => {
        if (selectedSiteIds.includes(id)) return false;
        const partial = selectedSitePartial[id];
        return partial && partial.length > 0;
    };
    const toggleSiteCategory = (id) => {
        const site = sites.find((s) => s.id === id);
        if (!site) return;
        if (selectedSiteIds.includes(id)) {
            setSelectedSiteIds((prev) => prev.filter((siteId) => siteId !== id));
            setSelectedSitePartial((prev) => ({ ...prev, [id]: [] }));
        } else {
            setSelectedSiteIds((prev) => [...prev, id]);
            setSelectedSitePartial((prev) => {
                const next = { ...prev };
                delete next[id];
                return next;
            });
        }
    };
    const toggleSiteItem = (categoryId, url) => {
        const key = String(url).toLowerCase();
        const site = sites.find((s) => s.id === categoryId);
        if (!site) return;
        const allUrls = getSiteUrls(site);
        setSelectedSiteIds((prev) => prev.filter((id) => id !== categoryId));
        setSelectedSitePartial((prev) => {
            const current = prev[categoryId] || [];
            const has = current.includes(key);
            const next = has ? current.filter((u) => u !== key) : [...current, key];
            if (next.length === 0) {
                const { [categoryId]: _, ...rest } = prev;
                return rest;
            }
            if (next.length === allUrls.length) {
                setSelectedSiteIds((p) => [...p, categoryId]);
                const { [categoryId]: __, ...rest } = { ...prev };
                return rest;
            }
            return { ...prev, [categoryId]: next };
        });
    };
    const isSiteItemSelected = (categoryId, url) => {
        if (selectedSiteIds.includes(categoryId)) return true;
        const partial = selectedSitePartial[categoryId] || [];
        return partial.includes(String(url).toLowerCase());
    };
    const toggleExpandSite = (id) => {
        setExpandedSiteIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    };

    const isPermanentSiteCategoryFull = (id) => selectedPermanentSiteIds.includes(id);
    const getPermanentSiteCategoryPartial = (id) => selectedPermanentSitePartial[id] || [];
    const isPermanentSiteCategoryIndeterminate = (id) => {
        if (selectedPermanentSiteIds.includes(id)) return false;
        const partial = selectedPermanentSitePartial[id];
        return partial && partial.length > 0;
    };
    const togglePermanentSiteCategory = (id) => {
        const site = sites.find((s) => s.id === id);
        if (!site) return;
        if (selectedPermanentSiteIds.includes(id)) {
            setSelectedPermanentSiteIds((prev) => prev.filter((siteId) => siteId !== id));
            setSelectedPermanentSitePartial((prev) => ({ ...prev, [id]: [] }));
        } else {
            setSelectedPermanentSiteIds((prev) => [...prev, id]);
            setSelectedPermanentSitePartial((prev) => {
                const next = { ...prev };
                delete next[id];
                return next;
            });
        }
    };
    const togglePermanentSiteItem = (categoryId, url) => {
        const key = String(url).toLowerCase();
        const site = sites.find((s) => s.id === categoryId);
        if (!site) return;
        const allUrls = getSiteUrls(site);
        setSelectedPermanentSiteIds((prev) => prev.filter((id) => id !== categoryId));
        setSelectedPermanentSitePartial((prev) => {
            const current = prev[categoryId] || [];
            const has = current.includes(key);
            const next = has ? current.filter((u) => u !== key) : [...current, key];
            if (next.length === 0) {
                const { [categoryId]: _, ...rest } = prev;
                return rest;
            }
            if (next.length === allUrls.length) {
                setSelectedPermanentSiteIds((p) => [...p, categoryId]);
                const { [categoryId]: __, ...rest } = { ...prev };
                return rest;
            }
            return { ...prev, [categoryId]: next };
        });
    };
    const isPermanentSiteItemSelected = (categoryId, url) => {
        if (selectedPermanentSiteIds.includes(categoryId)) return true;
        const partial = selectedPermanentSitePartial[categoryId] || [];
        return partial.includes(String(url).toLowerCase());
    };
    const toggleExpandPermanentSite = (id) => {
        setExpandedPermanentSiteIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
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
                <p className="apps-sites-hint">Select a whole category or expand to choose specific items.</p>
                {[...apps].sort((a, b) => a.name.localeCompare(b.name)).map((app) => {
                    const processNames = getAppProcessNames(app);
                    const isExpandable = processNames.length > 1;
                    const expanded = expandedAppIds.includes(app.id);
                    const full = isAppCategoryFull(app.id);
                    const indeterminate = isAppCategoryIndeterminate(app.id);
                    return (
                        <div key={app.id} className="apps-sites-category">
                            <div className="apps-sites-category-row">
                                {isExpandable && (
                                    <button
                                        type="button"
                                        className="apps-sites-expand-btn"
                                        onClick={() => toggleExpandApp(app.id)}
                                        aria-expanded={expanded}
                                        aria-label={expanded ? 'Collapse' : 'Expand'}
                                    >
                                        <span className={`apps-sites-chevron ${expanded ? 'expanded' : ''}`}>▸</span>
                                    </button>
                                )}
                                {!isExpandable && <span className="apps-sites-expand-placeholder" />}
                                <label className="apps-sites-item apps-sites-category-label">
                                    <input
                                        type="checkbox"
                                        checked={full}
                                        ref={(el) => {
                                            if (el) appCategoryCheckboxRefs.current[app.id] = el;
                                            else delete appCategoryCheckboxRefs.current[app.id];
                                        }}
                                        onChange={() => toggleAppCategory(app.id)}
                                    />
                                    <span className="apps-sites-item-label">{app.name}</span>
                                    {isExpandable && (
                                        <span className="apps-sites-category-count">
                                            ({full ? processNames.length : (getAppCategoryPartial(app.id).length || 0)}/{processNames.length})
                                        </span>
                                    )}
                                </label>
                            </div>
                            {isExpandable && expanded && (
                                <div className="apps-sites-inner-list">
                                    {processNames.map((proc) => (
                                        <label key={proc} className="apps-sites-item apps-sites-inner-item">
                                            <input
                                                type="checkbox"
                                                checked={isAppItemSelected(app.id, proc)}
                                                onChange={() => toggleAppItem(app.id, proc)}
                                            />
                                            <span className="apps-sites-item-label">{proc.replace(/\.exe$/i, '')}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
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
                        onClick={async () => {
                            try {
                                await handleSaveAppsForChild(selectedChildId);
                                alert('✅ Apps saved successfully!');
                                setActiveSection(null);
                            } catch (error) {
                                alert('❌ Failed to save apps. Please try again.');
                            }
                        }}
                    >
                        Save for {selectedChild.nickname || selectedChild.email || selectedChild.uid}
                    </button>
                )}
            </div>
        </div>
    );

    const handleSaveApps = async () => {
        try {
            if (children.length === 0) {
                alert('No children available to save settings for.');
                return;
            }
            for (const child of children) {
                await handleSaveAppsForChild(child.id);
            }
            alert('✅ Apps saved successfully!');
            setActiveSection(null);
        } catch (error) {
            alert('❌ Failed to save apps. Please try again.');
        }
    };

    const handleSaveAppsForChild = async (childId) => {
        const fromFull = selectedAppIds.flatMap((id) => getAppProcessNames(apps.find((a) => a.id === id) || {}));
        const fromPartial = Object.values(selectedAppPartial).flat();
        const selectedProcessNames = [...new Set([...fromFull, ...fromPartial])];
        await updateChildAppsApi(childId, selectedProcessNames, user.token);
    };
    const renderSitesContent = () => (
        <div className="apps-sites-modal-layout">
            <div className="apps-sites-checklist">
                <h3>Choose Sites:</h3>
                <p className="apps-sites-hint">Select a whole category or expand to choose specific sites.</p>
                {[...sites].sort((a, b) => a.name.localeCompare(b.name)).map((site) => {
                    const urls = getSiteUrls(site);
                    const isExpandable = urls.length > 1;
                    const expanded = expandedSiteIds.includes(site.id);
                    const full = isSiteCategoryFull(site.id);
                    const indeterminate = isSiteCategoryIndeterminate(site.id);
                    return (
                        <div key={site.id} className="apps-sites-category">
                            <div className="apps-sites-category-row">
                                {isExpandable && (
                                    <button
                                        type="button"
                                        className="apps-sites-expand-btn"
                                        onClick={() => toggleExpandSite(site.id)}
                                        aria-expanded={expanded}
                                        aria-label={expanded ? 'Collapse' : 'Expand'}
                                    >
                                        <span className={`apps-sites-chevron ${expanded ? 'expanded' : ''}`}>▸</span>
                                    </button>
                                )}
                                {!isExpandable && <span className="apps-sites-expand-placeholder" />}
                                <label className="apps-sites-item apps-sites-category-label">
                                    <input
                                        type="checkbox"
                                        checked={full}
                                        ref={(el) => {
                                            if (el) siteCategoryCheckboxRefs.current[site.id] = el;
                                            else delete siteCategoryCheckboxRefs.current[site.id];
                                        }}
                                        onChange={() => toggleSiteCategory(site.id)}
                                    />
                                    <span className="apps-sites-item-label">{site.name}</span>
                                    {isExpandable && (
                                        <span className="apps-sites-category-count">
                                            ({full ? urls.length : (getSiteCategoryPartial(site.id).length || 0)}/{urls.length})
                                        </span>
                                    )}
                                </label>
                            </div>
                            {isExpandable && expanded && (
                                <div className="apps-sites-inner-list">
                                    {urls.map((url) => (
                                        <label key={url} className="apps-sites-item apps-sites-inner-item">
                                            <input
                                                type="checkbox"
                                                checked={isSiteItemSelected(site.id, url)}
                                                onChange={() => toggleSiteItem(site.id, url)}
                                            />
                                            <span className="apps-sites-item-label">{url.replace(/^www\./, '')}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
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
                        onClick={async () => {
                            try {
                                await handleSaveSitesForChild(selectedChildId);
                                alert('✅ Sites saved successfully!');
                                setActiveSection(null);
                            } catch (error) {
                                alert('❌ Failed to save sites. Please try again.');
                            }
                        }}
                    >
                        Save for {selectedChild.nickname || selectedChild.email || selectedChild.uid}
                    </button>
                )}
            </div>
        </div>
    );

    const handleSaveSites = async () => {
        try {
            if (children.length === 0) {
                alert('No children available to save settings for.');
                return;
            }
            for (const child of children) {
                await handleSaveSitesForChild(child.id);
            }
            alert('✅ Sites saved successfully!');
            setActiveSection(null);
        } catch (error) {
            alert('❌ Failed to save sites. Please try again.');
        }
    };

    const handleSaveSitesForChild = async (childId) => {
        const fromFull = selectedSiteIds.flatMap((id) => getSiteUrls(sites.find((s) => s.id === id) || {}));
        const fromPartial = Object.values(selectedSitePartial).flat();
        const selectedSiteNames = [...new Set([...fromFull, ...fromPartial])];
        await updateChildSitesApi(childId, selectedSiteNames, user.token);
    };

    const renderPermanentSitesContent = () => (
        <div className="apps-sites-modal-layout">
            <div className="apps-sites-checklist">
                <h3>Choose Permanent Sites:</h3>
                <p className="apps-sites-hint">Select sites to always block (permanent). Same categories as Sites Control.</p>
                {[...sites].sort((a, b) => a.name.localeCompare(b.name)).map((site) => {
                    const urls = getSiteUrls(site);
                    const isExpandable = urls.length > 1;
                    const expanded = expandedPermanentSiteIds.includes(site.id);
                    const full = isPermanentSiteCategoryFull(site.id);
                    const indeterminate = isPermanentSiteCategoryIndeterminate(site.id);
                    return (
                        <div key={site.id} className="apps-sites-category">
                            <div className="apps-sites-category-row">
                                {isExpandable && (
                                    <button
                                        type="button"
                                        className="apps-sites-expand-btn"
                                        onClick={() => toggleExpandPermanentSite(site.id)}
                                        aria-expanded={expanded}
                                        aria-label={expanded ? 'Collapse' : 'Expand'}
                                    >
                                        <span className={`apps-sites-chevron ${expanded ? 'expanded' : ''}`}>▸</span>
                                    </button>
                                )}
                                {!isExpandable && <span className="apps-sites-expand-placeholder" />}
                                <label className="apps-sites-item apps-sites-category-label">
                                    <input
                                        type="checkbox"
                                        checked={full}
                                        ref={(el) => {
                                            if (el) permanentSiteCategoryCheckboxRefs.current[site.id] = el;
                                            else delete permanentSiteCategoryCheckboxRefs.current[site.id];
                                        }}
                                        onChange={() => togglePermanentSiteCategory(site.id)}
                                    />
                                    <span className="apps-sites-item-label">{site.name}</span>
                                    {isExpandable && (
                                        <span className="apps-sites-category-count">
                                            ({full ? urls.length : (getPermanentSiteCategoryPartial(site.id).length || 0)}/{urls.length})
                                        </span>
                                    )}
                                </label>
                            </div>
                            {isExpandable && expanded && (
                                <div className="apps-sites-inner-list">
                                    {urls.map((url) => (
                                        <label key={url} className="apps-sites-item apps-sites-inner-item">
                                            <input
                                                type="checkbox"
                                                checked={isPermanentSiteItemSelected(site.id, url)}
                                                onChange={() => togglePermanentSiteItem(site.id, url)}
                                            />
                                            <span className="apps-sites-item-label">{url.replace(/^www\./, '')}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            <div className="apps-sites-save-section">
                <button
                    type="button"
                    className="btn btn-primary apps-sites-save-button"
                    onClick={handleSavePermanentSites}
                >
                    Save for All Children
                </button>
                {selectedChildId && selectedChild && (
                    <button
                        type="button"
                        className="btn btn-secondary apps-sites-save-button"
                        onClick={async () => {
                            try {
                                await handleSavePermanentSitesForChild(selectedChildId);
                                alert('✅ Permanent sites saved successfully!');
                                setActiveSection(null);
                            } catch (error) {
                                alert('❌ Failed to save permanent sites. Please try again.');
                            }
                        }}
                    >
                        Save for {selectedChild.nickname || selectedChild.email || selectedChild.uid}
                    </button>
                )}
            </div>
        </div>
    );

    const handleSavePermanentSites = async () => {
        try {
            if (children.length === 0) {
                alert('No children available to save settings for.');
                return;
            }
            for (const child of children) {
                await handleSavePermanentSitesForChild(child.id);
            }
            alert('✅ Permanent sites saved successfully!');
            setActiveSection(null);
        } catch (error) {
            alert('❌ Failed to save permanent sites. Please try again.');
        }
    };

    const handleSavePermanentSitesForChild = async (childId) => {
        const fromFull = selectedPermanentSiteIds.flatMap((id) => getSiteUrls(sites.find((s) => s.id === id) || {}));
        const fromPartial = Object.values(selectedPermanentSitePartial).flat();
        const selectedSiteNames = [...new Set([...fromFull, ...fromPartial])];
        await updateChildPermanentSitesApi(childId, selectedSiteNames, user.token);
    };


return(
    <div className="parent-control-container">
        <h5 className="control-screen-time-header">Parent Control</h5>
        
        <div className="quick-actions-wrapper">
            <div className="quick-action-item">
                <div 
                    className="control-card clickable-card"
                    onClick={() => handleCardClick('timeControl')}
                >
                    <div className="control-card-body">
                        <h5 className="section-title">Time Control</h5>
                        <p className="card-explanation">
                            Set daily time limits and schedule time restrictions for your children.
                        </p>
                    </div>
                </div>
            </div>
            
            <div className="quick-action-item">
                <div 
                    className="control-card clickable-card"
                    onClick={() => handleCardClick('apps')}
                >
                    <div className="control-card-body">
                        <h5 className="section-title">Apps Control</h5>
                        <p className="card-explanation">
                            Select which applications should be blocked or allowed for your children.
                        </p>
                    </div>
                </div>
            </div>
            
            <div className="quick-action-item">
                <div 
                    className="control-card clickable-card"
                    onClick={() => handleCardClick('sites')}
                >
                    <div className="control-card-body">
                        <h5 className="section-title">Sites Control</h5>
                        <p className="card-explanation">
                            Manage which websites your children can access. Block or allow specific domains.
                        </p>
                    </div>
                </div>
            </div>

            <div className="quick-action-item">
                <div 
                    className="control-card clickable-card"
                    onClick={() => handleCardClick('permanentSites')}
                >
                    <div className="control-card-body">
                        <h5 className="section-title">Permanent Sites</h5>
                        <p className="card-explanation">
                            Sites that are always blocked for your children, regardless of time or schedule.
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
                    <button
                        type="button"
                        className="modal-close-btn"
                        onClick={() => setActiveSection(null)}
                        aria-label="Close"
                    >
                        ×
                    </button>
                    <div className="modal-card-body">
                        {activeSection === 'apps' && renderAppsContent()}
                        {activeSection === 'sites' && renderSitesContent()}
                        {activeSection === 'permanentSites' && renderPermanentSitesContent()}
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