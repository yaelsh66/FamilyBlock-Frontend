import { useState, useEffect } from 'react';
import { Container, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  getDevicesApi,
  deleteDeviceApi
} from '../api/deviceApi';
import NewDeviceModal from '../components/NewDeviceModal';
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
      // Refresh the device list
      await fetchData();
    } catch (err) {
      console.error('Failed to delete device:', err);
      setError('Failed to delete device');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {loading ? (
        <Container className="mt-5 text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Container>
      ) : (
        <Container className="device-container mt-5">
          <Card className="device-card">
        <Card.Header className="device-header">
          <div className="d-flex justify-content-between align-items-center">
            <h2>📱 Device Control</h2>
            <div className="d-flex gap-2">
              <Button variant="success" onClick={handleOpenNewDeviceModal}>
                ➕ New Device
              </Button>
              <Button variant="secondary" onClick={() => navigate('/profile')}>
                ← Back to Profile
              </Button>
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <div className="device-control-section mb-4">
            <h4>Child Devices</h4>
            <div className="device-list">
              {!Array.isArray(devices) || devices.length === 0 ? (
                <p className="text-muted mb-0">No devices yet. Add one with &quot;➕ New Device&quot; above.</p>
              ) : (
                devices.map((device) => (
                  <div key={device.id} className="device-item child-device-item">
                    <span className="me-2">📱</span>
                    <span>{device.name || 'Unnamed device'}</span>
                    {device.deviceId && (
                      <small className="text-muted ms-2">({device.deviceId})</small>
                    )}
                    <Button
                      variant="danger"
                      size="sm"
                      className="ms-auto"
                      onClick={() => handleDeleteDevice(device.deviceId || device.id)}
                      disabled={saving}
                    >
                      🗑️ Delete
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>

          
        </Card.Body>
      </Card>
        </Container>
      )}

      <NewDeviceModal
        show={showNewDeviceModal}
        onHide={handleCloseNewDeviceModal}
        childId={childId}
        user={user}
        onSuccess={fetchData}
      />
    </>
  );
}

export default Device;
