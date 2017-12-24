import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { Tooltip, Position } from '@blueprintjs/core';

export default class TotalGrade extends React.Component {
  /**
   * Calulates the users unit overal grade.
   * @param {object} data user units
   */
  static calulateTotalGrade(data) {
    if (_.size(data) === 0 || _.size(data[Object.keys(data)[0]]) === 0) {
      return 0;
    }

    let totalAchieved = 0;

    _.forEach(data, (unit) => {
      _.forEach(unit.content, (unitContent) => {
        if (!_.isNil(unitContent.weighting) && !_.isNil(unitContent.achieved) && (unitContent.weighting !== '' && unitContent.achieved !== '')) {
          if (parseFloat(unitContent.achieved) > 0) {
            totalAchieved += parseFloat(unitContent.weighting) * parseFloat(unitContent.achieved);
          }
        }
      });
    });

    return parseFloat(totalAchieved / 100 / _.size(data)).toFixed(2);
  }

  render() {
    // The users total grade.
    const totalGrade = TotalGrade.calulateTotalGrade(this.props.data);

    return (
      <div className={`pt-card pt-elevation-1 ${this.props.className}`} style={{ width: 120, height: this.props.height }}>
        <div style={{ textAlign: 'center', marginTop: 25 }}>
          <div>Total Grade</div>
          <Tooltip content="Total Grade" position={Position.BOTTOM}>{`${totalGrade}%`}</Tooltip>
        </div>
      </div>
    );
  }
}

TotalGrade.propTypes = {
  data: PropTypes.shape({}),
  className: PropTypes.string,
  height: PropTypes.number,
};


TotalGrade.defaultProps = {
  data: null,
  height: null,
  className: '',
};
