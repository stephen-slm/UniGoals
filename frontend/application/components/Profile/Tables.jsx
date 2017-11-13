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
      content: [[
        'Java CW1',
        '20',
        '0',
      ], [
        'Java CW',
        '20',
        '0',
      ], [
        'Java CW',
        '20',
        '0',
      ]],
    },
    {
      title: 'Computer Architecture',
      content: [[
        'CW1',
        '10',
        '0',
      ], [
        'CW2',
        '10',
        '0',
      ], [
        'CW3',
        '10',
        '0',
      ]],
    }]);
  }

  createTables() {
    if (_.isNil(this.props.units) || _.isNil(this.props.units[0])) {
      return (<div>No tables</div>);
    }

    return _.map(this.props.units, (unit, index) => (
      <Table
        key={index}
        tableIndex={index}
        updateRowContent={this.props.updateRowContent}
        removeUnitRow={this.props.removeUnitRow}
        insertUnitRow={this.props.insertUnitRow}
        updateUnitTitle={this.props.updateUnitTitle}
        unit={unit}
      />));
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
  insertUnitRow: PropTypes.func.isRequired,
  removeUnitRow: PropTypes.func.isRequired,
  updateUnitTitle: PropTypes.func.isRequired,
  updateRowContent: PropTypes.func.isRequired,
};
