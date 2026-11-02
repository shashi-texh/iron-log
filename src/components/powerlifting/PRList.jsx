import { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatWeight, formatDate, calculate1RM, getLiftDisplayName, getLiftIcon } from '../../utils/helpers';
import { Trash2, Edit, Trophy, ChevronDown, ChevronUp } from 'lucide-react';

export function PRList({ filterLift = 'all' }) {
  const { prs, deletePR, profile } = useApp();
  const [expandedLifts, setExpandedLifts] = useState(new Set(['squat', 'bench', 'deadlift']));
  const [deletingId, setDeletingId] = useState(null);

  const lifts = ['squat', 'bench', 'deadlift', 'overhead-press'];

  const groupedPRs = useMemo(() => {
    const groups = {};
    lifts.forEach(lift => {
      groups[lift] = prs.filter(pr => pr.lift === lift).sort((a, b) => new Date(b.date) - new Date(a.date));
    });
    // Custom lifts
    const custom = prs.filter(pr => pr.lift === 'custom');
    if (custom.length > 0) groups.custom = custom.sort((a, b) => new Date(b.date) - new Date(a.date));
    return groups;
  }, [prs]);

  const visibleLifts = filterLift === 'all' ? lifts : lifts.filter(lift => lift === filterLift);

  const hasVisiblePRs = visibleLifts.some(lift => (groupedPRs[lift] || []).length > 0)
    || (filterLift === 'all' && (groupedPRs.custom || []).length > 0);

  const toggleExpand = (lift) => {
    setExpandedLifts(prev => {
      const next = new Set(prev);
      if (next.has(lift)) next.delete(lift);
      else next.add(lift);
      return next;
    });
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this PR?')) return;
    setDeletingId(id);
    await new Promise(r => setTimeout(r, 200));
    deletePR(id);
    setDeletingId(null);
    showToast('PR deleted', 'info');
  };

  const liftsToRender = filterLift === 'all' ? [...lifts, 'custom'] : [filterLift];

  if (prs.length === 0 || !hasVisiblePRs) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--color-bg-elevated)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏋️</div>
        <h3 style={{ marginBottom: '0.5rem' }}>{prs.length === 0 ? 'No PRs Yet' : 'No PRs for this lift'}</h3>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>
          {prs.length === 0 ? 'Start tracking your personal records to see them here' : 'Try a different filter or log a new PR'}
        </p>
      </div>
    );
  }

  return (
    <div>
      {liftsToRender.map(lift => {
        const liftPRs = groupedPRs[lift] || [];
        if (liftPRs.length === 0) return null;

        const bestPR = liftPRs[0];
        const isExpanded = expandedLifts.has(lift);

        return (
          <div key={lift} className="card" style={{ overflow: 'hidden' }}>
            <div
              onClick={() => toggleExpand(lift)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem', cursor: 'pointer', gap: '1rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '2rem' }}>{getLiftIcon(lift)}</span>
                <div>
                  <h3 style={{ fontSize: '1.125rem', margin: 0 }}>{getLiftDisplayName(lift)}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                    {liftPRs.length} record{liftPRs.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-accent)' }}>
                    {formatWeight(bestPR.weight, bestPR.unit)}
                  </div>
                  {bestPR.reps > 1 && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      {bestPR.reps} reps • Est. 1RM: {calculate1RM(bestPR.weight, bestPR.reps)} {bestPR.unit}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Trophy size={20} style={{ color: 'var(--color-warning)' }} />
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>
            </div>

            {isExpanded && (
              <div style={{ borderTop: '1px solid var(--color-border)' }}>
                {liftPRs.map((pr, index) => (
                  <div
                    key={pr.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1rem 1.25rem',
                      borderBottom: index < liftPRs.length - 1 ? '1px solid var(--color-border)' : 'none',
                      background: index === 0 ? 'rgba(233, 69, 96, 0.03)' : 'transparent',
                      opacity: deletingId === pr.id ? 0.5 : 1,
                      transition: 'opacity var(--transition-fast)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                      <span style={{
                        width: 28,
                        height: 28,
                        borderRadius: 'var(--radius-full)',
                        background: index === 0 ? 'var(--color-accent)' : 'var(--color-border)',
                        color: index === 0 ? 'white' : 'var(--color-text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                      }}>
                        {index + 1}
                      </span>
                      <div>
                        <div style={{ fontWeight: 600, fontFamily: 'var(--font-display)', fontSize: '1.125rem' }}>
                          {formatWeight(pr.weight, pr.unit)}
                          {pr.reps > 1 && <span style={{ fontWeight: 400, fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginLeft: '0.5rem' }}>×{pr.reps}</span>}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                          {formatDate(pr.date)} • {pr.unit === 'kg' ? 'kg' : 'lbs'}
                        </div>
                        {pr.note && (
                          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem', fontStyle: 'italic' }}>
                            {pr.note}
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => window.dispatchEvent(new CustomEvent('editPR', { detail: pr }))}
                        className="btn btn-ghost btn-icon"
                        aria-label="Edit PR"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(pr.id)}
                        className="btn btn-ghost btn-icon"
                        aria-label="Delete PR"
                        disabled={deletingId === pr.id}
                      >
                        {deletingId === pr.id ? (
                          <div style={{ width: 16, height: 16, border: '2px solid var(--color-border)', borderTopColor: 'var(--color-accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                        ) : (
                          <Trash2 size={16} style={{ color: 'var(--color-error)' }} />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {groupedPRs.custom && (
        <div className="card" style={{ overflow: 'hidden' }}>
          <div
            onClick={() => toggleExpand('custom')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem', cursor: 'pointer', gap: '1rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '2rem' }}>✏️</span>
              <div>
                <h3 style={{ fontSize: '1.125rem', margin: 0 }}>Custom Lifts</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0 }}>
                  {groupedPRs.custom.length} record{groupedPRs.custom.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            {expandedLifts.has('custom') ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>

          {expandedLifts.has('custom') && (
            <div style={{ borderTop: '1px solid var(--color-border)' }}>
              {groupedPRs.custom.map((pr, index) => (
                <div
                  key={pr.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem 1.25rem',
                    borderBottom: index < groupedPRs.custom.length - 1 ? '1px solid var(--color-border)' : 'none',
                    opacity: deletingId === pr.id ? 0.5 : 1,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                    <span style={{
                      width: 28,
                      height: 28,
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--color-border)',
                      color: 'var(--color-text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}>
                      {index + 1}
                    </span>
                    <div>
                      <div style={{ fontWeight: 600, fontFamily: 'var(--font-display)', fontSize: '1.125rem' }}>
                        {pr.customLiftName}
                        <span style={{ fontWeight: 400, fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginLeft: '0.5rem' }}>
                          {formatWeight(pr.weight, pr.unit)} ×{pr.reps}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        {formatDate(pr.date)}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => window.dispatchEvent(new CustomEvent('editPR', { detail: pr }))}
                      className="btn btn-ghost btn-icon"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(pr.id)}
                      className="btn btn-ghost btn-icon"
                      disabled={deletingId === pr.id}
                    >
                      {deletingId === pr.id ? '⏳' : <Trash2 size={16} style={{ color: 'var(--color-error)' }} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function showToast(message, type) {
  window.dispatchEvent(new CustomEvent('showToast', { detail: { message, type } }));
}