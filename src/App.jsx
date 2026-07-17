import React, { useState, useEffect } from 'react';
import { QrCode, Wand2, Camera, History, Sun, Moon } from 'lucide-react';
import QRGenerator from './components/QRGenerator';
import QRScanner from './components/QRScanner';
import QRHistory from './components/QRHistory';
import DigitalProfileView from './components/DigitalProfileView';

export default function App() {
  const [activeTab, setActiveTab] = useState('generator-tab');
  const [theme, setTheme] = useState('light');
  const [history, setHistory] = useState([]);
  const [loadedHistoryItem, setLoadedHistoryItem] = useState(null);
  
  // Router state
  const [profileData, setProfileData] = useState(null);

  // Toast notifications
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Read URL query string on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const profileParam = params.get('profile');

    if (profileParam) {
      try {
        let base64 = profileParam.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4) base64 += '=';
        const jsonStr = decodeURIComponent(escape(atob(base64)));
        const profileObj = JSON.parse(jsonStr);
        setProfileData(profileObj);
      } catch (e) {
        console.error("Router error:", e);
      }
    }

    // Set default light theme
    document.body.className = 'light-theme';

    // Load history from localStorage
    const localHist = JSON.parse(localStorage.getItem('aero_qr_history') || '[]');
    setHistory(localHist);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.body.className = `${nextTheme}-theme`;
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  // History callbacks
  const handleSaveHistory = (item) => {
    let localHist = JSON.parse(localStorage.getItem('aero_qr_history') || '[]');
    // Filter duplicates
    localHist = localHist.filter(h => h.data !== item.data);
    
    const newHistoryItem = {
      id: Date.now(),
      title: item.title,
      data: item.data,
      type: item.type,
      timestamp: new Date().toLocaleString(),
      config: item.config
    };

    localHist.unshift(newHistoryItem);
    if (localHist.length > 30) localHist.pop();
    
    localStorage.setItem('aero_qr_history', JSON.stringify(localHist));
    setHistory(localHist);
  };

  const handleEditHistory = (item) => {
    setLoadedHistoryItem(item);
    setActiveTab('generator-tab');
  };

  const handleDeleteHistory = (id) => {
    let localHist = JSON.parse(localStorage.getItem('aero_qr_history') || '[]');
    localHist = localHist.filter(h => h.id !== id);
    localStorage.setItem('aero_qr_history', JSON.stringify(localHist));
    setHistory(localHist);
    showToast("History item deleted", "warning");
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear your generation history?")) {
      localStorage.removeItem('aero_qr_history');
      setHistory([]);
      showToast("History cleared", "warning");
    }
  };

  const handleDownloadHistory = (item) => {
    // Re-download logic triggers same canvas generator
    import('qr-code-styling').then(({ default: QRCodeStyling }) => {
      const config = {
        width: 600,
        height: 600,
        data: item.data,
        dotsOptions: item.config?.dotsOptions || { color: '#000000', type: 'square' },
        backgroundOptions: item.config?.backgroundOptions || { color: '#ffffff' },
        cornersSquareOptions: item.config?.cornersSquareOptions || { type: 'square' },
        cornersDotOptions: item.config?.cornersDotOptions || { type: 'square' }
      };

      const dl = new QRCodeStyling(config);
      dl.download({ name: `aeroqr_${item.type}`, extension: 'png' });
      showToast("Downloading QR Code PNG...", "success");
    });
  };

  // If loading the All-in-One Digital Profile landing view, bypass dashboard
  if (profileData) {
    return <DigitalProfileView profile={profileData} />;
  }

  return (
    <div className="app-wrapper animate-fade-in">
      
      {/* Top Header */}
      <header className="app-header">
        <div className="logo-area">
          <div className="logo-icon-wrapper">
            <QrCode className="logo-icon animate-glow" />
          </div>
          <div>
            <h1>AeroQR<span>Toolkit</span></h1>
            <p>Premium React QR Suite & Identity Dashboard</p>
          </div>
        </div>
        
        <div className="header-controls">
          <button onClick={toggleTheme} className="theme-toggle-btn">
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
      </header>

      {/* Navigation tabs */}
      <nav className="app-navigation">
        <div className="nav-tabs-wrapper">
          <button 
            onClick={() => setActiveTab('generator-tab')}
            className={`nav-tab ${activeTab === 'generator-tab' ? 'active' : ''}`}
          >
            <Wand2 size={16} />
            <span>QR Generator</span>
          </button>
          <button 
            onClick={() => setActiveTab('scanner-tab')}
            className={`nav-tab ${activeTab === 'scanner-tab' ? 'active' : ''}`}
          >
            <Camera size={16} />
            <span>QR Scanner</span>
          </button>
          <button 
            onClick={() => setActiveTab('history-tab')}
            className={`nav-tab ${activeTab === 'history-tab' ? 'active' : ''}`}
          >
            <History size={16} />
            <span>Saved History</span>
          </button>
        </div>
      </nav>

      {/* Main Content panels */}
      <main className="app-content">
        {activeTab === 'generator-tab' && (
          <QRGenerator 
            showToast={showToast} 
            onSaveHistory={handleSaveHistory}
            loadedItem={loadedHistoryItem}
          />
        )}
        
        {activeTab === 'scanner-tab' && (
          <QRScanner showToast={showToast} />
        )}

        {activeTab === 'history-tab' && (
          <QRHistory 
            history={history}
            onEdit={handleEditHistory}
            onDelete={handleDeleteHistory}
            onDownload={handleDownloadHistory}
            onClear={handleClearHistory}
          />
        )}
      </main>

      {/* App toast popups */}
      {toast.show && (
        <div className={`global-toast ${toast.type}`}>
          <span className="toast-message">{toast.message}</span>
        </div>
      )}

      <footer className="app-footer-bar">
        <p>© 2026 Raghunandan   InfoTech. Modular client-side rendering with local storage cache persistence.</p>
      </footer>
    </div>
  );
}
