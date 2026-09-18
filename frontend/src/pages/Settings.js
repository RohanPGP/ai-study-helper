import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { api } from '../utils/api';

const DIFFICULTIES = ['easy', 'medium', 'hard'];

export default function Settings() {
  const { user, refreshUser } = useAuth();

  const [theme, setThemeState] = useState(() => localStorage.getItem('theme') || 'dark');
  const setTheme = (t) => {
    setThemeState(t);
    document.documentElement.setAttribute('data-theme', t);
    localStorage.setItem('theme', t);
  };

  const [defaultDifficulty, setDefaultDifficultyState] = useState(() => localStorage.getItem('defaultDifficulty') || 'medium');
  const setDefaultDifficulty = (d) => {
    setDefaultDifficultyState(d);
    localStorage.setItem('defaultDifficulty', d);
  };

  const [name, setName] = useState(user?.name || '');
  const [nameStatus, setNameStatus] = useState('');
  const [nameSaving, setNameSaving] = useState(false);

  const saveName = async () => {
    if (!name.trim()) return;
    setNameSaving(true);
    setNameStatus('');
    try {
      await api.updateProfile({ name: name.trim() });
      await refreshUser();
      setNameStatus('success');
    } catch (err) {
      setNameStatus(err.message);
    } finally {
      setNameSaving(false);
    }
  };

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwStatus, setPwStatus] = useState('');
  const [pwSaving, setPwSaving] = useState(false);

  const savePassword = async () => {
    setPwStatus('');
    if (newPassword.length < 8) { setPwStatus('New password must be at least 8 characters.'); return; }
    if (newPassword !== confirmPassword) { setPwStatus('New passwords do not match.'); return; }
    setPwSaving(true);
    try {
      await api.changePassword({ currentPassword, newPassword });
      setPwStatus('success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPwStatus(err.message);
    } finally {
      setPwSaving(false);
    }
  };

  const toggleBtn = (active) => ({
    padding: '8px 16px', borderRadius: 'var(--radius)', fontSize: 13, fontWeight: 600,
    border: active ? 'none' : '1.5px solid var(--gray-200)',
    background: active ? 'var(--indigo-600)' : 'transparent',
    color: active ? '#fff' : 'var(--gray-500)',
    cursor: 'pointer'
  });

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 600 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 20 }}>Settings</h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card">
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Appearance</h2>
            <label className="label">Color theme</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={toggleBtn(theme === 'dark')} onClick={() => setTheme('dark')}>Dark</button>
              <button style={toggleBtn(theme === 'light')} onClick={() => setTheme('light')}>Light</button>
            </div>
          </div>

          <div className="card">
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Study preferences</h2>
            <label className="label">Default quiz difficulty</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {DIFFICULTIES.map(d => (
                <button key={d} style={toggleBtn(defaultDifficulty === d)} onClick={() => setDefaultDifficulty(d)}>
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </button>
              ))}
            </div>
            <p style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 8 }}>
              This is pre-selected whenever you upload a new file.
            </p>
          </div>

          <div className="card">
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Profile</h2>
            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="label">Display name</label>
              <input className="input" value={name} onChange={e => setName(e.target.value)} />
            </div>
            {nameStatus === 'success' && <div className="alert alert-success" style={{ marginBottom: 12 }}>Name updated.</div>}
            {nameStatus && nameStatus !== 'success' && <div className="alert alert-error" style={{ marginBottom: 12 }}>{nameStatus}</div>}
            <button className="btn btn-primary btn-sm" onClick={saveName} disabled={nameSaving}>
              {nameSaving ? 'Saving…' : 'Save name'}
            </button>
          </div>

          <div className="card">
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Password</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-group">
                <label className="label">Current password</label>
                <input className="input" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="label">New password</label>
                <input className="input" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="label">Confirm new password</label>
                <input className="input" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
              </div>
            </div>
            {pwStatus === 'success' && <div className="alert alert-success" style={{ margin: '12px 0' }}>Password updated.</div>}
            {pwStatus && pwStatus !== 'success' && <div className="alert alert-error" style={{ margin: '12px 0' }}>{pwStatus}</div>}
            <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }} onClick={savePassword} disabled={pwSaving}>
              {pwSaving ? 'Saving…' : 'Change password'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
