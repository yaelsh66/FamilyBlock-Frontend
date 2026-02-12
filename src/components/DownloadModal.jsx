import { useState } from 'react';
import { downloadAgentApi, downloadAgentUIApi, downloadAgentInstallerApi } from '../api/deviceApi';
import './NewDeviceModal.css';

function DownloadModal({ show, onHide, user }) {
  const [downloading, setDownloading] = useState(false);
  const [downloadingUI, setDownloadingUI] = useState(false);
  const [downloadingInstaller, setDownloadingInstaller] = useState(false);
  const [error, setError] = useState('');

  const handleClose = () => {
    setDownloading(false);
    setDownloadingUI(false);
    setDownloadingInstaller(false);
    setError('');
    onHide();
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
        aria-labelledby="download-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="ndm-header">
          <h2 id="download-modal-title" className="ndm-title">
            📥 Download Agent
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

        <div className="ndm-form">
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

          <section className="ndm-section">
            <div className="ndm-step-header">
              <span className="ndm-step-circle ndm-step-active">1</span>
              <h3 className="ndm-step-title">Download & Install</h3>
            </div>

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
                When prompted, enter the Device ID for your device (add a new
                device first if needed).
              </li>
              <li>Complete the setup and ensure the device is connected.</li>
            </ol>
          </section>

          <div className="ndm-footer">
            <button
              type="button"
              className="ndm-btn ndm-btn-primary ndm-btn-full"
              onClick={handleClose}
              disabled={anyDownloading}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DownloadModal;
