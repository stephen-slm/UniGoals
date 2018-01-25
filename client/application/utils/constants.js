const constants = {
  TABLE: {
    // Table colors for each chart
    COLORS: [[98, 19, 98], [0, 159, 227]],
    COMPLETE_COLORS: [
      'rgb(255, 99, 132)',
      'rgb(255, 205, 86)',
      'rgb(54, 162, 235)',
      'rgb(255, 159, 64)',
      'rgb(75, 192, 192)',
      'rgb(153, 102, 255)',
      'rgb(201, 203, 207)'],

    // Each table column content limits
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
  },

  // The attributes that will be pulled for storing for the users profile when they first sign up
  PROFILE_SELECTION: ['email', 'family_name', 'given_name', 'hd', 'name', 'picture', 'verified_email'],

  // Messages being send to be stored for request help
  HELP_MESSAGE: {
    MAX: 500,
    MIN: 15,
  },
};

const errors = {
  INVALID_USERNAME_CREDENTIALS_LENGTH: `Username cannot be greater than ${constants.USERNAME_MAX_LENGTH} or less than ${constants.USERNAME_MIN_LENGTH} characters long`,
};

const constantsAndErrors = Object.assign(constants, errors);

module.exports = constantsAndErrors;

