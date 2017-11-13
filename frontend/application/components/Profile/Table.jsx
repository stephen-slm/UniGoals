import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { EditableText, Button, Alert, Intent } from '@blueprintjs/core';

import toaster from '../../utils/toaster';
import style from './tables.less';

export default class Table extends React.Component {
  constructor(props) {
    super(props);

    this.showEditButtons = this.showEditButtons.bind(this);
    this.showDeleteUnitBox = this.showDeleteUnitBox.bind(this);
    this.editOrLockTable = this.editOrLockTable.bind(this);
    this.insertRowBelow = this.insertRowBelow.bind(this);
    this.updateRowContent = this.updateRowContent.bind(this);
    this.deleteUnitTable = this.deleteUnitTable.bind(this);

    const editMode = (!_.isNil(this.props.unit.new));

    this.state = {
      edit: editMode,
      isDeletingUnit: false,
      tableTitle: this.props.unit.title,
    };
  }

  removeRowById(rowIndex) {
    if (!_.isNil(rowIndex) && _.isInteger(rowIndex)) {
      this.props.removeUnitRow(rowIndex, this.props.tableIndex);
    }
  }

  insertRowBelow(rowIndex) {
    this.props.insertUnitRow(rowIndex, this.props.tableIndex);
  }

  updateRowContent(change, rowIndex, columnIndex) {
    if (_.isNil(rowIndex) || _.isNil(columnIndex)) {
      toaster.danger('Could not update content, due to rowIndex or columnIndex being undefined!');
    }

    // This means that its the same content as was already there, so there is no need to update
    // when it does not change.
    if (!_.isNil(change) || change !== this.props.unit.content[rowIndex][columnIndex]) {
      this.props.updateRowContent(change, this.props.tableIndex, rowIndex, columnIndex);
    }
  }

  updateUnitTitle(change) {
    // This means that its the same content as was already there, so there is no need to update
    // when it does not change.
    if (!_.isNil(change) || change !== this.props.unit.title) {
      this.props.updateUnitTitle(change, this.props.tableIndex);
    }
  }

  deleteUnitTable() {
    this.showDeleteUnitBox();
    toaster.success(`Deleted ${(this.state.tableTitle === null) ? 'the' : this.state.tableTitle} unit`);
    const unitTableIndex = this.props.tableIndex;
    this.props.removeUnitTable(unitTableIndex);
  }

  showEditButtons() {
    this.setState({
      edit: !this.state.edit,
    });
  }

  showDeleteUnitBox(title) {
    this.setState({
      isDeletingUnit: !this.state.isDeletingUnit,
      tableTitle: title,
    });
  }

  editOrLockTable() {
    if (this.state.edit) {
      return (
        <td>
          <span tabIndex={0} role="button" onKeyDown={this.showEditButtons} onClick={this.showEditButtons}>
            <span className="pt-icon-standard pt-icon-lock" />
          </span>
        </td>
      );
    }
    return (
      <td>
        <span tabIndex={0} role="button" onKeyDown={this.showEditButtons} onClick={this.showEditButtons}>
          <span className="pt-icon-standard pt-icon-build" />
        </span>
      </td>
    );
  }

  generateTableContents(content) {
    return _.map(content, (unitContent, index) => (
      <tr key={index}>
        <td><EditableText placeholder="Section" maxLength="12" onChange={change => this.updateRowContent(change, index, 0)} disabled={!this.state.edit} value={_.defaultTo(unitContent[0], '')} /></td>
        <td><EditableText placeholder="% Weighting" maxLength="3" onChange={change => this.updateRowContent(change, index, 1)} disabled={!this.state.edit} value={_.defaultTo(unitContent[1], '')} /></td>
        <td><EditableText placeholder="% Achieved" maxLength="3" onChange={change => this.updateRowContent(change, index, 2)} disabled={!this.state.edit} value={_.defaultTo(unitContent[2], '')} /></td>
        <td style={{ visibility: (this.state.edit) ? 'visible' : 'hidden' }}>
          <span onClick={() => this.removeRowById(index)} className="pt-icon-standard pt-icon-cross" />
        </td>
        <td style={{ visibility: (this.state.edit) ? 'visible' : 'hidden' }}>
          <span onClick={() => this.insertRowBelow(index)} className="pt-icon-standard pt-icon-plus" />
        </td>
      </tr>
    ));
  }

  render() {
    const { unit } = this.props;
    const { content } = unit;

    const tableContent = this.generateTableContents(content);

    return (
      <div className={style.tablesWrapper}>
        <h3>
          <EditableText
            placeholder="Unit title"
            maxLength="32"
            disabled={!this.state.edit}
            onChange={change => this.updateUnitTitle(change)}
            value={unit.title}
          />
          <Button className="pt-button pt-icon-trash pt-minimal" onClick={() => { this.showDeleteUnitBox(unit.title); }} style={{ visibility: (this.state.edit) ? 'visible' : 'hidden' }} />
          <Alert
            intent={Intent.DANGER}
            isOpen={this.state.isDeletingUnit}
            confirmButtonText={`Delete ${this.state.tableTitle}`}
            cancelButtonText="Cancel"
            onConfirm={this.deleteUnitTable}
            onCancel={this.showDeleteUnitBox}
          >
          <p>
            Are you sure you want to delete unit <b>{this.props.unit.title}</b>?
          </p>
        </Alert>
        </h3>
        <table className={`${style.tableWidths} pt-table pt-interactive`}>
          <thead>
            <tr>
              <th>Name</th>
              <th>% Weighting</th>
              <th>% Achieved</th>
              {this.editOrLockTable()}
              <td style={{ visibility: (this.state.edit) ? 'visible' : 'hidden' }}>
                <span onClick={() => this.insertRowBelow(-1)} className="pt-icon-standard pt-icon-plus" />
              </td>
              <th />
            </tr>
          </thead>
          <tbody>
            {tableContent}
          </tbody>
        </table>
      </div>
    );
  }
}


Table.propTypes = {
  unit: PropTypes.shape({
    title: PropTypes.string,
    new: PropTypes.string,
    content: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  }).isRequired,
  removeUnitRow: PropTypes.func.isRequired,
  insertUnitRow: PropTypes.func.isRequired,
  updateUnitTitle: PropTypes.func.isRequired,
  updateRowContent: PropTypes.func.isRequired,
  removeUnitTable: PropTypes.func.isRequired,
  tableIndex: PropTypes.number.isRequired,
};
