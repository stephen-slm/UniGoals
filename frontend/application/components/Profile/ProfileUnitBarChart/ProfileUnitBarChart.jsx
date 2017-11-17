import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Label, Bar, Line } from 'recharts';

export default class ProfileUnitBarChart extends React.Component {
  static calculateWidth(width, dataLen) {
    if (!_.isNil(width)) {
      return width;
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
   * 2: Achieved: Defaulted to 0
   */
  constructor(props) {
    super(props);

    this.generateBarData = this.generateBarData.bind(this);

    this.state = {
      data: this.props.data,
      className: this.props.className,
      color: this.props.color,
      width: ProfileUnitBarChart.calculateWidth(this.props.width, this.props.data.length),
      height: this.props.height,
      lineOnly: this.props.lineOnly,
    };

    this.content = this.generateBarData();
  }

  generateBarData() {
    return _.map(this.state.data, (unit) => {
      const name = _.defaultTo(unit[0], 'Section');
      const { shortName: unitShortName } = unit;
      let shortName = 'Section';

      if (!_.isNil(unitShortName)) {
        shortName = unitShortName;
      } else if (!_.isNil(name) && name !== '') {
        shortName = name.match(/\b(\w)/g).join('').toUpperCase();
      }

      return { name: shortName, value: parseFloat(unit[2]) };
    });
  }

  render() {
    this.content = this.generateBarData();

    return (
      <div className={`pt-card pt-elevation-1 ${this.state.className}`} style={{ maxWidth: this.state.width, height: this.state.height }}>
        <ComposedChart margin={{ bottom: 15 }} style={{ marginLeft: '-50px' }} width={this.state.width} height={200} data={this.content}>
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="name">
            <Label value="Unit Progress" offset={0} position="bottom" />
          </XAxis>
          <YAxis />
          <Tooltip />
          {(!this.state.lineOnly) ? (<Bar dataKey="value" fill={this.state.color} />) : null }
          <Line type="monotone" dataKey="value" stroke="#ff7300" />
        </ComposedChart>
      </div>
    );
  }
}

ProfileUnitBarChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  width: PropTypes.number,
  height: PropTypes.string,
  className: PropTypes.string,
  color: PropTypes.string,
  lineOnly: PropTypes.bool,
};

ProfileUnitBarChart.defaultProps = {
  width: undefined,
  height: 'auto',
  className: '',
  color: '#009FE3',
  lineOnly: false,
};
