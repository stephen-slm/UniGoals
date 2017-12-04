import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { Tooltip, Position } from '@blueprintjs/core';

export default class AverageGrade extends React.Component {
  /**
   * Gets the average grade from the unit content, e.g the section of the unit
   * @param data [["name", "weighting", "grade"]]
   * @returns {number} The average grade
   */
  static calculateAverageGradePercent(data) {
    if (_.size(data) === 0) {
      return {
        averageGrade: 0,
        maxTotalPossible: 0,
      };
    } else if (_.size(data[Object.keys(data)[0]]) === 0) {
      return {
        averageGrade: 0,
        maxTotalPossible: 0,
      };
    }

    let total = 0;
    let maxTotalPossible = 0;

    _.forEach(data, (content) => {
      if (parseFloat(content.achieved) > 0) {
        total += parseFloat(content.achieved);
        maxTotalPossible += parseFloat(content.achieved);
      } else {
        maxTotalPossible += 100;
      }
    });

    // Using _size to get the size of the object, this is because we are using objects not arrays
    const average = parseFloat(total / _.size(data)).toFixed(2);
    const max = parseFloat(maxTotalPossible / _.size(data)).toFixed(2);

    return {
      averageGrade: (average < 0) ? 0 : average,
      maxTotalPossible: (max < 0) ? 0 : max,
    };
  }

  /**
   * Gets the average of all the active units for the user
   * @param {object} data All the units for the user
   */
  static calculateAverageGradePercentSummary(data) {
    if (_.size(data) === 0 || _.size(data[Object.keys(data)[0]]) === 0) {
      return {
        averageGrade: 0,
        maxTotalPossible: 0,
      };
    }

    let total = 0;
    let maxTotalPossible = 0;

    _.forEach(data, (unit) => {
      let tableTotal = 0;
      let tableMax = 0;

      _.forEach(unit.content, (content) => {
        if (parseFloat(content.achieved) > 0) {
          tableTotal += parseFloat(content.achieved);
          tableMax += parseFloat(content.achieved);
        } else {
          tableMax += 100;
        }
      });

      if (!_.isNil(unit.content)) {
        total += tableTotal / _.size(unit.content);
        maxTotalPossible += tableMax / _.size(unit.content);
      }
    });


    const average = parseFloat(total / _.size(data)).toFixed(2);
    const max = parseFloat(maxTotalPossible / _.size(data)).toFixed(2);

    return {
      averageGrade: (average < 0) ? 0 : average,
      maxTotalPossible: (max < 0) ? 0 : max,
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      isSummary: this.props.isSummary,
    };
  }

  render() {
    let averageGrade;
    let maxTotalPossible;

    if (this.state.isSummary) {
      ({ averageGrade, maxTotalPossible } =
        AverageGrade.calculateAverageGradePercentSummary(this.props.summaryData));
    } else {
      ({ averageGrade, maxTotalPossible } =
        AverageGrade.calculateAverageGradePercent(this.props.data));
    }

    return (
      <div className={`pt-card pt-elevation-1 ${this.props.className}`} style={{ width: this.props.width, height: this.props.height }}>
        <div style={{ margin: '60% 23%' }}>
          <Tooltip content="Average Grade" position={Position.TOP}>{`${averageGrade}%`}</Tooltip>
        </div>
        <div style={{ margin: '85% 23%' }}>
          <Tooltip content="Max Grade" position={Position.BOTTOM}>{`${maxTotalPossible}%`}</Tooltip>
        </div>
      </div>
    );
  }
}

AverageGrade.propTypes = {
  data: PropTypes.shape({}),
  summaryData: PropTypes.shape({}),
  className: PropTypes.string,
  height: PropTypes.number,
  width: PropTypes.number,
  isSummary: PropTypes.bool,
};


AverageGrade.defaultProps = {
  data: null,
  height: null,
  summaryData: null,
  className: '',
  isSummary: false,
  width: 120,
};