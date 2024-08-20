// Function to determine the user's level based on coins

export const LEVELS = [
  { name: "Novice Navigator", minPoint: 0 },
  { name: "Apprentice Achiever", minPoint: 3162 },
  { name: "Skill Seeker", minPoint: 10000 },
  { name: "Craftsmen Champion", minPoint: 31623 },
  { name: "Expert Explorer", minPoint: 1000000 },
  { name: "Master of Mastery", minPoint: 316227 },
  { name: "Grandmaster", minPoint: 1000000 },
  { name: "Legendary Pro", minPoint: 3162277 },
  { name: "Epic Tycoon", minPoint: 10000000 },
  { name: "Infinity Mogul", minPoint: 100000000 },
];

export function determineCurrentLevel(coins: number): number {
  return LEVELS.reduce((acc, level, index) => {
    if (coins >= level.minPoint) {
      return index;
    }
    return acc;
  }, 0);
}

export const calculateProgress = (coins: number) => {
  const currentLevelIndex = determineCurrentLevel(coins);
  const currentLevel = LEVELS[currentLevelIndex];
  const nextLevel = LEVELS[currentLevelIndex + 1];

  if (!nextLevel) {
    return 100; // User is at the highest level
  }

  const progress =
    ((coins - currentLevel.minPoint) /
      (nextLevel.minPoint - currentLevel.minPoint)) *
    100;
  return Math.min(progress, 100); // Ensure progress does not exceed 100%
};
