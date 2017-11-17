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
    if (_.isNil(data) || _.isNil(data[0])) {
      return {
        averageGrade: 0,
        maxTotalPossible: 0,
      };
    }

    let total = 0;
    let maxTotalPossible = 0;

    _.forEach(data, (content) => {
      if (parseFloat(content[2]) > 0) {
        total += parseFloat(content[2]);
        maxTotalPossible += parseFloat(content[2]);
      } else {
        maxTotalPossible += 100;
      }
    });

    const average = parseFloat(total / data.length).toFixed(2);
    const max = parseFloat(maxTotalPossible / data.length).toFixed(2);

    return {
      averageGrade: (average < 0) ? 0 : average,
      maxTotalPossible: (max < 0) ? 0 : max,
    };
  }

  static calculateAverageGradePercentSummary(data) {
    if (_.isNil(data) || _.isNil(data[0])) {
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
        if (parseFloat(content[2]) > 0) {
          tableTotal += parseFloat(content[2]);
          tableMax += parseFloat(content[2]);
        } else {
          tableMax += 100;
        }
      });

      total += tableTotal / unit.content.length;
      maxTotalPossible += tableMax / unit.content.length;
    });


    const average = parseFloat(total / data.length).toFixed(2);
    const max = parseFloat(maxTotalPossible / data.length).toFixed(2);

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
      ({ averageGrade, maxTotalPossible } = AverageGrade.calculateAverageGradePercentSummary(this.props.summaryData));
    } else {
      ({ averageGrade, maxTotalPossible } = AverageGrade.calculateAverageGradePercent(this.props.data));
    }

    return (
      <div className={`pt-card pt-elevation-1 ${this.props.className}`} style={{ width: 120, height: this.props.height }}>
        <div style={{ margin: '60% 23%' }}><Tooltip content="Average Grade" position={Position.TOP}>{`${averageGrade}%`}</Tooltip></div>
        <div style={{ margin: '85% 23%' }}><Tooltip content="Max Grade" position={Position.BOTTOM}>{`${maxTotalPossible}%`}</Tooltip></div>
      </div>
    );
  }
}

AverageGrade.propTypes = {
  data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
  summaryData: PropTypes.arrayOf(PropTypes.shape()),
  className: PropTypes.string,
  height: PropTypes.number,
  isSummary: PropTypes.bool,
};


AverageGrade.defaultProps = {
  height: null,
  data: [],
  summaryData: [],
  className: '',
  isSummary: false,
};
