import _ from 'lodash';

/**
 * Checks that the active client could be a mobile device
 * @returns {boolean}
 */
export function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Gets the total achieved percentage from a single unit
 * @param unit The unit that the achieved is coming from
 * @returns {number} A percentage of the achieved
 */
export function getAchievedTotalFromUnit(unit) {
  let total = 0;

  _.forEach(unit.content, content => {
    if (
      !_.isNil(content.weighting) &&
      !_.isNil(content.achieved) &&
      (content.weighting !== '' && content.achieved !== '')
    ) {
      if (parseFloat(content.achieved) > 0) {
        total += parseFloat(content.weighting) * parseFloat(content.achieved);
      }
    }
  });

  return total;
}

/**
 * Gets the total possible grade for a standard unit
 * @param unit The unit that the grade is being gathered from
 * @returns {string}
 */
export function calculateTotalGradeStandard(unit) {
  let achieved = 0;

  _.forEach(unit, row => {
    if (parseFloat(row.achieved) > 0 && parseFloat(row.weighting) > 0) {
      achieved += parseFloat(row.weighting) * parseFloat(row.achieved);
    }
  });

  return parseFloat(achieved / 100).toFixed(2);
}

/**
 * Applying the weighting to all the units, getting the overall unit total and ordering
 * the content based on this information with title, total and a link based on the
 * current active address, this link being a hash link to the table conant's.
 *
 * Finally at the end this is reversed as the lodash sortBy orders them based on
 * lowest to highest and we need the vice vera.
 * @param {object} units the unit data
 * @param {object} history react-router history object
 */
export function calculateTopFiveRankings(units, history) {
  // return early if the size of the data is either 0 on the units or first unit data.
  if (_.size(units) <= 0 || _.size(units[Object.keys(units)[0]]) <= 0) {
    return [];
  }

  const totalGradesList = _.map(units, (unit, index) => {
    const totalAchieved = getAchievedTotalFromUnit(unit);

    return {
      title: unit.title,
      total: totalAchieved,
      link: `${history.location.search}#${index}`,
    };
  });

  return _.reverse(_.sortBy(totalGradesList, o => o.total));
}

export function getHappyEmoji() {
  const emojis = ['🎉', '🎆', '🎈', '❤️', '💪', '🔥', '😍', '👨‍🎓👩‍🎓', '🐙', '🤷', '😈', '👻', '👽', '🤖', '💩', '🧐', '🤓', '😎', '💯', '💲'];
  return emojis[_.random(0, emojis.length - 1)];
}

export default isMobileDevice;
