import React, { useState } from 'react';
import { Phone, Mail, MapPin, UserPlus, Sun, Moon, ExternalLink } from 'lucide-react';

export default function DigitalProfileView({ profile }) {
  const [theme, setTheme] = useState('light');

  React.useEffect(() => {
    document.body.className = 'light-theme';
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.body.className = `${nextTheme}-theme`;
  };

  const handleSaveContact = () => {
    const vCardContent = `BEGIN:VCARD
VERSION:3.0
N:${profile.name.split(" ").slice(1).join(" ") || "Contact"};${profile.name.split(" ")[0] || "Profile"};;;
FN:${profile.name}
ORG:${profile.title || ""}
TEL;TYPE=CELL:${profile.phone || ""}
EMAIL;TYPE=PREF,INTERNET:${profile.email || ""}
ADR;TYPE=WORK:;;${profile.map || ""}
URL:${window.location.href}
REV:${new Date().toISOString()}
END:VCARD`;

    const blob = new Blob([vCardContent], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${profile.name.replace(/\s+/g, '_')}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const socialConfigs = [
    { key: 'instagram', label: 'Instagram', color: 'text-instagram' },
    { key: 'facebook', label: 'Facebook', color: 'text-facebook' },
    { key: 'linkedin', label: 'LinkedIn', color: 'text-linkedin' },
    { key: 'youtube', label: 'YouTube', color: 'text-youtube' },
    { key: 'x', label: 'X / Twitter', color: 'text-x' }
  ];

  const hasSocials = profile.socials && Object.values(profile.socials).some(val => !!val);

  return (
    <div className="profile-view-container">
      <div className="profile-card-glow"></div>
      <div className="profile-card">
        <div className="profile-header-actions">
          <button onClick={toggleTheme} className="icon-btn" aria-label="Toggle Theme">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        <div className="profile-avatar-wrapper">
          <img 
            src={profile.avatar || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236366f1'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E`} 
            alt="Avatar" 
          />
        </div>

        <h1>{profile.name || "Unnamed Profile"}</h1>
        {profile.title && <p id="view-title">{profile.title}</p>}
        {profile.bio && <p id="view-bio">{profile.bio}</p>}

        <div className="action-grid">
          {profile.phone && (
            <a href={`tel:${profile.phone}`} className="action-btn-circle call-btn">
              <div className="action-btn-circle-inner">
                <Phone size={18} />
              </div>
              <span>Call</span>
            </a>
          )}
          {profile.email && (
            <a href={`mailto:${profile.email}`} className="action-btn-circle email-btn">
              <div className="action-btn-circle-inner">
                <Mail size={18} />
              </div>
              <span>Email</span>
            </a>
          )}
          {profile.map && (
            <a href={profile.map} target="_blank" rel="noopener noreferrer" className="action-btn-circle map-btn">
              <div className="action-btn-circle-inner">
                <MapPin size={18} />
              </div>
              <span>Directions</span>
            </a>
          )}
          <button onClick={handleSaveContact} className="action-btn-circle vcard-btn">
            <div className="action-btn-circle-inner">
              <UserPlus size={18} />
            </div>
            <span>Save Contact</span>
          </button>
        </div>

        <div className="profile-divider"></div>

        {hasSocials && (
          <div className="social-links-container">
            <h2>Connect With Me</h2>
            <div className="social-links-grid">
              {socialConfigs.map(s => {
                const url = profile.socials[s.key];
                if (!url) return null;
                return (
                  <a 
                    key={s.key} 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="social-link-item-row"
                  >
                    <span>{s.label}</span>
                  </a>
                );
              })}
            </div>
          </div>
        )}

        <div className="profile-footer">
          <p>Made by <a href="/">Raghunandan Technology</a></p>
        </div>
      </div>
    </div>
  );
}
