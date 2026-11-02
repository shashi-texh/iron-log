import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { PRForm } from '../components/powerlifting/PRForm';
import { PRList } from '../components/powerlifting/PRList';
import { PRStats } from '../components/powerlifting/PRStats';
import { showToast } from '../components/ui/Toast';
import { Plus, Filter, Download, Upload } from 'lucide-react';

export function PowerliftingPage() {
  const { prs, profile, updateProfile, addPR } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingPR, setEditingPR] = useState(null);
  const [filterLift, setFilterLift] = useState('all');
  const [unit, setUnit] = useState(profile.unit);
  const importRef = useRef(null);

  const handleExport = () => {
    if (prs.length === 0) {
      showToast('No PRs to export', 'info');
      return;
    }
    const blob = new Blob([JSON.stringify(prs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ironlog-prs-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('PRs exported', 'success');
  };

  const handleImport = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        const list = Array.isArray(data) ? data : data.prs;
        if (!Array.isArray(list)) throw new Error('Invalid file');
        const valid = list.filter(pr => pr && pr.lift && Number(pr.weight) > 0);
        valid.forEach(pr => addPR({
          lift: pr.lift,
          customLiftName: pr.customLiftName,
          weight: Number(pr.weight),
          unit: pr.unit === 'lbs' ? 'lbs' : 'kg',
          reps: Number(pr.reps) || 1,
          date: pr.date || new Date().toISOString().split('T')[0],
          note: pr.note,
        }));
        showToast(`Imported ${valid.length} PR${valid.length === 1 ? '' : 's'}`, 'success');
      } catch {
        showToast('Could not import file. Expected a JSON array of PRs.', 'error');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  useEffect(() => {
    setUnit(profile.unit);
  }, [profile.unit]);

  const handleUnitChange = (newUnit) => {
    setUnit(newUnit);
    updateProfile({ unit: newUnit });
  };

  const handleEditPR = (e) => {
    setEditingPR(e.detail);
    setShowForm(true);
  };

  useEffect(() => {
    window.addEventListener('editPR', handleEditPR);
    return () => window.removeEventListener('editPR', handleEditPR);
  }, []);

  const lifts = ['all', 'squat', 'bench', 'deadlift', 'overhead-press', 'custom'];

  return (
    <div className="page powerlifting-page">
      <div className="container">
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ marginBottom: '0.25rem' }}>Powerlifting Tracker</h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>Track your personal records for the big three and accessory lifts</p>
          </div>
          <button onClick={() => { setEditingPR(null); setShowForm(true); }} className="btn btn-primary">
            <Plus size={18} />
            Add PR
          </button>
        </div>

        <PRStats />

        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--color-bg-elevated)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
            {lifts.map(lift => (
              <button
                key={lift}
                onClick={() => setFilterLift(lift)}
                className={`btn ${filterLift === lift ? 'btn-primary' : 'btn-ghost'}`}
                style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem', borderRadius: 'var(--radius-sm)', textTransform: 'capitalize' }}
              >
                {lift === 'all' ? 'All' : lift.replace('-', ' ')}
              </button>
            ))}
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Unit:</span>
            <div style={{ display: 'flex', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              {['kg', 'lbs'].map(u => (
                <button
                  key={u}
                  onClick={() => handleUnitChange(u)}
                  className={`btn ${unit === u ? 'btn-primary' : 'btn-ghost'}`}
                  style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem', borderRadius: 0 }}
                >
                  {u.toUpperCase()}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn btn-secondary btn-icon" title="Export Data" aria-label="Export PR data" onClick={handleExport}>
                <Download size={18} />
              </button>
              <button className="btn btn-secondary btn-icon" title="Import Data" aria-label="Import PR data" onClick={() => importRef.current?.click()}>
                <Upload size={18} />
              </button>
              <input ref={importRef} type="file" accept="application/json,.json" onChange={handleImport} style={{ display: 'none' }} />
            </div>
          </div>
        </div>

        <PRList filterLift={filterLift} />
      </div>

      {showForm && (
        <PRForm
          initialData={editingPR}
          onClose={() => { setShowForm(false); setEditingPR(null); }}
        />
      )}
    </div>
  );
}