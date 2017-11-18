import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { Button, Position }  from '@blueprintjs/core';
import toaster from '../../../utils/toaster';

import Table from './Table';

import style from './tables.less';

export default class Tables extends React.Component {
  constructor(props) {
    super(props);

    this.createTables = this.createTables.bind(this);
    this.addUnitTable = this.addUnitTable.bind(this);
  }

  addUnitTable() {
    this.props.firebase.insertUnitById()
      .then(ref => this.props.addUnitTable(ref))
      .catch(error => toaster.danger(error.message));
  }

  createTables() {
    if (_.isNil(this.props.units)) {
      return (<div />);
    }

    let count = 0;

    return _.map(this.props.units, (unit, index) => {
      count += 1;

      return (
        <div key={index} className={`pt-card pt-elevation-3 ${style.tableWrapper}`}>
          <Table
            tableIndex={index}
            tableNum={count}
            updateRowContent={this.props.updateRowContent}
            removeUnitRow={this.props.removeUnitRow}
            insertUnitRow={this.props.insertUnitRow}
            updateUnitTitle={this.props.updateUnitTitle}
            removeUnitTable={this.props.removeUnitTable}
            firebase={this.props.firebase}
            unit={unit}
          />
        </div>
      );
    });
  }

  render() {
    return (
        <div className={`pt-card pt-elevation-3 ${style.tablesWrapper}`}>
          <Button className="pt-button pt-icon-plus pt-minimal" text="Add Unit" onClick={this.addUnitTable} />
          {this.createTables()}
        </div>
    );
  }
}

Tables.propTypes = {
  firebase: PropTypes.shape().isRequired,
  units: PropTypes.shape().isRequired,
  updateUnits: PropTypes.func.isRequired,
  insertUnitRow: PropTypes.func.isRequired,
  removeUnitRow: PropTypes.func.isRequired,
  addUnitTable: PropTypes.func.isRequired,
  removeUnitTable: PropTypes.func.isRequired,
  updateUnitTitle: PropTypes.func.isRequired,
  updateRowContent: PropTypes.func.isRequired,
};
