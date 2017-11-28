import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { HashLink as Link } from 'react-router-hash-link';

export default class TopFiveSection extends React.Component {
  /**
   * Applying the weighiting to all the units, getting the overal unit total and ordering
   * the content based on this information with title, total and a link based on the
   * current active address, this link being a hash link to the table contntes.
   *
   * Finally at the end this is reveresed as the lodash sortBy orders them based on
   * lowest to highest and we need the vice vera.
   * @param {object} data the unit data
   * @param {object} history react-router history object
   */
  static calulateTopFive(data, history) {
    if (_.size(data) === 0 || _.size(data[Object.keys(data)[0]]) === 0) {
      return 0;
    }

    const listOfTotalGrades = [];

    _.forEach(data, (unit, index) => {
      let totalAchieved = 0;

      _.forEach(unit.content, (unitContent) => {
        if (!_.isNil(unitContent.weighting) && !_.isNil(unitContent.achieved) && (unitContent.weighting !== '' && unitContent.achieved !== '')) {
          if (parseFloat(unitContent.achieved) > 0) {
            totalAchieved += parseFloat(unitContent.weighting) * parseFloat(unitContent.achieved);
          }
        }
      });

      listOfTotalGrades.push({
        title: unit.title,
        total: parseFloat(totalAchieved / 100).toFixed(2),
        link: `${history.location.search}#${index}`,
      });
    });

    return _.reverse(_.sortBy(listOfTotalGrades, o => o.total));
  }

  render() {
    const totalGrade = TopFiveSection.calulateTopFive(this.props.data, this.props.history);

    return (
      <div className={`pt-card pt-elevaton-1 ${this.props.className}`} style={{ width: 280, height: this.props.height }}>
        <div style={{ textAlign: 'center' }}>Unit Ranking</div>
        <div>
          {(_.map(totalGrade, (data, index) => (<div key={index}><Link href={`${data.link}`} to={`${data.link}`}>{index + 1}. {data.title}</Link></div>)))}
        </div>
      </div>
    );
  }
}

TopFiveSection.propTypes = {
  data: PropTypes.shape({}),
  history: PropTypes.shape({}).isRequired,
  className: PropTypes.string,
  height: PropTypes.number,
};


TopFiveSection.defaultProps = {
  data: null,
  height: null,
  className: '',
};
