import _ from 'lodash';

export function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * this will get the number of units respecting double and ropped units
 * @param {object} units object of units
 */
export function getSizeOfValidUnits(units) {
  let size = 0;

  _.forEach(units, (unit) => {
    if (unit.dropped) {
      size += 0;
    } else if (unit.double) {
      size += 2;
    } else if (!unit.dropped) {
      size += 1;
    }
  });

  return size;
}

/**
 * This will return a number with with the value of the achieved
 * @param {object} assignment object containing name, weighting, achieved
 * @param pure if you want the pure result
 */
export function getAchievedFromAssignment(assignment, pure = false) {
  if (pure) {
    return Number(assignment.achieved.replace(/[^.0-9]/g, ''));
  }

  const total = Number(assignment.achieved.replace(/[^.0-9]/g, '')) * Number(assignment.weighting.replace(/[^.0-9]/g, ''));
  return total / 100;
}

/**
 * This will return a number with with the value of the max achieved
 * @param {object} assign object containing name, weighting, achieved
 */
export function getMaxAchievedFromAssessment(assign) {
  let total = 100;

  const assignment = {
    achieved: Number(assign.achieved.replace(/[^.0-9]/g, '')),
    weighting: Number(assign.weighting.replace(/[^.0-9]/g, '')),
  };

  if (assignment.achieved > 0) {
    total = assignment.achieved * assignment.weighting;
  } else {
    total *= assignment.weighting;
  }

  return total / 100;
}

/**
 * will return a number of the whole value of a unit
 * @param {object} unit object containing the content of rows of assessments
 * @param pure if you want the pure value and not * double
 */
export function getAchievedFromUnit(unit, pure = false) {
  const { content } = unit;
  let achieved = 0;

  if (unit.dropped) {
    return achieved;
  }

  _.forEach(content, (assessment) => {
    achieved += getAchievedFromAssignment(assessment);
  });

  if (unit.double && !pure) {
    return achieved * 2;
  }

  return achieved;
}

/**
 * gets the average of a unit
 * @param unit the unit being adjusted
 * @returns {number} the average of the unit
 */
export function getAverageFromUnit(unit) {
  const { content } = unit;
  let average = 0;

  if (_.isNil(content) || _.size(content) <= 0) {
    return average;
  }

  _.forEach(content, (assessment) => {
    average += getAchievedFromAssignment(assessment, true);
  });

  const numValid = _.size(_.filter(content, (e) => Number(e.achieved.replace(/[^.0-9]/g, '')) > 0));

  if (numValid <= 0) {
    return average;
  }

  return average / numValid;
}

/**
 * will return a number of the whole value of a unit
 * @param {object} unit object containing the content of rows of assessments
 */
export function getMaxAchievedFromUnit(unit) {
  const { content } = unit;
  let achieved = 0;

  if (unit.dropped) {
    return achieved;
  }

  _.forEach(content, (assessment) => {
    achieved += getMaxAchievedFromAssessment(assessment);
  });

  if (unit.double) {
    return achieved * 2;
  }

  return achieved;
}

/**
 * will return the overall acheived of a year
 * @param {object} units object of units
 */
export function getAchievedFromUnits(units) {
  let achieved = 0;

  _.forEach(units, (unit) => {
    achieved += getAchievedFromUnit(unit);
  });

  return achieved / getSizeOfValidUnits(units);
}

/**
 * will return the overall average of a year
 * @param {object} units object of units
 */
export function getAverageFromUnits(units) {
  let average = 0;

  _.forEach(units, (unit) => {
    if (!unit.dropped) {
      average += getAverageFromUnit(unit);
    }
  });

  return average / getSizeOfValidUnits(units);
}

/**
 * returns a sorted rank list of all the units
 * @param units the list of all the units
 * @param history the current history object
 * @returns {Array|*} a array of objects
 */
export function functionRankUnitByAchieved(units, history) {
  const simpleUnits = [];

  _.forEach(units, (unit, index) => {
    simpleUnits.push({
      title: unit.title,
      link: `${history.location.search}#${index}`,
      achieved: getAchievedFromUnit(unit),
      dropped: unit.dropped,
      double: unit.double,
    });
  });

  return _.reverse(_.sortBy(simpleUnits, ['achieved']));
}

/**
 * will return the overall achieved of a year
 * @param {object} units object of units
 */
export function getMaxAchievedFromUnits(units) {
  let achieved = 0;

  _.forEach(units, (unit) => {
    achieved += getMaxAchievedFromUnit(unit);
  });

  return achieved / getSizeOfValidUnits(units);
}

export function isUnitComplete(unit) {
  let completed = true;

  if (_.isNil(unit.content)) {
    return false;
  }

  _.forEach(unit.content, (assignment) => {
    const achieved = Number(assignment.achieved);

    if (!_.isNumber(achieved) || achieved <= 0) completed = false;
  });

  return completed;
}

export function isYearCompleted(year) {
  let completed = true;

  if (_.isNil(year.units)) {
    return false;
  }

  _.forEach(year.units, (unit) => {
    if (!isUnitComplete(unit)) {
      completed = false;
    }
  });

  return completed;
}

export function getHappyEmoji() {
  const emojis = [
    '🎉',
    '🤖',
    '🎆',
    '🎈',
    '❤️',
    '💪',
    '🔥',
    '😍',
    '👨‍🎓👩‍🎓',
    '🐙',
    '🤷',
    '😈',
    '👻',
    '👽',
    '🤖',
    '💩',
    '🧐',
    '🤓',
    '😎',
    '💯',
    '💲',
  ];
  return emojis[_.random(0, emojis.length - 1)];
}
