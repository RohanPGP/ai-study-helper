import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef();
  const navigate = useNavigate();

  const ACCEPTED = ['.pdf', '.docx', '.txt'];
  const ACCEPTED_MIME = ['application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'];

  const validateFile = (f) => {
    if (!ACCEPTED_MIME.includes(f.type)) return 'Only PDF, DOCX, and TXT files are supported.';
    if (f.size > 10 * 1024 * 1024) return 'File must be smaller than 10 MB.';
    return null;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (!f) return;
    const err = validateFile(f);
    if (err) return setError(err);
    setFile(f);
    setError('');
    if (!title) setTitle(f.name.replace(/\.[^/.]+$/, ''));
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const err = validateFile(f);
    if (err) return setError(err);
    setFile(f);
    setError('');
    if (!title) setTitle(f.name.replace(/\.[^/.]+$/, ''));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setError('Please select a file first.');
    setError('');
    setUploading(true);

    const fd = new FormData();
    fd.append('file', file);
    fd.append('title', title || file.name.replace(/\.[^/.]+$/, ''));

    try {
      await api.upload(fd);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 600 }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800 }}>Upload Homework</h1>
          <p style={{ color: 'var(--gray-500)', marginTop: 4 }}>
            Upload a PDF, Word doc, or text file. AI will generate your study pack in ~30 seconds.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Drop zone */}
          <div
            className="card"
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current.click()}
            style={{
              border: `2px dashed ${dragging ? 'var(--indigo-500)' : file ? 'var(--emerald-500)' : 'var(--gray-200)'}`,
              background: dragging ? 'var(--indigo-50)' : file ? '#f0fdf4' : 'var(--white)',
              textAlign: 'center',
              cursor: 'pointer',
              padding: '48px 24px',
              marginBottom: 24,
              transition: 'all 0.2s'
            }}
          >
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPTED.join(',')}
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            {file ? (
              <>
                <div style={{ fontSize: 44 }}>✅</div>
                <p style={{ fontWeight: 700, marginTop: 10, color: 'var(--gray-900)' }}>{file.name}</p>
                <p style={{ color: 'var(--gray-500)', fontSize: 13, marginTop: 4 }}>
                  {(file.size / 1024).toFixed(0)} KB · Click to change
                </p>
              </>
            ) : (
              <>
                <div style={{ fontSize: 44 }}>📂</div>
                <p style={{ fontWeight: 700, marginTop: 10 }}>Drop your file here</p>
                <p style={{ color: 'var(--gray-500)', fontSize: 14, marginTop: 4 }}>
                  or click to browse · PDF, DOCX, TXT · max 10 MB
                </p>
              </>
            )}
          </div>

          <div className="form-group" style={{ marginBottom: 24 }}>
            <label className="label">Study pack title (optional)</label>
            <input
              className="input"
              type="text"
              placeholder="e.g. Biology Chapter 5 – Cell Division"
              value={title}
              onChange={e => setTitle(e.target.value)}
              maxLength={200}
            />
          </div>

          {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>}

          <button
            className="btn btn-primary btn-lg"
            type="submit"
            disabled={uploading || !file}
            style={{ width: '100%' }}
          >
            {uploading
              ? '⏳ Uploading & processing…'
              : '🚀 Generate Study Pack'}
          </button>
        </form>
      </div>
    </div>
  );
}
