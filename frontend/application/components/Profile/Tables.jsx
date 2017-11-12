import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Table from './Table';

import style from './tables.less';

export default class Tables extends React.Component {
  constructor(props) {
    super(props);

    this.createTables = this.createTables.bind(this);
    this.units = this.props.units;

    // TODO: remove this after backend is done
    this.props.updateUnits([{
      title: 'Introduction to programming',
      content: [{
        name: 'Java CW',
        weighting: '20',
        achieved: '0',
      }, {
        name: 'Java CW',
        weighting: '20',
        achieved: '0',
      }, {
        name: 'Java CW',
        weighting: '20',
        achieved: '0',
      }],
    },
    {
      title: 'Computer Architecture',
      content: [{
        name: 'CW1',
        weighting: '10',
        achieved: '0',
      }, {
        name: 'CW2',
        weighting: '10',
        achieved: '0',
      }, {
        name: 'CW3',
        weighting: '10',
        achieved: '0',
      }],
    }]);
  }

  createTables() {
    if (_.isNil(this.props.units) || _.isNil(this.props.units[0])) {
      return (<div>No tables</div>);
    }

    return _.map(this.props.units, (unit, index) => <Table key={index} unit={unit} />);
  }

  render() {
    return (
      <div className={style.tablesSizing}>
        <div className="pt-card pt-elevation-3">
          {this.createTables()}
        </div>
      </div>
    );
  }
}

Tables.propTypes = {
  units: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  updateUnits: PropTypes.func.isRequired,
};
