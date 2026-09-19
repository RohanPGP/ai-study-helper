import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';

export default function CameraCapture() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const navigate = useNavigate();

  const [photos, setPhotos] = useState([]);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [difficulty, setDifficulty] = useState(() => localStorage.getItem('defaultDifficulty') || 'medium');
  const [error, setError] = useState('');
  const [cameraError, setCameraError] = useState('');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    let active = true;
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then(stream => {
        if (!active) { stream.getTracks().forEach(t => t.stop()); return; }
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(() => setCameraError('Could not access the camera. Check your browser permissions and try again.'));

    return () => {
      active = false;
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    };
  }, []);

  const capture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !video.videoWidth) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    canvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      setPhotos(p => [...p, { blob, url }]);
    }, 'image/jpeg', 0.9);
  };

  const removePhoto = (i) => {
    setPhotos(p => {
      URL.revokeObjectURL(p[i].url);
      return p.filter((_, idx) => idx !== i);
    });
  };

  const generate = async () => {
    if (photos.length === 0) return setError('Take at least one photo first.');
    setError('');
    setGenerating(true);

    const fd = new FormData();
    photos.forEach((p, i) => fd.append('images', p.blob, `page-${i + 1}.jpg`));
    fd.append('title', title || 'Scanned Homework');
    fd.append('subject', subject.trim());
    fd.append('difficulty', difficulty);

    try {
      await api.uploadImages(fd);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 600 }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800 }}>Scan Homework</h1>
          <p style={{ color: 'var(--gray-500)', marginTop: 4 }}>
            Take a photo of each page. When you're done, click Generate.
          </p>
        </div>

        {cameraError ? (
          <div className="alert alert-error">{cameraError}</div>
        ) : (
          <div className="card" style={{ padding: 16, marginBottom: 20 }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{ width: '100%', borderRadius: 'var(--radius)', background: '#000', display: 'block' }}
            />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <button className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: 14 }} onClick={capture}>
              📸 Capture page
            </button>
          </div>
        )}

        {photos.length > 0 && (
          <div className="card" style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>
              Captured pages ({photos.length})
            </h2>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {photos.map((p, i) => (
                <div key={i} style={{ position: 'relative' }}>
                  <img src={p.url} alt={`Page ${i + 1}`} style={{ width: 80, height: 100, objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--gray-200)' }} />
                  <button
                    onClick={() => removePhoto(i)}
                    style={{ position: 'absolute', top: -6, right: -6, width: 22, height: 22, borderRadius: '50%', background: 'var(--red-500)', color: '#fff', border: 'none', fontSize: 12, cursor: 'pointer' }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="card" style={{ marginBottom: 20 }}>
          <div className="form-group" style={{ marginBottom: 16 }}>
            <label className="label">Study pack title (optional)</label>
            <input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Chapter 7 Notes" />
          </div>
          <div className="form-group" style={{ marginBottom: 16 }}>
            <label className="label">Subject (optional)</label>
            <input className="input" value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g. Biology" />
          </div>
          <div className="form-group">
            <label className="label">Quiz difficulty</label>
            <select className="input" value={difficulty} onChange={e => setDifficulty(e.target.value)}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>}

        <button
          className="btn btn-primary btn-lg"
          style={{ width: '100%' }}
          onClick={generate}
          disabled={generating || photos.length === 0}
        >
          {generating ? '⏳ Uploading & processing…' : `🚀 Generate Study Pack (${photos.length} page${photos.length !== 1 ? 's' : ''})`}
        </button>
      </div>
    </div>
  );
}
