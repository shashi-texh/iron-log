export function formatWeight(weight, unit, decimals = 1) {
  return `${Number(weight).toFixed(decimals)} ${unit}`;
}

export function formatDate(dateString, options) {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  return new Date(dateString).toLocaleDateString(undefined, options || defaultOptions);
}

export function formatDateTime(dateString) {
  return new Date(dateString).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(num) {
  return new Intl.NumberFormat().format(num);
}

export function calculate1RM(weight, reps) {
  if (reps <= 1) return weight;
  // Epley formula
  return Math.round(weight * (1 + reps / 30) * 10) / 10;
}

export function calculateRepsAtPercentage(oneRM, percentage) {
  const percentages = [50, 55, 60, 65, 70, 75, 80, 85, 90, 95];
  return percentages
    .filter(p => p <= percentage)
    .map(p => ({
      weight: Math.round(oneRM * (p / 100) * 2) / 2,
      reps: Math.max(1, Math.round(30 / (oneRM / (oneRM * (p / 100)) - 1))),
    }));
}

export function getLiftDisplayName(lift) {
  const names = {
    squat: 'Squat',
    bench: 'Bench Press',
    deadlift: 'Deadlift',
    'overhead-press': 'Overhead Press',
    custom: 'Custom Lift',
  };
  return names[lift] || lift;
}

export function getLiftIcon(lift) {
  const icons = {
    squat: '🏋️',
    bench: '💪',
    deadlift: '🏋️‍♂️',
    'overhead-press': '🏋️‍♀️',
  };
  return icons[lift] || '🏋️';
}

export function getCategoryColor(category) {
  const colors = {
    workout: 'var(--color-accent)',
    nutrition: 'var(--color-success)',
    recovery: '#3498db',
    general: 'var(--color-text-secondary)',
  };
  return colors[category] || colors.general;
}

export function getCategoryLabel(category) {
  const labels = {
    workout: 'Workout',
    nutrition: 'Nutrition',
    recovery: 'Recovery',
    general: 'General',
  };
  return labels[category] || category;
}

export function getPriorityColor(priority) {
  const colors = {
    low: 'var(--color-text-muted)',
    medium: 'var(--color-warning)',
    high: 'var(--color-error)',
  };
  return colors[priority] || colors.low;
}

export function getPriorityLabel(priority) {
  const labels = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
  };
  return labels[priority] || priority;
}

export function getWilksClass(wilks, gender) {
  if (wilks === 0) return { label: 'Not calculated', color: 'var(--color-text-muted)', bg: 'var(--color-border)' };
  if (!gender) return { label: 'Set gender in profile', color: 'var(--color-text-muted)', bg: 'var(--color-border)' };

  const thresholds = gender === 'female'
    ? { elite: 450, advanced: 380, intermediate: 300, novice: 220 }
    : { elite: 500, advanced: 410, intermediate: 320, novice: 240 };

  if (wilks >= thresholds.elite) return { label: 'Elite', color: '#f39c12', bg: 'rgba(243, 156, 18, 0.15)' };
  if (wilks >= thresholds.advanced) return { label: 'Advanced', color: '#e94560', bg: 'rgba(233, 69, 96, 0.15)' };
  if (wilks >= thresholds.intermediate) return { label: 'Intermediate', color: '#3498db', bg: 'rgba(52, 152, 219, 0.15)' };
  if (wilks >= thresholds.novice) return { label: 'Novice', color: '#2ecc71', bg: 'rgba(46, 204, 113, 0.15)' };
  return { label: 'Beginner', color: 'var(--color-text-secondary)', bg: 'var(--color-border)' };
}

export function debounce(fn, ms) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), ms);
  };
}

export function throttle(fn, ms) {
  let lastCall = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastCall >= ms) {
      lastCall = now;
      fn(...args);
    }
  };
}

export function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncate(text, length) {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '...';
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}