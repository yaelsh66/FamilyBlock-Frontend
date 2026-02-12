import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getDevicesApi,
  deleteDeviceApi
} from '../api/deviceApi';
import NewDeviceModal from '../components/NewDeviceModal';
import DownloadModal from '../components/DownloadModal';
import './Device.css';

function Device() {
  const { childId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [devices, setDevices] = useState([]);
  const [saving, setSaving] = useState(false);
  const [showNewDeviceModal, setShowNewDeviceModal] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const fetchData = async () => {
    if (!user || !childId) {
      setError('Invalid access');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const devicesData = await getDevicesApi(childId, user.token);
      setDevices(devicesData);
    } catch (err) {
      console.error('Failed to load device data:', err);
      setError('Failed to load device information');
    } finally {
      setLoading(false);
    }
  };

  /** Refresh device list without showing full-page loading (e.g. after adding device in modal). */
  const refreshDevicesSilent = async () => {
    if (!user || !childId) return;
    try {
      const devicesData = await getDevicesApi(childId, user.token);
      setDevices(devicesData);
    } catch (err) {
      console.error('Failed to refresh devices:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [childId, user]);

  const handleOpenNewDeviceModal = () => {
    setShowNewDeviceModal(true);
  };

  const handleCloseNewDeviceModal = () => {
    setShowNewDeviceModal(false);
  };

  const handleDeleteDevice = async (deviceId) => {
    if (!window.confirm('Are you sure you want to delete this device?')) {
      return;
    }

    try {
      setSaving(true);
      await deleteDeviceApi(childId, deviceId, user.token);
      setError('');
      await fetchData();
    } catch (err) {
      console.error('Failed to delete device:', err);
      setError('Failed to delete device');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="device-loading">
        <div className="device-spinner" aria-hidden="true" />
        <span className="device-loading-text">Loading...</span>
      </div>
    );
  }

  return (
    <>
      <div className="device-container">
        <div className="device-card">
          <header className="device-header">
            <h2>📱 Device Control</h2>
            <div className="device-header-actions">
              <button
                type="button"
                className="device-btn device-btn-primary"
                onClick={handleOpenNewDeviceModal}
              >
                ➕ New Device
              </button>
              <button
                type="button"
                className="device-btn device-btn-secondary"
                onClick={() => setShowDownloadModal(true)}
              >
                📥 Download
              </button>
              <button
                type="button"
                className="device-btn device-btn-secondary"
                onClick={() => navigate('/profile')}
              >
                ← Back to Profile
              </button>
            </div>
          </header>

          <div className="device-body">
            {error && (
              <div className="device-alert" role="alert">
                <span>{error}</span>
                <button
                  type="button"
                  className="device-alert-dismiss"
                  onClick={() => setError('')}
                  aria-label="Dismiss"
                >
                  ×
                </button>
              </div>
            )}

            <section className="device-control-section">
              <h4>Child Devices</h4>
              <div className="device-list">
                {!Array.isArray(devices) || devices.length === 0 ? (
                  <p className="device-empty">No devices yet. Add one with &quot;➕ New Device&quot; above.</p>
                ) : (
                  devices.map((device) => (
                    <div key={device.id} className="device-item child-device-item">
                      <span className="device-item-icon">📱</span>
                      <span className="device-item-name">{device.name || 'Unnamed device'}</span>
                      {device.deviceId && (
                        <small className="device-item-id">({device.deviceId})</small>
                      )}
                      <button
                        type="button"
                        className="device-btn device-btn-danger device-btn-sm"
                        onClick={() => handleDeleteDevice(device.deviceId || device.id)}
                        disabled={saving}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      </div>

      <NewDeviceModal
        show={showNewDeviceModal}
        onHide={handleCloseNewDeviceModal}
        childId={childId}
        user={user}
        onSuccess={refreshDevicesSilent}
      />
      <DownloadModal
        show={showDownloadModal}
        onHide={() => setShowDownloadModal(false)}
        user={user}
      />
    </>
  );
}

export default Device;
