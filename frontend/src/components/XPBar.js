export default function XPBar({ user }) {
  if (!user) return null;
  const level = user.level || 1;
  const xpIntoLevel = user.xpIntoLevel ?? ((user.xp || 0) % 100);
  const streak = user.currentStreak || 0;

  return (
    <div className="xp-card">
      <div className="xp-card-top">
        <div className="xp-level-badge">Lv {level}</div>
        <div className="xp-bar-track">
          <div className="xp-bar-fill" style={{ width: `${xpIntoLevel}%` }} />
        </div>
        <div className="xp-amount">{xpIntoLevel}/100 XP</div>
      </div>
      {streak > 0 && (
        <div className="streak-pill">🔥 {streak} day{streak !== 1 ? 's' : ''} streak</div>
      )}
    </div>
  );
}
