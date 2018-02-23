// Conver constant file to this
export const YEAR = { TITLE: { MIN: 4, MAX: 20 }, MAX: 5, MIN: 1 };

export const TABLE = {
  COLORS: [[98, 19, 98], [0, 159, 227]],
  COMPLETE_COLORS: [
    'rgb(255, 99, 132)',
    'rgb(255, 205, 86)',
    'rgb(54, 162, 235)',
    'rgb(255, 159, 64)',
    'rgb(75, 192, 192)',
    'rgb(153, 102, 255)',
    'rgb(201, 203, 207)',
  ],
  NAME: {
    MAX: 12,
    MIN: 4,
  },
  WEIGHT: {
    MAX: 4,
    MIN: 0,
  },
  ACHIEVED: {
    MAX: 4,
    MIN: 0,
  },
};

// The attributes that will be pulled for storing for the users profile when they first sign up
export const PROFILE_SELECTION = ['email', 'displayName', 'photoURL', 'emailVerified'];

export const UNIT = {
  TITLE: {
    MAX: 32,
    MIN: 5,
  },

  MAX: 10,
  ENTRY_MAX: 25,
};

export const HELP_MESSAGE = {
  MAX: 500,
  MIN: 15,
};
