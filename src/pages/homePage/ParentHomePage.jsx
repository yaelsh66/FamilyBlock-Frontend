import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getKidsByFamily } from '../../api/firebaseTasks';
import '../ParentControl.css';
import ControlScreenTime from '../../components/ControlScreenTime';
import ParentControl from '../ParentControl';
import { useSearchParams } from 'react-router-dom';
import './ParentHomePage.css';

function ParentHomePage() {
  const { user } = useAuth();
  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [initialSection, setInitialSection] = useState(null);

  useEffect(() => {
    if (!user) return;
    const fetchChildren = async () => {
      try {
        const familyChildren = await getKidsByFamily(user.familyId, user.token);
        setChildren(familyChildren);
      } catch (e) {
        console.error('Failed to load children', e);
      }
    };
    fetchChildren();
  }, [user]);

  // Handle URL query parameter for section
  useEffect(() => {
    const section = searchParams.get('section');
    if (section === 'apps' || section === 'sites' || section === 'permanentSites') {
      setInitialSection(section);
      // Clear the query parameter after reading it
      setSearchParams({});
      // Reset initialSection after a brief delay to allow ParentControl to read it
      setTimeout(() => {
        setInitialSection(null);
      }, 100);
    }
  }, [searchParams, setSearchParams]);

  return (
    <div className="parent-home-container">
      <div className="parent-home-header">
        <h1 className="page-header parent-home-title">Parent Home Page</h1>
        <div className="parent-home-child-selector-wrapper">
          <div className="parent-home-child-selector-card">
            <div className="child-selector-container">
              <label htmlFor="child-select" className="child-selector-label">
                Choose Child:
              </label>
              <select
                id="child-select"
                className="child-selector"
                value={selectedChildId || ''}
                onChange={(e) => setSelectedChildId(e.target.value || null)}
              >
                <option value="">-- Select a child --</option>
                {children.map((child) => (
                  <option key={child.id} value={child.id}>
                    {child.nickname || child.email || child.id}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="parent-home-content">
        <div className="parent-home-sidebar">
          <ParentControl selectedChildId={selectedChildId} children={children} initialSection={initialSection} />
        </div>

        <div className="parent-home-main">
          <div className="parent-home-main-content">
            <ControlScreenTime selectedChildId={selectedChildId} childrenList={children} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ParentHomePage;
