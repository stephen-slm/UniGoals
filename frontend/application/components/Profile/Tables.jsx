import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { Button, Position }  from '@blueprintjs/core';

import Table from './Table';

import style from './tables.less';

export default class Tables extends React.Component {
  constructor(props) {
    super(props);

    this.createTables = this.createTables.bind(this);

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
        removeUnitTable={this.props.removeUnitTable}
        unit={unit}
      />));
  }

  render() {
    return (
      <div className={style.tablesSizing}>
        <div className="pt-card pt-elevation-3">
        <Button className="pt-button pt-icon-plus pt-minimal" text="Add Unit" onClick={this.props.addUnitTable} />
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
  addUnitTable: PropTypes.func.isRequired,
  removeUnitTable: PropTypes.func.isRequired,
  updateUnitTitle: PropTypes.func.isRequired,
  updateRowContent: PropTypes.func.isRequired,
};
