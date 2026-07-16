import React from 'react';
import { Link2, IdCard, Contact, Wifi, Mail, Phone, MessageSquare, AlignLeft, QrCode, Trash2, Pencil, Download } from 'lucide-react';

export default function QRHistory({ history, onEdit, onDelete, onDownload, onClear }) {
  
  const getIcon = (type) => {
    const props = { size: 18 };
    switch (type) {
      case 'url': return <Link2 {...props} />;
      case 'profile': return <IdCard {...props} />;
      case 'vcard': return <Contact {...props} />;
      case 'wifi': return <Wifi {...props} />;
      case 'email': return <Mail {...props} />;
      case 'phone': return <Phone {...props} />;
      case 'sms': return <MessageSquare {...props} />;
      case 'text': return <AlignLeft {...props} />;
      default: return <QrCode {...props} />;
    }
  };

  return (
    <div className="history-card card-surface">
      <div className="history-header">
        <div>
          <h2>Generation History</h2>
          <p>Re-download, re-edit, or view your previously generated QR codes.</p>
        </div>
        {history.length > 0 && (
          <button onClick={onClear} className="btn btn-danger btn-auto">
            <Trash2 size={16} /> Clear All History
          </button>
        )}
      </div>

      <div className="divider"></div>

      <div id="history-items-list" className="history-grid">
        {history.length === 0 ? (
          <div className="history-empty-state">
            <QrCode className="empty-icon" size={44} />
            <h3>No saved history found</h3>
            <p>QR codes you generate in this session will appear here for easy access.</p>
          </div>
        ) : (
          history.map(item => (
            <div key={item.id} className="history-item-row">
              <div className="history-item-icon">
                {getIcon(item.type)}
              </div>
              <div className="history-item-details">
                <h4>{item.title}</h4>
                <p>{item.data}</p>
              </div>
              <div className="history-item-time">
                <span>{item.timestamp.split(',')[0]}</span>
                <span style={{ opacity: 0.6 }}>{item.timestamp.split(',')[1] || ''}</span>
              </div>
              <div className="history-item-actions">
                <button 
                  onClick={() => onEdit(item)} 
                  className="icon-btn" 
                  title="Load Settings"
                >
                  <Pencil size={15} />
                </button>
                <button 
                  onClick={() => onDownload(item)} 
                  className="icon-btn" 
                  title="Download PNG"
                >
                  <Download size={15} />
                </button>
                <button 
                  onClick={() => onDelete(item.id)} 
                  className="icon-btn" 
                  title="Delete" 
                  style={{ color: 'var(--color-danger)' }}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
