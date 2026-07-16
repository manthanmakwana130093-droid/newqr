import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Camera, Copy, ExternalLink, ShieldAlert, Lock, Wifi, User, Building, Phone, Mail, Globe, Play, Square, Video, UploadCloud, Info } from 'lucide-react';

export default function QRScanner({ showToast }) {
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [decodedData, setDecodedData] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const scannerRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Query available cameras
    Html5Qrcode.getCameras().then(devices => {
      if (devices && devices.length > 0) {
        setCameras(devices);
        setSelectedCamera(devices[0].id);
      }
    }).catch(err => {
      console.warn("Camera enumeration error:", err);
    });

    return () => {
      // Clean up scanning on unmount
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop();
      }
    };
  }, []);

  const startScanning = () => {
    if (!selectedCamera) {
      showToast("No camera detected or selected.", "danger");
      return;
    }

    setDecodedData(null);
    const html5Qrcode = new Html5Qrcode("scanner-camera-view");
    scannerRef.current = html5Qrcode;

    const config = {
      fps: 15,
      qrbox: (width, height) => {
        const dim = Math.min(width, height) * 0.7;
        return { width: dim, height: dim };
      }
    };

    html5Qrcode.start(
      { deviceId: { exact: selectedCamera } },
      config,
      (decodedText) => {
        handleScanSuccess(decodedText);
        stopScanning();
      },
      () => {
        // Quiet frames failures
      }
    ).then(() => {
      setIsScanning(true);
      showToast("Camera scanner started!", "success");
    }).catch(err => {
      console.error("Camera start fail:", err);
      showToast("Camera access denied or device is busy.", "danger");
    });
  };

  const stopScanning = () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      scannerRef.current.stop().then(() => {
        scannerRef.current = null;
        setIsScanning(false);
      }).catch(err => {
        console.error("Stop scanner error:", err);
      });
    }
  };

  const handleScanSuccess = (text) => {
    let type = "text";
    let parsedInfo = {};

    if (/^https?:\/\//i.test(text)) {
      type = text.includes("?profile=") ? "profile" : "url";
    } else if (/^WIFI:/i.test(text)) {
      type = "wifi";
      const ssid = text.match(/S:(.*?);/)?.[1] || "Unknown";
      const pass = text.match(/P:(.*?);/)?.[1] || "";
      const security = text.match(/T:(.*?);/)?.[1] || "WPA";
      parsedInfo = { ssid, pass, security };
    } else if (/^BEGIN:VCARD/i.test(text)) {
      type = "vcard";
      const name = text.match(/FN:(.*)/)?.[1]?.trim() || "Unnamed Contact";
      const phone = text.match(/TEL;?(?:TYPE=.*)?:(.*)/)?.[1]?.trim() || "None";
      const email = text.match(/EMAIL;?(?:TYPE=.*)?:(.*)/)?.[1]?.trim() || "None";
      const org = text.match(/ORG:(.*)/)?.[1]?.trim() || "";
      const url = text.match(/URL:(.*)/)?.[1]?.trim() || "";
      parsedInfo = { name, phone, email, org, url, raw: text };
    } else if (/^mailto:/i.test(text)) {
      type = "email";
    } else if (/^tel:/i.test(text)) {
      type = "phone";
    } else if (/^sms(to)?:/i.test(text)) {
      type = "sms";
    }

    setDecodedData({
      text,
      type,
      timestamp: new Date().toLocaleTimeString(),
      parsedInfo
    });
    showToast("QR Code successfully scanned!", "success");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      scanImageFile(file);
    }
  };

  const scanImageFile = (file) => {
    const tempScanner = new Html5Qrcode("scanner-camera-view");
    tempScanner.scanFile(file, true)
      .then(decodedText => {
        handleScanSuccess(decodedText);
        tempScanner.clear();
      })
      .catch(err => {
        console.error("File scan error:", err);
        showToast("Could not find a valid QR code in this image.", "danger");
        tempScanner.clear();
      });
  };

  const handleCopy = () => {
    if (decodedData) {
      navigator.clipboard.writeText(decodedData.text).then(() => {
        showToast("Copied contents to clipboard!", "success");
      });
    }
  };

  const handleAction = () => {
    if (!decodedData) return;
    if (decodedData.type === 'vcard' && decodedData.parsedInfo.raw) {
      // Import contact (vCard file download)
      const blob = new Blob([decodedData.parsedInfo.raw], { type: 'text/vcard' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${decodedData.parsedInfo.name.replace(/\s+/g, '_')}.vcf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast("Downloading contact file...", "success");
    } else if (decodedData.type === 'url' || decodedData.type === 'profile' || decodedData.type === 'email' || decodedData.type === 'phone' || decodedData.type === 'sms') {
      window.open(decodedData.text.replace("smsto:", "sms:"), "_blank");
    }
  };

  return (
    <div className="scanner-layout">
      <div className="scanner-inputs-container">
        
        {/* Camera stream card */}
        <div className="scanner-card card-surface">
          <h2 className="card-subtitle"><Camera className="icon-title" /> Live Webcam Scanner</h2>
          
          <div className="webcam-scanner-box">
            <div id="scanner-camera-view" className="camera-stream-container">
              {!isScanning && (
                <div className="camera-placeholder">
                  <Video size={42} />
                  <p>Webcam is currently inactive</p>
                </div>
              )}
            </div>
            {isScanning && (
              <div className="camera-overlay-frame">
                <div className="scan-laser animate-laser"></div>
              </div>
            )}
          </div>

          <div className="scanner-controls">
            <div className="custom-select-group flex-grow">
              <label htmlFor="camera-device-select" className="select-label">Choose Camera Device</label>
              <div className="select-wrapper">
                <select 
                  id="camera-device-select"
                  value={selectedCamera}
                  onChange={(e) => setSelectedCamera(e.target.value)}
                  disabled={isScanning}
                >
                  {cameras.length === 0 ? (
                    <option value="">No cameras detected</option>
                  ) : (
                    cameras.map(device => (
                      <option key={device.id} value={device.id}>
                        {device.label || `Camera ${cameras.indexOf(device) + 1}`}
                      </option>
                    ))
                  )}
                </select>
                <Video className="select-icon" />
              </div>
            </div>
            <button 
              onClick={isScanning ? stopScanning : startScanning} 
              className={`btn ${isScanning ? 'btn-danger' : 'btn-primary'} btn-auto`}
            >
              {isScanning ? <Square size={16} /> : <Play size={16} />}
              {isScanning ? 'Stop Camera' : 'Start Camera Scan'}
            </button>
          </div>
        </div>

        {/* Drag Drop File Card */}
        <div className="scanner-card card-surface">
          <h2 className="card-subtitle"><UploadCloud className="icon-title" /> Scan Image File</h2>
          <div 
            className={`file-drop-zone ${dragOver ? 'dragover' : ''}`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const file = e.dataTransfer.files[0];
              if (file && file.type.startsWith('image/')) {
                scanImageFile(file);
              }
            }}
          >
            <div className="drop-zone-content">
              <UploadCloud className="cloud-icon" />
              <h3>Drag & Drop QR Image</h3>
              <p>Or click to browse files from your computer</p>
              <span className="file-spec">Supports PNG, JPG, JPEG, WEBP</span>
            </div>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*" 
              className="hidden" 
            />
          </div>
        </div>
      </div>

      {/* Decode Results Panel */}
      <div className="scanner-results-container">
        <div className="results-card card-surface">
          <h2 className="card-subtitle"><Info className="icon-title" /> Decode Results</h2>

          {!decodedData ? (
            <div className="result-placeholder">
              <UploadCloud className="placeholder-icon" size={44} />
              <p>Waiting for a valid QR code scan or file upload...</p>
            </div>
          ) : (
            <div className="decoded-content-box">
              <div className="result-header-details">
                <span className="badge-type">{decodedData.type}</span>
                <span className="timestamp-text">Scanned {decodedData.timestamp}</span>
              </div>

              <div className="result-body-text">
                <textarea 
                  value={decodedData.text} 
                  readOnly 
                  rows={4} 
                />
              </div>

              <div className="result-actions-grid">
                {(decodedData.type !== 'text' && decodedData.type !== 'wifi') && (
                  <button onClick={handleAction} className="btn btn-primary">
                    <ExternalLink size={16} /> 
                    {decodedData.type === 'vcard' ? 'Import Contact' : 'Open / View'}
                  </button>
                )}
                <button onClick={handleCopy} className="btn btn-secondary">
                  <Copy size={16} /> Copy Text
                </button>
              </div>

              {/* Parsed Struct fields */}
              {decodedData.type === 'wifi' && (
                <div className="parsed-structure-card">
                  <div className="parsed-row">
                    <Wifi className="parsed-icon" />
                    <div className="parsed-val"><span>SSID / Network</span><span>{decodedData.parsedInfo.ssid}</span></div>
                  </div>
                  <div className="parsed-row">
                    <Lock className="parsed-icon" />
                    <div className="parsed-val"><span>Password</span><span>{decodedData.parsedInfo.pass || <i>None (Open)</i>}</span></div>
                  </div>
                  <div className="parsed-row">
                    <ShieldAlert className="parsed-icon" />
                    <div className="parsed-val"><span>Security Type</span><span>{decodedData.parsedInfo.security}</span></div>
                  </div>
                </div>
              )}

              {decodedData.type === 'vcard' && (
                <div className="parsed-structure-card">
                  <div className="parsed-row">
                    <User className="parsed-icon" />
                    <div className="parsed-val"><span>Contact Name</span><span>{decodedData.parsedInfo.name}</span></div>
                  </div>
                  {decodedData.parsedInfo.org && (
                    <div className="parsed-row">
                      <Building className="parsed-icon" />
                      <div className="parsed-val"><span>Organization</span><span>{decodedData.parsedInfo.org}</span></div>
                    </div>
                  )}
                  <div className="parsed-row">
                    <Phone className="parsed-icon" />
                    <div className="parsed-val"><span>Phone Number</span><span>{decodedData.parsedInfo.phone}</span></div>
                  </div>
                  <div className="parsed-row">
                    <Mail className="parsed-icon" />
                    <div className="parsed-val"><span>Email Address</span><span>{decodedData.parsedInfo.email}</span></div>
                  </div>
                  {decodedData.parsedInfo.url && (
                    <div className="parsed-row">
                      <Globe className="parsed-icon" />
                      <div className="parsed-val"><span>Website URL</span><span>{decodedData.parsedInfo.url}</span></div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
