import React from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import Chart from 'chart.js';

import * as uuid from 'uuid/v4';

export default class HomeUnitPieChart extends React.Component {
  /**
   * Calulates the width for the bar chart, based on the number of data length
   * @param {string} width prop string
   * @param {string} dataLen length of data
   */
  static calculateWidth(width, dataLen) {
    if (!_.isNil(width)) {
      return width;
    } else if (_.isNil(dataLen)) {
      return 200;
    }

    if (20 * dataLen < 200) {
      return 200;
    }
    return 20 * dataLen;
  }

  /**
   * The data expected is an array of a object with three elements
   *
   * 0: Section Name, Defaulted to 'Section'
   * 1: Weighting: Defaulted to 0
   * 2: Archived: Defaulted to 0
   */
  constructor(props) {
    super(props);

    this.generateBarData = this.generateBarData.bind(this);
    this.uuid = uuid.default();

    this.state = {
      data: this.props.data,
      className: this.props.className,
      color: this.props.color,
      height: this.props.height,
      isSummary: this.props.isSummary,
      displayText: this.props.displayText,
    };

    this.content = this.generateBarData();
  }

  componentDidMount() { this.buildCharts(); }
  componentDidUpdate() { this.buildCharts(); }

  /**
   * generates bar chart data that is needed for the chart, the data
   * is shortnamed and used a float format for numbering
   */
  generateBarData() {
    const names = [];
    const values = [];

    _.forEach(this.state.data, (unit) => {
      const name = _.defaultTo(unit.name, 'Unit');
      names.push(name.match(/\b(\w)/g).join('').toUpperCase());
      values.push(parseFloat(unit.achieved || 0).toFixed(2));
    });

    return { names, values };
  }

  /**
   * generates bar chart data that is needed for the chart, the data and the data
   * is shortnamed but we also need to calulate the total for all units, as this
   * would be for the summary.
   */
  generateSummaryBarData() {
    const names = [];
    const values = [];

    _.forEach(this.props.data, (unit) => {
      const name = _.defaultTo(unit.title === '' ? null : unit.title, 'Unit');

      if (!_.isNil(name.split(' ')[1])) {
        names.push(name.match(/\b(\w)/g).join('').toUpperCase());
      } else {
        names.push(name.split('')[0].toUpperCase());
      }


      let total = 0;

      _.forEach(unit.content, (content) => {
        if (!_.isNil(content.weighting) && !_.isNil(content.achieved)) {
          if (parseFloat(content.achieved) > 0) {
            total += parseFloat(content.weighting) * parseFloat(content.achieved);
          }
        }
      });

      values.push((total / 100).toFixed(2));
    });

    return { names, values };
  }


  buildCharts() {
    const ctx = document.getElementById(this.uuid);
    let data;

    if (this.state.isSummary) {
      data = this.generateSummaryBarData();
    } else {
      data = this.generateBarData();
    }

    return new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.names,
        datasets: [{
          label: this.state.displayText,
          data: data.values,
          backgroundColor: this.state.color,
        }],
      },
      options: {
        animation: {
          duration: 0,
        },
      },
    });
  }

  render() {
    const width = HomeUnitPieChart.calculateWidth(this.props.width, _.size(this.props.data));

    return (
      <div
        className={`pt-card pt-elevation-1 ${this.state.className}`}
        style={{ maxWidth: width, height: this.state.height }}
      >
        <canvas id={this.uuid} width="400" height="400" />
      </div>
    );
  }
}

HomeUnitPieChart.propTypes = {
  width: PropTypes.number,
  data: PropTypes.shape({}),
  height: PropTypes.string,
  className: PropTypes.string,
  color: PropTypes.arrayOf(PropTypes.string),
  displayText: PropTypes.string,
  isSummary: PropTypes.bool,
};

HomeUnitPieChart.defaultProps = {
  width: null,
  height: 'auto',
  className: '',
  color: ['rgb(201, 203, 207)'],
  isSummary: false,
  data: {},
  displayText: 'Unit Process',
};
