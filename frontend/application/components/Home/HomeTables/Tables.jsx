import React from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';

import { Button } from '@blueprintjs/core';
import toaster from '../../../utils/toaster';

import Table from './Table';

import style from './tables.less';

export default class Tables extends React.Component {
  constructor(props) {
    super(props);

    this.createTables = this.createTables.bind(this);
    this.addUnitTable = this.addUnitTable.bind(this);
    this.addAndNavigateToTable = this.addAndNavigateToTable.bind(this);
  }

  /**
   * Inserts a new unit on firebase and on redux
   */
  addUnitTable() {
    this.props.firebase.insertUnitById()
      .then(ref => this.addAndNavigateToTable(ref))
      .catch(error => toaster.danger(error.message));
  }

  /**
   * Creates the unit in users redux and then navigates to that via a hash
   * @param {string} ref table reference hash
   */
  addAndNavigateToTable(ref) {
    this.props.addUnitTable(ref);
    const element = document.getElementById(ref);
    element.scrollIntoView();
    Promise.resolve();
  }

  /**
   * maps out every unit within a table.
   */
  createTables() {
    if (_.isNil(this.props.units)) {
      return (<div />);
    }

    let count = 0;

    return _.map(this.props.units, (unit, index) => {
      count += 1;

      return (
        <div key={index} id={`${index}`} className={`pt-card pt-elevation-3 ${style.tableWrapper}`}>
          <Table
            tableIndex={index}
            tableNum={count}
            updateRowContent={this.props.updateRowContent}
            removeUnitRow={this.props.removeUnitRow}
            insertUnitRow={this.props.insertUnitRow}
            updateUnitTitle={this.props.updateUnitTitle}
            removeUnitTable={this.props.removeUnitTable}
            firebase={this.props.firebase}
            exampleUser={this.props.exampleUser}
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
  firebase: PropTypes.shape({
    insertUnitById: PropTypes.func,
  }).isRequired,
  units: PropTypes.shape({}).isRequired,
  exampleUser: PropTypes.bool,
  insertUnitRow: PropTypes.func.isRequired,
  removeUnitRow: PropTypes.func.isRequired,
  addUnitTable: PropTypes.func.isRequired,
  removeUnitTable: PropTypes.func.isRequired,
  updateUnitTitle: PropTypes.func.isRequired,
  updateRowContent: PropTypes.func.isRequired,
};

Tables.defaultProps = {
  exampleUser: null,
};
