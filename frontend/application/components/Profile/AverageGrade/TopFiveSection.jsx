import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { HashLink as Link } from 'react-router-hash-link';

export default class TopFiveSection extends React.Component {
  static calulateTopFive(data, history) {
    if (_.size(data) === 0 || _.size(data[Object.keys(data)[0]]) === 0) {
      return 0;
    }

    const listOfTotalGrades = [];

    _.forEach(data, (unit, index) => {
      let totalArchived = 0;

      _.forEach(unit.content, (unitContent) => {
        if (!_.isNil(unitContent.weighting) && !_.isNil(unitContent.archived) && (unitContent.weighting !== '' && unitContent.archived !== '')) {
          if (parseFloat(unitContent.archived) > 0) {
            totalArchived += parseFloat(unitContent.weighting) * parseFloat(unitContent.archived);
          }
        }
      });

      listOfTotalGrades.push({
        title: unit.title,
        total: parseFloat(totalArchived / 100).toFixed(2),
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
          {(_.map(totalGrade, (data, index) => (<div key={index}><Link to={`${data.link}`}>{index + 1}. {data.title}</Link></div>)))}
        </div>
      </div>
    );
  }
}

TopFiveSection.propTypes = {
  data: PropTypes.shape({}),
  history: PropTypes.shape({}),
  className: PropTypes.string,
  height: PropTypes.number,
};


TopFiveSection.defaultProps = {
  data: null,
  height: null,
  className: '',
};
