import React, { useState, useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';
import { Link2, IdCard, Contact, Wifi, Mail, Phone, MessageSquare, AlignLeft, Download, FileCode, Copy, Share2, Upload, Ban, User, Building, MapPin, ExternalLink, Lock } from 'lucide-react';

const PRESET_LOGOS = {
  none: null,
  whatsapp: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="%2325d366"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>',
  instagram: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="%23e1306c"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.9c-41.4 0-75-33.6-75-75s33.6-75 75-75 75 33.6 75 75-33.5 75-75 75zm136-191.9c0 14.9-12 26.9-26.9 26.9s-26.9-12-26.9-26.9 12-26.9 26.9-26.9 26.9 12 26.9 26.9zM400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-16.4 310c0 43.3-35.1 78.4-78.4 78.4H142.8c-43.3 0-78.4-35.1-78.4-78.4V172c0-43.3 35.1-78.4 78.4-78.4h162.4c43.3 0 78.4 35.1 78.4 78.4v170vh.1z"/></svg>',
  location: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="%23ef4444"><path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 256c-35.3 0-64-28.7-64-64s28.7-64 64-64s64 28.7 64 64s-28.7 64-64 64z"/></svg>',
  wifi: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill="%233b82f6"><path d="M0 192c0-14.7 4.9-29 13.9-40.5C53 100.9 122.9 64 200 64c72 0 137.9 31.8 183.1 82.5c8 9 12.3 20.6 12.3 32.5c0 24.6-20 44.5-44.5 44.5c-11 0-21.5-4.1-29.5-11.5C293.7 185.3 249.2 166 200 166c-44 0-84.3 15.4-116.1 41.2c-8 6.5-18 10-28.4 10C31 217.2 11 197.3 11 172.8c0-8.9 2.7-17.6 7.8-24.9c.1-.1 .2-.3 .3-.4L21.4 144zM320 384c0 26.5-21.5 48-48 48s-48-21.5-48-48s21.5-48 48-48s48 21.5 48 48zm223.9-232.5C589.1 202 640 273.1 640 352c0 14.7-4.9 29-13.9 40.5c-39.1 50.6-109 87.5-186.1 87.5c-72 0-137.9-31.8-183.1-82.5c-8-9-12.3-20.6-12.3-32.5c0-24.6 20-44.5 44.5-44.5c11 0 21.5 4.1 29.5 11.5c27.7 25.7 72.2 45 121.4 45c44 0 84.3-15.4 116.1-41.2c8-6.5 18-10 28.4-10c24.5 0 44.5 20 44.5 44.5c0 8.9-2.7 17.6-7.8 24.9c-.1 .1-.2 .3-.3 .4l-2.3 3.3z"/></svg>',
  email: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="%236366f1"><path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z"/></svg>',
  web: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="%236366f1"><path d="M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64h185.3c2.2 20.4 3.3 41.8 3.3 64zm28.8-64h112.1c8.7 20 14.8 41.3 17.7 64H384.3c-1.3-21.8-3.1-43.1-5.5-64zM384.3 320h109.3c-2.9 22.7-9 44-17.7 64H380.8c2.4-20.9 4.2-42.2 5.5-64zM127.7 256H16.4c2.9-22.7 9-44 17.7-64h112.1c-2.4 20.9-4.2 42.2-5.5 64zm-5.5 64c-1.3 21.8-3.1 43.1-5.5 64H4.7c8.7 20 14.8 41.3 17.7 64h109.3zM256 16c35.6 0 67.2 41.9 83.1 96H172.9c15.9-54.1 47.5-96 83.1-96zm-92.7 96H47.7C86.7 54.4 148.9 22 220.8 17c-26.6 28-46.7 63.6-57.5 99zm185.4 0c-10.8-35.4-30.9-71-57.5-99C363.1 22 425.3 54.4 464.3 112H348.7zM256 496c-35.6 0-67.2-41.9-83.1-96h166.2c-15.9 54.1-47.5 96-83.1 96zm-92.7-96H47.7c39-57.6 101.2-90 173.1-95c-26.6-28-46.7-63.6-57.5-99zm185.4 0c-10.8 35.4-30.9 71-57.5 99c71.9 5 134.1 37.4 173.1 95H348.7z"/></svg>'
};

const TEMPLATES = {
  default: { isGrad: false, fore: '#000000', bg: '#ffffff', dots: 'square', frame: 'square', dot: 'square' },
  sunset: { isGrad: true, gradType: 'linear', start: '#f59e0b', end: '#ec4899', angle: 45, bg: '#ffffff', dots: 'classy', frame: 'rounded', dot: 'dot' },
  ocean: { isGrad: true, gradType: 'linear', start: '#06b6d4', end: '#3b82f6', angle: 135, bg: '#ffffff', dots: 'rounded', frame: 'extra-rounded', dot: 'rounded' },
  cyberpunk: { isGrad: true, gradType: 'linear', start: '#d946ef', end: '#06b6d4', angle: 90, bg: '#09090b', dots: 'classy-rounded', frame: 'square', dot: 'square' },
  emerald: { isGrad: true, gradType: 'radial', start: '#10b981', end: '#059669', angle: 0, bg: '#ffffff', dots: 'extra-rounded', frame: 'rounded', dot: 'dot' },
  royal: { isGrad: true, gradType: 'linear', start: '#8b5cf6', end: '#ec4899', angle: 45, bg: '#ffffff', dots: 'classy-rounded', frame: 'extra-rounded', dot: 'heart' }
};

export default function QRGenerator({ showToast, onSaveHistory, loadedItem }) {
  const [activeType, setActiveType] = useState('url');
  const [activeSubTab, setActiveSubTab] = useState('design-templates');
  const [activeTemplate, setActiveTemplate] = useState('default');

  // Input states
  const [urlVal, setUrlVal] = useState('https://google.com');
  const [profileName, setProfileName] = useState('John Doe');
  const [profileTitle, setProfileTitle] = useState('Product Designer');
  const [profileBio, setProfileBio] = useState('Creating designs & bringing ideas to life.');
  const [profilePhone, setProfilePhone] = useState('+1234567890');
  const [profileEmail, setProfileEmail] = useState('hello@yourdomain.com');
  const [profileMaps, setProfileMaps] = useState('https://maps.google.com');
  const [profileSocials, setProfileSocials] = useState({ instagram: '', facebook: '', linkedin: '', youtube: '', x: '' });
  const [profileAvatar, setProfileAvatar] = useState(null);

  const [vCardFirst, setVCardFirst] = useState('Jane');
  const [vCardLast, setVCardLast] = useState('Smith');
  const [vCardPhone, setVCardPhone] = useState('+15550199');
  const [vCardEmail, setVCardEmail] = useState('jane.smith@office.com');
  const [vCardOrg, setVCardOrg] = useState('Innovate Co');
  const [vCardTitle, setVCardTitle] = useState('Project Lead');
  const [vCardAddress, setVCardAddress] = useState('456 Innovation Blvd, Tech City');
  const [vCardUrl, setVCardUrl] = useState('https://innovate.co');

  const [wifiSSID, setWifiSSID] = useState('AeroQR_Guest');
  const [wifiPass, setWifiPass] = useState('ConnectNow2026');
  const [wifiType, setWifiType] = useState('WPA');

  const [emailTo, setEmailTo] = useState('support@aeroqr.com');
  const [emailSubject, setEmailSubject] = useState('Inquiry from QR Code');
  const [emailBody, setEmailBody] = useState('Hello support, I scanned your QR code and wanted to get in touch!');

  const [phoneNum, setPhoneNum] = useState('+18005550199');

  const [smsNum, setSmsNum] = useState('+18005550199');
  const [smsBody, setSmsBody] = useState('Hello! I scanned your QR code, let me know when you\'re free.');

  const [textVal, setTextVal] = useState('Write some simple text here. When scanned, it will display directly.');

  // Customizer styling states
  const [dotsStyle, setDotsStyle] = useState('rounded');
  const [cornersFrameStyle, setCornersFrameStyle] = useState('rounded');
  const [cornersDotStyle, setCornersDotStyle] = useState('dot');
  const [errorLevel, setErrorLevel] = useState('H');
  const [resolution, setResolution] = useState(350);

  const [isGradient, setIsGradient] = useState(false);
  const [colorForeground, setColorForeground] = useState('#000000');
  const [colorGrad1, setColorGrad1] = useState('#6366f1');
  const [colorGrad2, setColorGrad2] = useState('#ec4899');
  const [gradAngle, setGradAngle] = useState(0);
  const [gradType, setGradType] = useState('linear');
  const [colorBackground, setColorBackground] = useState('#ffffff');

  const [selectedLogoPreset, setSelectedLogoPreset] = useState('none');
  const [customLogoFile, setCustomLogoFile] = useState(null);
  const [logoSize, setLogoSize] = useState(15);
  const [logoMargin, setLogoMargin] = useState(5);
  const [logoCleanBg, setLogoCleanBg] = useState(true);

  // References
  const canvasRef = useRef(null);
  const qrCodeRef = useRef(null);

  // Load draft from localStorage on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('aero_qr_profile_draft');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        if (draft.name) setProfileName(draft.name);
        if (draft.title) setProfileTitle(draft.title);
        if (draft.bio) setProfileBio(draft.bio);
        if (draft.phone) setProfilePhone(draft.phone);
        if (draft.email) setProfileEmail(draft.email);
        if (draft.map) setProfileMaps(draft.map);
        if (draft.socials) setProfileSocials(draft.socials);
        if (draft.avatar) {
          if (draft.avatar.length > 2500) {
            console.warn("Discarded old uncompressed draft avatar.");
          } else {
            setProfileAvatar(draft.avatar);
          }
        }
      } catch (e) {
        console.error("Draft load error", e);
      }
    }
  }, []);

  // Save profile draft to localStorage on state changes
  useEffect(() => {
    const draft = {
      name: profileName,
      title: profileTitle,
      bio: profileBio,
      phone: profilePhone,
      email: profileEmail,
      map: profileMaps,
      socials: profileSocials,
      avatar: profileAvatar
    };
    localStorage.setItem('aero_qr_profile_draft', JSON.stringify(draft));
  }, [profileName, profileTitle, profileBio, profilePhone, profileEmail, profileMaps, profileSocials, profileAvatar]);

  // Initialize QR instance once
  useEffect(() => {
    const config = getQRConfig();
    const qrCode = new QRCodeStyling(config);
    qrCodeRef.current = qrCode;
    
    if (canvasRef.current) {
      canvasRef.current.innerHTML = '';
      qrCode.append(canvasRef.current);
    }
  }, []);

  // Sync loaded history item
  useEffect(() => {
    if (!loadedItem) return;

    setActiveType(loadedItem.type);
    
    // Parse values depending on type
    if (loadedItem.type === 'url') {
      setUrlVal(loadedItem.data);
    } else if (loadedItem.type === 'text') {
      setTextVal(loadedItem.data);
    } else if (loadedItem.type === 'phone') {
      setPhoneNum(loadedItem.data.replace('tel:', ''));
    } else if (loadedItem.type === 'wifi') {
      const match = loadedItem.data.match(/WIFI:S:(.*?);T:(.*?);P:(.*?);;/);
      if (match) {
        setWifiSSID(match[1]);
        setWifiType(match[2]);
        setWifiPass(match[3]);
      }
    } else if (loadedItem.type === 'email') {
      const match = loadedItem.data.match(/mailto:(.*?)\?subject=(.*?)&body=(.*)/);
      if (match) {
        setEmailTo(match[1]);
        setEmailSubject(decodeURIComponent(match[2]));
        setEmailBody(decodeURIComponent(match[3]));
      }
    } else if (loadedItem.type === 'sms') {
      const match = loadedItem.data.match(/smsto:(.*?):(.*)/);
      if (match) {
        setSmsNum(match[1]);
        setSmsBody(match[2]);
      }
    } else if (loadedItem.type === 'profile') {
      const match = loadedItem.data.match(/\?profile=(.*)/);
      if (match) {
        try {
          let base64 = match[1].replace(/-/g, '+').replace(/_/g, '/');
          while (base64.length % 4) base64 += '=';
          const p = JSON.parse(decodeURIComponent(escape(atob(base64))));
          setProfileName(p.name);
          setProfileTitle(p.title);
          setProfileBio(p.bio);
          setProfilePhone(p.phone);
          setProfileEmail(p.email);
          setProfileMaps(p.map);
          setProfileSocials(p.socials || {});
          if (p.avatar) {
            if (p.avatar.length > 2500) {
              console.warn("Skipping legacy uncompressed history avatar.");
            } else {
              setProfileAvatar(p.avatar);
            }
          }
        } catch (e) {
          console.error("Decode fail", e);
        }
      }
    }

    // Apply configuration updates
    if (loadedItem.config) {
      setDotsStyle(loadedItem.config.dotsOptions.type);
      setCornersFrameStyle(loadedItem.config.cornersSquareOptions.type);
      setCornersDotStyle(loadedItem.config.cornersDotOptions.type);
      
      if (loadedItem.config.dotsOptions.gradient) {
        setIsGradient(true);
        const grad = loadedItem.config.dotsOptions.gradient;
        setColorGrad1(grad.colorStops[0].color);
        setColorGrad2(grad.colorStops[1].color);
        setGradType(grad.type);
      } else {
        setIsGradient(false);
        setColorForeground(loadedItem.config.dotsOptions.color || '#000000');
      }

      setColorBackground(loadedItem.config.backgroundOptions.color || '#ffffff');
      setSelectedLogoPreset(loadedItem.config.logoPreset);
    }
  }, [loadedItem]);

  // Update configuration when inputs change
  useEffect(() => {
    if (!qrCodeRef.current) return;

    try {
      const data = getFormattedQRData();
      const config = getQRConfig(data);
      
      // Update live QR
      qrCodeRef.current.update(config);

      // Dynamic glow adjustment
      const glow = document.getElementById('canvas-glow');
      if (glow) {
        glow.style.background = isGradient ? colorGrad1 : colorForeground;
      }
    } catch (e) {
      console.error("QR Code rendering failed:", e);
      showToast("Content is too long for the QR code! Please shorten your text.", "danger");
    }
  }, [
    activeType, urlVal, profileName, profileTitle, profileBio, profilePhone, profileEmail, profileMaps, profileSocials, profileAvatar,
    vCardFirst, vCardLast, vCardPhone, vCardEmail, vCardOrg, vCardTitle, vCardAddress, vCardUrl,
    wifiSSID, wifiPass, wifiType,
    emailTo, emailSubject, emailBody,
    phoneNum, smsNum, smsBody, textVal,
    dotsStyle, cornersFrameStyle, cornersDotStyle, isGradient, colorForeground, colorGrad1, colorGrad2, gradAngle, gradType, colorBackground,
    selectedLogoPreset, customLogoFile, logoSize, logoMargin, logoCleanBg, errorLevel
  ]);

  const getFormattedQRData = () => {
    switch (activeType) {
      case 'url':
        return urlVal;
      case 'profile':
        const profileObj = {
          name: profileName,
          title: profileTitle,
          bio: profileBio,
          phone: profilePhone,
          email: profileEmail,
          map: profileMaps,
          socials: profileSocials
        };
        if (profileAvatar) profileObj.avatar = profileAvatar;
        
        const jsonStr = JSON.stringify(profileObj);
        const utf8SafeBase64 = btoa(unescape(encodeURIComponent(jsonStr)));
        const urlSafeBase64 = utf8SafeBase64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        const origin = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
          ? 'https://qr-alpha-amber.vercel.app'
          : window.location.origin;
        return `${origin}${window.location.pathname}?profile=${urlSafeBase64}`;
      case 'vcard':
        return `BEGIN:VCARD
VERSION:3.0
N:${vCardLast};${vCardFirst};;;
FN:${vCardFirst} ${vCardLast}
ORG:${vCardOrg}
TITLE:${vCardTitle}
TEL;TYPE=CELL:${vCardPhone}
EMAIL;TYPE=PREF,INTERNET:${vCardEmail}
ADR;TYPE=WORK:;;${vCardAddress}
URL:${vCardUrl}
REV:${new Date().toISOString()}
END:VCARD`;
      case 'wifi':
        return `WIFI:S:${wifiSSID};T:${wifiType};P:${wifiPass};;`;
      case 'email':
        return `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      case 'phone':
        return `tel:${phoneNum}`;
      case 'sms':
        return `smsto:${smsNum}:${smsBody}`;
      case 'text':
        return textVal;
      default:
        return '';
    }
  };

  const getQRConfig = (dataText = '') => {
    let logoData = null;
    if (selectedLogoPreset !== 'none') {
      logoData = PRESET_LOGOS[selectedLogoPreset];
    } else if (customLogoFile) {
      logoData = customLogoFile;
    }

    const config = {
      width: 350,
      height: 350,
      type: 'svg',
      data: dataText || 'https://google.com',
      image: logoData,
      dotsOptions: {
        type: dotsStyle
      },
      backgroundOptions: {
        color: colorBackground
      },
      cornersSquareOptions: {
        type: cornersFrameStyle
      },
      cornersDotOptions: {
        type: cornersDotStyle
      },
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: logoMargin,
        hideBackgroundDots: logoCleanBg,
        imageSize: logoSize / 100
      },
      qrOptions: {
        errorCorrectionLevel: logoData ? 'H' : errorLevel
      }
    };

    if (isGradient) {
      config.dotsOptions.gradient = {
        type: gradType,
        rotation: (gradAngle * Math.PI) / 180,
        colorStops: [
          { offset: 0, color: colorGrad1 },
          { offset: 1, color: colorGrad2 }
        ]
      };
      config.cornersSquareOptions.color = colorGrad1;
      config.cornersDotOptions.color = colorGrad2;
    } else {
      config.dotsOptions.color = colorForeground;
      config.cornersSquareOptions.color = colorForeground;
      config.cornersDotOptions.color = colorForeground;
    }

    return config;
  };

  const applyTemplate = (name) => {
    setActiveTemplate(name);
    const c = TEMPLATES[name];
    if (!c) return;

    if (c.isGrad) {
      setIsGradient(true);
      setColorGrad1(c.start);
      setColorGrad2(c.end);
      setGradAngle(c.angle);
      setGradType(c.gradType);
    } else {
      setIsGradient(false);
      setColorForeground(c.fore);
    }

    setColorBackground(c.bg);
    setDotsStyle(c.dots);
    setCornersFrameStyle(c.frame);
    setCornersDotStyle(c.dot);
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Shrink image down to base64 jpeg (32x32 at 0.4 quality to keep QR code highly scannable)
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, 32, 32);
        setProfileAvatar(canvas.toDataURL('image/jpeg', 0.4));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      setSelectedLogoPreset('none');
      setCustomLogoFile(ev.target.result);
      setErrorLevel('H');
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = (ext) => {
    const data = getFormattedQRData();
    const config = {
      ...getQRConfig(data),
      width: resolution,
      height: resolution,
      type: ext === 'svg' ? 'svg' : 'canvas'
    };

    const dlCode = new QRCodeStyling(config);
    dlCode.download({ name: `aeroqr_${activeType}`, extension: ext });
    showToast(`Downloading QR Code in ${ext.toUpperCase()} format...`, 'success');
    
    // Save to history log
    onSaveHistory({
      title: `${activeType.toUpperCase()}: ${data.substring(0, 30)}`,
      data,
      type: activeType,
      config: {
        dotsOptions: { type: dotsStyle },
        backgroundOptions: { color: colorBackground },
        cornersSquareOptions: { type: cornersFrameStyle },
        cornersDotOptions: { type: cornersDotStyle },
        logoPreset: selectedLogoPreset
      }
    });
  };

  const handleCopyClipboard = () => {
    const copyCode = new QRCodeStyling({
      ...getQRConfig(getFormattedQRData()),
      width: 400,
      height: 400,
      type: 'canvas'
    });

    copyCode._canvas.getCanvas().then(canvas => {
      canvas.toBlob(blob => {
        try {
          navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]).then(() => {
            showToast("QR image successfully copied to clipboard!", "success");
          });
        } catch (e) {
          showToast("Clipboard copying failed.", "danger");
        }
      }, "image/png");
    });
  };

  const handleShareLink = () => {
    const data = getFormattedQRData();
    navigator.clipboard.writeText(data).then(() => {
      showToast("All-in-One link copied to clipboard!", "success");
    });
  };

  const types = [
    { id: 'url', label: 'Website Link', icon: <Link2 size={16} /> },
    { id: 'profile', label: 'All-in-One Profile', icon: <IdCard size={16} /> },
    { id: 'vcard', label: 'Contact Card', icon: <Contact size={16} /> },
    { id: 'wifi', label: 'WiFi Network', icon: <Wifi size={16} /> },
    { id: 'email', label: 'Email Msg', icon: <Mail size={16} /> },
    { id: 'phone', label: 'Phone Number', icon: <Phone size={16} /> },
    { id: 'sms', label: 'SMS Message', icon: <MessageSquare size={16} /> },
    { id: 'text', label: 'Plain Text', icon: <AlignLeft size={16} /> }
  ];

  return (
    <div className="panel-layout">
      <div className="config-section card-surface">
        
        {/* Step 1: Type selector */}
        <div className="section-group">
          <h2 className="section-title"><span className="step-num">1</span>Select QR Type</h2>
          <div className="type-grid">
            {types.map(t => (
              <button 
                key={t.id} 
                onClick={() => setActiveType(t.id)}
                className={`type-card ${activeType === t.id ? 'active' : ''}`}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Content Inputs */}
        <div className="section-group">
          <h2 className="section-title"><span class="step-num">2</span>Enter Content Details</h2>
          <div className="input-form-container">
            {activeType === 'url' && (
              <div className="input-form-animate">
                <div className="floating-input-group">
                  <input 
                    type="url" 
                    value={urlVal} 
                    onChange={(e) => setUrlVal(e.target.value)} 
                    placeholder=" " 
                    required 
                  />
                  <label>Enter Web Address (URL)</label>
                  <Link2 className="input-icon" />
                </div>
              </div>
            )}

            {activeType === 'profile' && (
              <div className="input-form-animate">
                <div className="form-row">
                  <div className="avatar-uploader">
                    <div className="avatar-preview-box">
                      <img src={profileAvatar || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23a5b4fc'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E`} alt="Avatar" />
                    </div>
                    <div className="avatar-upload-btn-wrapper">
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => document.getElementById('profile-av-up').click()}>
                        Upload Photo
                      </button>
                      <input id="profile-av-up" type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                      <span className="upload-tip">Square image works best</span>
                    </div>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="floating-input-group">
                    <input type="text" value={profileName} onChange={(e) => setProfileName(e.target.value)} placeholder=" " />
                    <label>Full Name</label>
                    <User className="input-icon" />
                  </div>
                  <div className="floating-input-group">
                    <input type="text" value={profileTitle} onChange={(e) => setProfileTitle(e.target.value)} placeholder=" " />
                    <label>Job Title & Company</label>
                    <Building className="input-icon" />
                  </div>
                </div>

                <div className="floating-input-group">
                  <textarea value={profileBio} onChange={(e) => setProfileBio(e.target.value)} placeholder=" " rows={2} />
                  <label>Short Bio</label>
                  <AlignLeft className="input-icon" />
                </div>

                <div className="form-grid">
                  <div className="floating-input-group">
                    <input type="tel" value={profilePhone} onChange={(e) => setProfilePhone(e.target.value)} placeholder=" " />
                    <label>Phone Number</label>
                    <Phone className="input-icon" />
                  </div>
                  <div className="floating-input-group">
                    <input type="email" value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} placeholder=" " />
                    <label>Email Address</label>
                    <Mail className="input-icon" />
                  </div>
                </div>

                <div className="floating-input-group">
                  <input type="url" value={profileMaps} onChange={(e) => setProfileMaps(e.target.value)} placeholder=" " />
                  <label>Google Maps Location Link</label>
                  <MapPin className="input-icon" />
                </div>

                <div className="profile-social-inputs">
                  <span className="sub-label">Social Profile Links</span>
                  <div className="floating-input-group compact">
                    <input type="url" value={profileSocials.instagram} onChange={(e) => setProfileSocials({ ...profileSocials, instagram: e.target.value })} placeholder=" " />
                    <label>Instagram URL</label>
                    <ExternalLink className="input-icon text-instagram" />
                  </div>
                  <div className="floating-input-group compact">
                    <input type="url" value={profileSocials.facebook} onChange={(e) => setProfileSocials({ ...profileSocials, facebook: e.target.value })} placeholder=" " />
                    <label>Facebook URL</label>
                    <ExternalLink className="input-icon text-facebook" />
                  </div>
                  <div className="floating-input-group compact">
                    <input type="url" value={profileSocials.linkedin} onChange={(e) => setProfileSocials({ ...profileSocials, linkedin: e.target.value })} placeholder=" " />
                    <label>LinkedIn URL</label>
                    <ExternalLink className="input-icon text-linkedin" />
                  </div>
                </div>
              </div>
            )}

            {activeType === 'vcard' && (
              <div className="input-form-animate">
                <div className="form-grid">
                  <div className="floating-input-group">
                    <input type="text" value={vCardFirst} onChange={(e) => setVCardFirst(e.target.value)} placeholder=" " />
                    <label>First Name</label>
                    <User className="input-icon" />
                  </div>
                  <div className="floating-input-group">
                    <input type="text" value={vCardLast} onChange={(e) => setVCardLast(e.target.value)} placeholder=" " />
                    <label>Last Name</label>
                    <User className="input-icon" />
                  </div>
                </div>
                <div className="form-grid">
                  <div className="floating-input-group">
                    <input type="tel" value={vCardPhone} onChange={(e) => setVCardPhone(e.target.value)} placeholder=" " />
                    <label>Phone Number</label>
                    <Phone className="input-icon" />
                  </div>
                  <div className="floating-input-group">
                    <input type="email" value={vCardEmail} onChange={(e) => setVCardEmail(e.target.value)} placeholder=" " />
                    <label>Email Address</label>
                    <Mail className="input-icon" />
                  </div>
                </div>
                <div className="floating-input-group">
                  <input type="text" value={vCardAddress} onChange={(e) => setVCardAddress(e.target.value)} placeholder=" " />
                  <label>Street Address</label>
                  <MapPin className="input-icon" />
                </div>
              </div>
            )}

            {activeType === 'wifi' && (
              <div className="input-form-animate">
                <div className="floating-input-group">
                  <input type="text" value={wifiSSID} onChange={(e) => setWifiSSID(e.target.value)} placeholder=" " />
                  <label>SSID / Network Name</label>
                  <Wifi className="input-icon" />
                </div>
                <div className="form-grid">
                  <div className="floating-input-group">
                    <input type="password" value={wifiPass} onChange={(e) => setWifiPass(e.target.value)} placeholder=" " />
                    <label>Password</label>
                    <Lock className="input-icon" />
                  </div>
                  <div className="custom-select-group">
                    <label className="select-label">Security</label>
                    <div className="select-wrapper">
                      <select value={wifiType} onChange={(e) => setWifiType(e.target.value)}>
                        <option value="WPA">WPA/WPA2</option>
                        <option value="WEP">WEP</option>
                        <option value="nopass">No Password (Open)</option>
                      </select>
                      <Wifi className="select-icon" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeType === 'email' && (
              <div className="input-form-animate">
                <div className="floating-input-group">
                  <input type="email" value={emailTo} onChange={(e) => setEmailTo(e.target.value)} placeholder=" " />
                  <label>Recipient Email</label>
                  <Mail className="input-icon" />
                </div>
                <div className="floating-input-group">
                  <input type="text" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} placeholder=" " />
                  <label>Subject</label>
                  <AlignLeft className="input-icon" />
                </div>
                <div className="floating-input-group">
                  <textarea value={emailBody} onChange={(e) => setEmailBody(e.target.value)} placeholder=" " rows={3} />
                  <label>Body Message</label>
                  <AlignLeft className="input-icon" />
                </div>
              </div>
            )}

            {activeType === 'phone' && (
              <div className="input-form-animate">
                <div className="floating-input-group">
                  <input type="tel" value={phoneNum} onChange={(e) => setPhoneNum(e.target.value)} placeholder=" " />
                  <label>Phone Number</label>
                  <Phone className="input-icon" />
                </div>
              </div>
            )}

            {activeType === 'sms' && (
              <div className="input-form-animate">
                <div className="floating-input-group">
                  <input type="tel" value={smsNum} onChange={(e) => setSmsNum(e.target.value)} placeholder=" " />
                  <label>Receiver Phone Number</label>
                  <Phone className="input-icon" />
                </div>
                <div className="floating-input-group">
                  <textarea value={smsBody} onChange={(e) => setSmsBody(e.target.value)} placeholder=" " rows={3} />
                  <label>Pre-filled SMS Text</label>
                  <MessageSquare className="input-icon" />
                </div>
              </div>
            )}

            {activeType === 'text' && (
              <div className="input-form-animate">
                <div className="floating-input-group">
                  <textarea value={textVal} onChange={(e) => setTextVal(e.target.value)} placeholder=" " rows={4} />
                  <label>Plain Text Content</label>
                  <AlignLeft className="input-icon" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Step 3: Customizer Styling tabs */}
        <div className="section-group">
          <h2 className="section-title"><span className="step-num">3</span>Customize QR Design</h2>
          
          <div className="customizer-tabs">
            {['templates', 'colors', 'shapes', 'icon'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveSubTab(`design-${tab}`)}
                className={`custom-sub-tab ${activeSubTab === `design-${tab}` ? 'active' : ''}`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="customizer-panels-container">
            {activeSubTab === 'design-templates' && (
              <div className="presets-grid">
                {Object.keys(TEMPLATES).map(name => (
                  <button 
                    key={name}
                    onClick={() => applyTemplate(name)}
                    className={`preset-item ${activeTemplate === name ? 'active' : ''}`}
                  >
                    <div className={`preset-preview preset-${name}`} />
                    <span>{name.charAt(0).toUpperCase() + name.slice(1)}</span>
                  </button>
                ))}
              </div>
            )}

            {activeSubTab === 'design-colors' && (
              <div className="customizer-panel">
                <div className="control-row">
                  <span className="control-label">Foreground Type:</span>
                  <div className="btn-group-toggle">
                    <button onClick={() => setIsGradient(false)} className={`toggle-btn ${!isGradient ? 'active' : ''}`}>Solid</button>
                    <button onClick={() => setIsGradient(true)} className={`toggle-btn ${isGradient ? 'active' : ''}`}>Gradient</button>
                  </div>
                </div>

                {!isGradient ? (
                  <div className="color-picker-group">
                    <div className="color-picker-item">
                      <div className="color-swatch-wrapper">
                        <input type="color" value={colorForeground} onChange={(e) => setColorForeground(e.target.value)} />
                      </div>
                      <span className="hex-text">{colorForeground}</span>
                    </div>
                  </div>
                ) : (
                  <div className="customizer-panel">
                    <div className="color-picker-group">
                      <div className="color-picker-item">
                        <div className="color-swatch-wrapper">
                          <input type="color" value={colorGrad1} onChange={(e) => setColorGrad1(e.target.value)} />
                        </div>
                        <span className="hex-text">{colorGrad1}</span>
                      </div>
                      <div className="color-picker-item">
                        <div className="color-swatch-wrapper">
                          <input type="color" value={colorGrad2} onChange={(e) => setColorGrad2(e.target.value)} />
                        </div>
                        <span className="hex-text">{colorGrad2}</span>
                      </div>
                    </div>
                    <div className="control-row-col">
                      <div className="slider-row">
                        <label className="control-label">Angle:</label>
                        <span className="slider-val">{gradAngle}°</span>
                      </div>
                      <input type="range" min="0" max="360" value={gradAngle} onChange={(e) => setGradAngle(parseInt(e.target.value))} className="premium-range" />
                    </div>
                  </div>
                )}

                <div className="divider" style={{ margin: '8px 0' }} />

                <div className="color-picker-group">
                  <div className="color-picker-item">
                    <div className="color-swatch-wrapper">
                      <input type="color" value={colorBackground} onChange={(e) => setColorBackground(e.target.value)} />
                    </div>
                    <span className="hex-text">{colorBackground}</span>
                  </div>
                </div>
              </div>
            )}

            {activeSubTab === 'design-shapes' && (
              <div className="customizer-panel">
                <div className="custom-select-group">
                  <label className="select-label">Dots Style</label>
                  <div className="select-wrapper">
                    <select value={dotsStyle} onChange={(e) => setDotsStyle(e.target.value)}>
                      <option value="square">Classic Square</option>
                      <option value="rounded">Rounded Squares</option>
                      <option value="dots">Circular Dots</option>
                      <option value="classy">Artistic Classy</option>
                      <option value="classy-rounded">Classy Rounded</option>
                      <option value="extra-rounded">Extra Circular</option>
                    </select>
                  </div>
                </div>

                <div className="custom-select-group">
                  <label className="select-label">Eye Outer Frame</label>
                  <div className="select-wrapper">
                    <select value={cornersFrameStyle} onChange={(e) => setCornersFrameStyle(e.target.value)}>
                      <option value="square">Square</option>
                      <option value="dot">Circular Dot</option>
                      <option value="rounded">Smooth Rounded</option>
                      <option value="extra-rounded">Extra Rounded</option>
                    </select>
                  </div>
                </div>

                <div className="custom-select-group">
                  <label className="select-label">Eye Inner Ball</label>
                  <div className="select-wrapper">
                    <select value={cornersDotStyle} onChange={(e) => setCornersDotStyle(e.target.value)}>
                      <option value="square">Square</option>
                      <option value="dot">Circular Dot</option>
                      <option value="rounded">Smooth Rounded</option>
                      <option value="heart">Heart Shape</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeSubTab === 'design-icon' && (
              <div className="customizer-panel">
                <span className="sub-label">Add Custom SVG Icon</span>
                <div className="logo-file-uploader">
                  <button type="button" className="btn btn-secondary btn-full" onClick={() => document.getElementById('logo-upload-input').click()}>
                    <Upload size={16} /> Choose SVG Icon File
                  </button>
                  <input id="logo-upload-input" type="file" accept=".svg" onChange={handleLogoUpload} className="hidden" />
                  {customLogoFile ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                      <span className="file-name-text">SVG icon loaded!</span>
                      <button type="button" className="btn btn-danger btn-sm btn-auto" onClick={() => setCustomLogoFile(null)}>
                        Remove SVG Icon
                      </button>
                    </div>
                  ) : (
                    <span className="file-name-text">No SVG selected (only .svg files supported)</span>
                  )}
                </div>

                <div className={`logo-settings-wrapper ${customLogoFile ? '' : 'disabled'}`}>
                  <div className="slider-row">
                    <label className="control-label">Icon Scale:</label>
                    <span className="slider-val">{logoSize}%</span>
                  </div>
                  <input type="range" min="5" max="30" value={logoSize} onChange={(e) => setLogoSize(parseInt(e.target.value))} className="premium-range" />

                  <div className="slider-row">
                    <label className="control-label">Safe Margin:</label>
                    <span className="slider-val">{logoMargin}px</span>
                  </div>
                  <input type="range" min="0" max="25" value={logoMargin} onChange={(e) => setLogoMargin(parseInt(e.target.value))} className="premium-range" />

                  <label className="switch-checkbox-row">
                    <input type="checkbox" checked={logoCleanBg} onChange={(e) => setLogoCleanBg(e.target.checked)} />
                    <span className="switch-slider"></span>
                    <span className="switch-label">Hide code dots behind icon</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky QR Preview column */}
      <div className="preview-section-wrapper">
        <div className="preview-card card-surface sticky-element">
          <h2 className="preview-title">Live QR Preview</h2>
          
          <div className="qr-canvas-container">
            <div className="qr-canvas-shadow-glow" id="canvas-glow" />
            <div ref={canvasRef} className="qr-canvas" />
          </div>

          <div className="preview-details">
            <div className="detail-row">
              <span>Error Correction:</span>
              <div className="custom-select-group compact">
                <div className="select-wrapper">
                  <select value={errorLevel} onChange={(e) => setErrorLevel(e.target.value)}>
                    <option value="L">L (7% Recovery)</option>
                    <option value="M">M (15% Recovery)</option>
                    <option value="Q">Q (25% Recovery)</option>
                    <option value="H">H (30% Recovery - Recommended)</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="detail-row">
              <span>Resolution size:</span>
              <div className="custom-select-group compact">
                <div className="select-wrapper">
                  <select value={resolution} onChange={(e) => setResolution(parseInt(e.target.value))}>
                    <option value={350}>Standard (350x350)</option>
                    <option value={600}>High Res (600x600)</option>
                    <option value={1200}>Print Ready (1200x1200)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="divider" style={{ width: '100%' }} />

          <div className="preview-actions">
            <div className="action-row-split">
              <button onClick={() => handleDownload('png')} className="btn btn-primary">
                <Download size={16} /> Download PNG
              </button>
              <button onClick={() => handleDownload('svg')} className="btn btn-secondary">
                <FileCode size={16} /> Download SVG
              </button>
            </div>
            <button onClick={handleCopyClipboard} className="btn btn-tertiary">
              <Copy size={16} /> Copy QR Image
            </button>
            {activeType === 'profile' && (
              <button onClick={handleShareLink} className="btn btn-share">
                <Share2 size={16} /> Copy All-in-One Link
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
