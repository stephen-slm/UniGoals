import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { EditableText, Button, Alert, Intent } from '@blueprintjs/core';
import ProfileUnitBarChart from '../ProfileUnitBarChart/ProfileUnitBarChart';
import AverageGrade from '../AverageGrade/AverageGrade';


import toaster from '../../../utils/toaster';
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

    this.generateTableContents = this.generateTableContents.bind(this);
    this.generateTableTopContent = this.generateTableTopContent.bind(this);

    const editMode = (!_.isNil(this.props.unit.new));

    this.state = {
      edit: editMode,
      isDeletingUnit: false,
      tableTitle: this.props.unit.title,
      tableColor: (this.props.tableNum % 2 === 0) ? '#621362' : '#009FE3',
    };
  }

  removeRowById(rowIndex) {
    if (!_.isNil(rowIndex) && _.isString(rowIndex)) {
      this.props.removeUnitRow(rowIndex, this.props.tableIndex);
      this.props.firebase.deleteUnitRowById(rowIndex, this.props.tableIndex);
    }
  }

  insertRowBelow() {
    this.props.firebase.insertUnitRowById(this.props.tableIndex)
      .then(key => this.props.insertUnitRow(key, this.props.tableIndex))
      .catch(error => toaster.danger(error.message));
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

  updateRowCententDatabase(change, rowIndex, columnIndex) {
    if (_.isNil(rowIndex) || _.isNil(columnIndex)) {
      toaster.danger('Could not update content, due to rowIndex or columnIndex being undefined!');
    }

    if (!_.isNil(change) || change !== this.props.unit.content[rowIndex][columnIndex]) {
      const { tableIndex } = this.props;
      this.props.firebase.updateUnitRowSection(change, tableIndex, rowIndex, columnIndex);
    }
  }

  updateUnitTitle(change) {
    // This means that its the same content as was already there, so there is no need to update
    // when it does not change.
    if (!_.isNil(change) || change !== this.props.unit.title) {
      this.props.updateUnitTitle(change, this.props.tableIndex);
    }
  }

  updateUnitTitleDatabase(change) {
    if (!_.isNil(change) || change !== this.props.unit.title) {
      this.props.firebase.updateUnitTitle(change, this.props.tableIndex)
        .catch(error => toaster.danger(error.message));
    }
  }


  deleteUnitTable() {
    this.showDeleteUnitBox();
    toaster.success(`Deleted ${(this.state.tableTitle === null) ? 'the' : this.state.tableTitle} unit`);
    const unitTableIndex = this.props.tableIndex;
    this.props.firebase.deleteUnitById(unitTableIndex);
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

  generateTableContents() {
    let total = 0;
    let totalGained = 0;

    const tables = _.map(this.props.unit.content, (unitContent, index) => {
      if (!_.isNil(unitContent.weighting) && !_.isNil(unitContent.archived)) {
        if (parseFloat(unitContent.archived) > 0) {
          total += parseFloat(unitContent.weighting) * parseFloat(unitContent.archived);
        }
        totalGained += parseFloat(unitContent.weighting);
      }

      return (
        <tr key={index}>
          <td>
            <EditableText
              placeholder="Section"
              maxLength="12"
              onChange={change => this.updateRowContent(change, index, 'name')}
              onConfirm={change => this.updateRowCententDatabase(change, index, 'name')}
              disabled={!this.state.edit}
              value={_.defaultTo(unitContent.name, '')}
            />
          </td>
          <td>
            <EditableText
              placeholder="% Weighting"
              maxLength="4"
              onChange={change => this.updateRowContent(change, index, 'weighting')}
              onConfirm={change => this.updateRowCententDatabase(change, index, 'weighting')}
              disabled={!this.state.edit}
              value={_.defaultTo(unitContent.weighting, '0')}
            />
          </td>
          <td>
            <EditableText
              placeholder="% Archived"
              maxLength="4"
              onChange={change => this.updateRowContent(change, index, 'archived')}
              onConfirm={change => this.updateRowCententDatabase(change, index, 'archived')}
              disabled={!this.state.edit}
              value={_.defaultTo(unitContent.archived, '0')}
            />
          </td>
          <td style={{ visibility: (this.state.edit) ? 'visible' : 'hidden' }}>
            <span onClick={() => this.removeRowById(index)} className="pt-icon-standard pt-icon-cross" />
          </td>
        </tr>
      );
    });

    tables.push((
      <tr key={tables.length}>
        <td>Total</td>
        <td>{parseInt(totalGained, 10)}</td>
        <td>{parseFloat(total / 100).toFixed(2)}</td>
      </tr>
    ));

    return tables;
  }

  generateTableTopContent() {
    const deleteUnitConfirmButtonText = (this.state.tableTitle === null) ? '' : `${this.state.tableTitle}`;
    const showDeleteUnitButton = () => { this.showDeleteUnitBox(this.props.unit.title); };
    const exitVisibilityStyle = { visibility: (this.state.edit) ? 'visible' : 'hidden' };

    return (
      <h3>
        <EditableText
          placeholder="Unit title"
          maxLength="32"
          disabled={!this.state.edit}
          onChange={change => this.updateUnitTitle(change)}
          onConfirm={change => this.updateUnitTitleDatabase(change)}
          value={this.props.unit.title}
        />
        <Button className="pt-button pt-icon-trash pt-minimal" onClick={showDeleteUnitButton} style={exitVisibilityStyle} />
        <Alert
          intent={Intent.DANGER}
          isOpen={this.state.isDeletingUnit}
          confirmButtonText={`Delete ${deleteUnitConfirmButtonText}`}
          cancelButtonText="Cancel"
          onConfirm={this.deleteUnitTable}
          onCancel={this.showDeleteUnitBox}
        >
          <p>
            Are you sure you want to delete unit <b>{this.props.unit.title}</b>?
          </p>
        </Alert>
      </h3>
    );
  }

  render() {
    const topTableContent = this.generateTableTopContent();
    const tableContent = this.generateTableContents();

    const exitVisibilityStyle = { visibility: (this.state.edit) ? 'visible' : 'hidden' };

    return (
      <div className={style.tableWrapper}>
        <div className={style.unitTable}>
          {topTableContent}
          <table className={`pt-table pt-interactive pt-condensed ${style.tablesCoreTable}`}>
            <thead>
              <tr>
                <th>Name</th>
                <th>% Weighting</th>
                <th>% Archived</th>
                {this.editOrLockTable()}
                <td style={exitVisibilityStyle}>
                  <span onClick={this.insertRowBelow} className="pt-icon-standard pt-icon-plus" />
                </td>
                <th />
              </tr>
            </thead>
            <tbody>
              {tableContent}
            </tbody>
          </table>
        </div>
        <ProfileUnitBarChart
          data={this.props.unit.content}
          color={this.state.tableColor}
          className={style.tableCoreBarChart}
        />
        <AverageGrade
          data={this.props.unit.content}
          className={style.tableCoreAverageGrade}
          height={225}
        />
      </div>
    );
  }
}


Table.propTypes = {
  firebase: PropTypes.shape().isRequired,
  unit: PropTypes.shape({
    title: PropTypes.string,
    new: PropTypes.bool,
    content: PropTypes.shape(),
  }),
  removeUnitRow: PropTypes.func.isRequired,
  insertUnitRow: PropTypes.func.isRequired,
  updateUnitTitle: PropTypes.func.isRequired,
  updateRowContent: PropTypes.func.isRequired,
  removeUnitTable: PropTypes.func.isRequired,
  tableIndex: PropTypes.string.isRequired,
  tableNum: PropTypes.number.isRequired,
};

Table.defaultProps = {
  unit: {
    content: {},
  },
};
