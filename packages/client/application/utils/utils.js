import _ from 'lodash';

export function isMobileDevice() {
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    return true;
  }
  return false;
}

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
 * Applying the weighiting to all the units, getting the overal unit total and ordering
 * the content based on this information with title, total and a link based on the
 * current active address, this link being a hash link to the table contntes.
 *
 * Finally at the end this is reveresed as the lodash sortBy orders them based on
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
  const emojis = ['🎉', '🎆', '🎈', '❤️', '💪', '🔥', '😍', '👨‍🎓👩‍🎓', '🐙', '🤷'];
  return emojis[_.random(0, emojis.length - 1)];
}

export default isMobileDevice;
