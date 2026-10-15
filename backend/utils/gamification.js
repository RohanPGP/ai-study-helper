function levelFromXp(xp) {
  return Math.floor((xp || 0) / 100) + 1;
}

function xpIntoLevel(xp) {
  return (xp || 0) % 100;
}

// Call once per calendar day of activity. Mutates user in place; caller must save().
function touchStreak(user) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (!user.lastActiveDate) {
    user.currentStreak = 1;
  } else {
    const last = new Date(user.lastActiveDate);
    const lastDay = new Date(last.getFullYear(), last.getMonth(), last.getDate());
    const diffDays = Math.round((today - lastDay) / 86400000);

    if (diffDays === 1) {
      user.currentStreak = (user.currentStreak || 0) + 1;
    } else if (diffDays > 1) {
      user.currentStreak = 1;
    }
    // diffDays === 0 means already active today, leave streak unchanged
  }

  if (user.currentStreak > (user.longestStreak || 0)) {
    user.longestStreak = user.currentStreak;
  }
  user.lastActiveDate = now;
}

module.exports = { levelFromXp, xpIntoLevel, touchStreak };
