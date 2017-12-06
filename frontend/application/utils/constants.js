const constants = {
  TABLE: {
    // Table colors for each chart
    COLORS: ['#621362', '#009FE3'],

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

    // Messages being send to be stored for request help
    HELP_MESSAGE: {
      MAX: 500,
      MIN: 15,
    },
  },

  // The attributes that will be pulled for storing for the users profile when they first sign up
  PROFILE_SELECTION: ['email', 'family_name', 'given_name', 'hd', 'name', 'picture', 'verified_email'],

};

const errors = {
  INVALID_USERNAME_CREDENTIALS_LENGTH: `Username cannot be greater than ${constants.USERNAME_MAX_LENGTH} or less than ${constants.USERNAME_MIN_LENGTH} characters long`,
};

const constantsAndErrors = Object.assign(constants, errors);

module.exports = constantsAndErrors;

