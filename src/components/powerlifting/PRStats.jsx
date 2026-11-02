import { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { formatWeight, getLiftDisplayName, getLiftIcon, getWilksClass } from '../../utils/helpers';
import { Trophy, Dumbbell, Target, TrendingUp, Award } from 'lucide-react';

export function PRStats() {
  const { prs, profile, getBestPR, getTotalWeight, getWilksScore } = useApp();

  const bigThree = ['squat', 'bench', 'deadlift'];
  const total = getTotalWeight();
  const wilks = getWilksScore();

  const stats = useMemo(() => {
    return bigThree.map(lift => {
      const best = getBestPR(lift);
      return {
        lift,
        best,
        percentage: best ? (best.weight / total * 100).toFixed(1) : 0,
      };
    });
  }, [prs, total]);

  const wilksClass = getWilksClass(wilks, profile.gender);

  return (
    <div className="grid grid-3" style={{ marginBottom: '2rem' }}>
      <div className="card card-elevated" style={{ padding: '1.5rem', textAlign: 'center', background: 'linear-gradient(135deg, var(--color-bg-elevated) 0%, var(--color-bg-hover) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Trophy size={24} style={{ color: 'var(--color-warning)' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)' }}>BIG THREE TOTAL</span>
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, color: 'var(--color-primary)', lineHeight: 1.1 }}>
          {total > 0 ? formatWeight(total, profile.unit) : '—'}
        </div>
        {total > 0 && (
          <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'center', gap: '1.5rem', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
            <span>Squat: {stats[0].best ? formatWeight(stats[0].best.weight, stats[0].best.unit) : '—'}</span>
            <span>Bench: {stats[1].best ? formatWeight(stats[1].best.weight, stats[1].best.unit) : '—'}</span>
            <span>Deadlift: {stats[2].best ? formatWeight(stats[2].best.weight, stats[2].best.unit) : '—'}</span>
          </div>
        )}
      </div>

      <div className="card card-elevated" style={{ padding: '1.5rem', textAlign: 'center', background: 'linear-gradient(135deg, var(--color-bg-elevated) 0%, var(--color-bg-hover) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Target size={24} style={{ color: 'var(--color-accent)' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)' }}>WILKS SCORE</span>
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, color: wilksClass.color, lineHeight: 1.1 }}>
          {wilks > 0 ? wilks : '—'}
        </div>
        {wilks > 0 && (
          <div style={{ marginTop: '0.5rem' }}>
            <span className={`badge`} style={{ background: wilksClass.bg, color: wilksClass.color }}>
              {wilksClass.label}
            </span>
          </div>
        )}
        {!wilks && profile.bodyweight && (
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Add bodyweight to calculate</p>
        )}
      </div>

      <div className="card card-elevated" style={{ padding: '1.5rem', textAlign: 'center', background: 'linear-gradient(135deg, var(--color-bg-elevated) 0%, var(--color-bg-hover) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <TrendingUp size={24} style={{ color: 'var(--color-success)' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)' }}>TOTAL PRs</span>
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, color: 'var(--color-success)', lineHeight: 1.1 }}>
          {prs.length}
        </div>
        <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
          {new Set(prs.map(p => p.lift)).size} different lifts tracked
        </div>
      </div>

      {profile.bodyweight && (
        <div className="card" style={{ padding: '1.5rem', marginTop: '1.5rem' }}>
          <h4 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Dumbbell size={18} />
            Lift Breakdown
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {stats.map(({ lift, best, percentage }) => (
              <div key={lift} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '1.5rem', width: 40, textAlign: 'center' }}>{getLiftIcon(lift)}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 500 }}>{getLiftDisplayName(lift)}</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: best ? 'var(--color-accent)' : 'var(--color-text-muted)' }}>
                      {best ? formatWeight(best.weight, best.unit) : 'Not set'}
                    </span>
                  </div>
                  <div style={{ height: 6, background: 'var(--color-border)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${percentage}%`,
                        height: '100%',
                        background: 'var(--color-accent)',
                        borderRadius: 'var(--radius-full)',
                        transition: 'width var(--transition-slow)',
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}