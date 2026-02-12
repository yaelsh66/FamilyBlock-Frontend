import { useState } from 'react';
import { addNewDeviceApi, downloadAgentApi, downloadAgentUIApi, downloadAgentInstallerApi } from '../api/deviceApi';
import './NewDeviceModal.css';

function NewDeviceModal({ show, onHide, childId, user, onSuccess }) {
  const [name, setName] = useState('');
  const [deviceId, setDeviceId] = useState('');
  const [devicePassword, setDevicePassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [step1Complete, setStep1Complete] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadingUI, setDownloadingUI] = useState(false);
  const [downloadingInstaller, setDownloadingInstaller] = useState(false);

  const handleClose = () => {
    setName('');
    setDeviceId('');
    setDevicePassword('');
    setError('');
    setStep1Complete(false);
    setDownloading(false);
    setDownloadingUI(false);
    setDownloadingInstaller(false);
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

  const handleDownloadInstaller = async (e) => {
    e?.preventDefault();
    setDownloadingInstaller(true);
    setError('');
    try {
      await downloadAgentInstallerApi(user.token);
      setDownloadingInstaller(false);
    } catch (err) {
      console.error('Failed to download agent installer:', err);
      setError('Failed to download agent installer. Please try again.');
      setDownloadingInstaller(false);
    }
  };

  const step2Enabled = step1Complete;
  const anyDownloading = downloading || downloadingUI || downloadingInstaller;

  if (!show) {
    return null;
  }

  return (
    <div className="ndm-backdrop" onClick={handleClose}>
      <div
        className="ndm-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-device-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="ndm-header">
          <h2 id="new-device-title" className="ndm-title">
            ➕ Add New Device
          </h2>
          <button
            type="button"
            className="ndm-close-btn"
            onClick={handleClose}
            aria-label="Close"
          >
            ×
          </button>
        </header>

        <form onSubmit={handleSubmit} className="ndm-form">
          {error && (
            <div className="ndm-alert">
              <span>{error}</span>
              <button
                type="button"
                className="ndm-alert-close"
                onClick={() => setError('')}
                aria-label="Dismiss error"
              >
                ×
              </button>
            </div>
          )}

          {/* Step 1: Add Device — always visible, enabled */}
          <section className="ndm-section">
            <div className="ndm-step-header">
              <span className={`ndm-step-circle ${step1Complete ? 'ndm-step-complete' : 'ndm-step-active'}`}>
                {step1Complete ? '✓' : '1'}
              </span>
              <h3 className="ndm-step-title">Step 1: Add Device</h3>
            </div>

            <div className="ndm-field">
              <label htmlFor="name" className="ndm-label">
                Name
              </label>
              <input
                id="name"
                type="text"
                className="ndm-input"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={step1Complete}
              />
            </div>

            <div className="ndm-field">
              <label htmlFor="deviceId" className="ndm-label">
                Device ID
              </label>
              <input
                id="deviceId"
                type="text"
                className="ndm-input"
                placeholder="Enter device ID"
                value={deviceId}
                onChange={(e) => setDeviceId(e.target.value)}
                required
                disabled={step1Complete}
              />
            </div>

            <div className="ndm-field">
              <label htmlFor="devicePassword" className="ndm-label">
                Device Password
              </label>
              <input
                id="devicePassword"
                type="password"
                className="ndm-input"
                placeholder="Enter device password"
                value={devicePassword}
                onChange={(e) => setDevicePassword(e.target.value)}
                required
                disabled={step1Complete}
              />
            </div>
          </section>

          {!step1Complete && (
            <div className="ndm-button-row ndm-button-row-primary">
              <button
                type="button"
                className="ndm-btn ndm-btn-secondary"
                onClick={handleClose}
                disabled={submitting || anyDownloading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="ndm-btn ndm-btn-primary"
                disabled={submitting}
              >
                {submitting ? 'Adding...' : 'Add Device'}
              </button>
            </div>
          )}

          {/* Step 2: Download & Install — enabled only after Step 1 */}
          <section className={`ndm-section ${step2Enabled ? '' : 'ndm-section-disabled'}`}>
            <div className="ndm-step-header">
              <span className={`ndm-step-circle ${step2Enabled ? 'ndm-step-active' : 'ndm-step-disabled'}`}>
                2
              </span>
              <h3 className="ndm-step-title">Step 2: Download & Install</h3>
            </div>

            {step2Enabled ? (
              <>
                <div className="ndm-button-row">
                  <button
                    type="button"
                    className="ndm-btn ndm-btn-outline-primary"
                    onClick={handleDownload}
                    disabled={anyDownloading}
                  >
                    {downloading ? 'Downloading...' : '📥 Download Agent'}
                  </button>
                  <button
                    type="button"
                    className="ndm-btn ndm-btn-outline-secondary"
                    onClick={handleDownloadUI}
                    disabled={anyDownloading}
                  >
                    {downloadingUI ? 'Downloading...' : '📥 Download Agent (UI)'}
                  </button>
                  <button
                    type="button"
                    className="ndm-btn ndm-btn-outline-secondary"
                    onClick={handleDownloadInstaller}
                    disabled={anyDownloading}
                  >
                    {downloadingInstaller ? 'Downloading...' : '📥 Download Installer'}
                  </button>
                </div>
                <p className="ndm-instructions-label">Install instructions:</p>
                <ol className="ndm-instructions-list">
                  <li>Run the downloaded installer on the device.</li>
                  <li>
                    When prompted, enter the Device ID:{' '}
                    <strong>{deviceId}</strong>
                  </li>
                  <li>Complete the setup and ensure the device is connected.</li>
                </ol>
              </>
            ) : (
              <p className="ndm-helper-text">
                Complete Step 1 to unlock download and install instructions.
              </p>
            )}
          </section>

          {step1Complete && (
            <div className="ndm-footer">
              <button
                type="button"
                className="ndm-btn ndm-btn-primary ndm-btn-full"
                onClick={handleClose}
                disabled={anyDownloading}
              >
                Done
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default NewDeviceModal;
