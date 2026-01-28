import { useState } from 'react';
import { Modal, Form, FloatingLabel, Button, Alert } from 'react-bootstrap';
import { addNewDeviceApi, downloadAgentApi, downloadAgentUIApi } from '../api/deviceApi';

function NewDeviceModal({ show, onHide, childId, user, onSuccess }) {
  const [name, setName] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [devicePassword, setDevicePassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [step1Complete, setStep1Complete] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadingUI, setDownloadingUI] = useState(false);

  const handleClose = () => {
    setName('');
    setDeviceId('');
    setDevicePassword('');
    setError('');
    setStep1Complete(false);
    setDownloading(false);
    setDownloadingUI(false);
    onHide();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await addNewDeviceApi(childId, name, deviceId, devicePassword, user.token);
      setStep1Complete(true);
      setSubmitting(false);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Failed to add device:', err);
      setError('Failed to add device. Please try again.');
      setSubmitting(false);
    }
  };

  const handleDownload = async (e) => {
    e?.preventDefault();
    setDownloading(true);
    setError('');
    try {
      await downloadAgentApi(user.token);
      setDownloading(false);
    } catch (err) {
      console.error('Failed to download agent:', err);
      setError('Failed to download agent. Please try again.');
      setDownloading(false);
    }
  };

  const handleDownloadUI = async (e) => {
    e?.preventDefault();
    setDownloadingUI(true);
    setError('');
    try {
      await downloadAgentUIApi(user.token);
      setDownloadingUI(false);
    } catch (err) {
      console.error('Failed to download agent (UI):', err);
      setError('Failed to download agent (UI). Please try again.');
      setDownloadingUI(false);
    }
  };

  const step2Enabled = step1Complete;

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>➕ Add New Device</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {/* Step 1: Add Device — always visible, enabled */}
          <div className="mb-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <span
                className={`rounded-circle d-inline-flex align-items-center justify-content-center ${step1Complete ? 'bg-success text-white' : 'bg-primary text-white'}`}
                style={{ width: 28, height: 28, fontSize: '0.9rem', fontWeight: 600 }}
              >
                {step1Complete ? '✓' : '1'}
              </span>
              <h6 className="mb-0">Step 1: Add Device</h6>
            </div>
            <FloatingLabel controlId="name" label="Name" className="mb-3">
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={step1Complete}
              />
            </FloatingLabel>
            <FloatingLabel controlId="deviceId" label="Device ID" className="mb-3">
              <Form.Control
                type="text"
                placeholder="Enter device ID"
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
                required
                disabled={step1Complete}
              />
            </FloatingLabel>
            <FloatingLabel controlId="devicePassword" label="Device Password" className="mb-0">
              <Form.Control
                type="password"
                placeholder="Enter device password"
                value={devicePassword}
                onChange={(e) => setDevicePassword(e.target.value)}
                required
                disabled={step1Complete}
              />
            </FloatingLabel>
          </div>

          {!step1Complete && (
            <div className="d-flex gap-2 mb-4">
              <Button
                type="button"
                variant="secondary"
                onClick={handleClose}
                disabled={submitting || downloading || downloadingUI}
                className="flex-fill"
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={submitting} className="flex-fill">
                {submitting ? 'Adding...' : 'Add Device'}
              </Button>
            </div>
          )}

          {/* Step 2: Download & Install — enabled only after Step 1 */}
          <div className={step2Enabled ? '' : 'opacity-50'}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <span
                className={`rounded-circle d-inline-flex align-items-center justify-content-center ${step2Enabled ? 'bg-primary text-white' : 'bg-secondary text-white'}`}
                style={{ width: 28, height: 28, fontSize: '0.9rem', fontWeight: 600 }}
              >
                2
              </span>
              <h6 className="mb-0">Step 2: Download & Install</h6>
            </div>
            {step2Enabled ? (
              <>
                <div className="d-flex gap-2 mb-3">
                  <Button
                    type="button"
                    variant="outline-primary"
                    onClick={handleDownload}
                    disabled={downloading || downloadingUI}
                    className="flex-fill"
                  >
                    {downloading ? 'Downloading...' : '📥 Download Agent'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline-secondary"
                    onClick={handleDownloadUI}
                    disabled={downloading || downloadingUI}
                    className="flex-fill"
                  >
                    {downloadingUI ? 'Downloading...' : '📥 Download Agent (UI)'}
                  </Button>
                </div>
                <small className="text-muted d-block mb-2 fw-semibold">Install instructions:</small>
                <ol className="ps-3 mb-0 small text-muted">
                  <li>Run the downloaded installer on the device.</li>
                  <li>When prompted, enter the Device ID: <strong className="text-dark">{deviceId}</strong></li>
                  <li>Complete the setup and ensure the device is connected.</li>
                </ol>
              </>
            ) : (
              <p className="small text-muted mb-0">Complete Step 1 to unlock download and install instructions.</p>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          {step1Complete ? (
            <Button variant="primary" onClick={handleClose} disabled={downloading || downloadingUI}>
              Done
            </Button>
          ) : null}
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default NewDeviceModal;
