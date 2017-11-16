import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { EditableText, Button, Alert, Intent } from '@blueprintjs/core';
import { ComposedChart, CartesianGrid, XAxis, YAxis, Tooltip, Label, Bar, Line } from 'recharts';

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

    this.generateTableContents = this.generateTableContents.bind(this);
    this.generateTableTopContent = this.generateTableTopContent.bind(this);

    this.generateTableBarChartData = this.generateTableBarChartData.bind(this);
    this.generateTableBarChart = this.generateTableBarChart.bind(this);
    
    const editMode = (!_.isNil(this.props.unit.new));

    this.state = {
      edit: editMode,
      isDeletingUnit: false,
      tableTitle: this.props.unit.title,
      tableColor: (this.props.tableIndex % 2 === 1) ? '#621362' : '#009FE3',
      gradeData: this.generateTableBarChartData(),
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

  generateTableBarChartData() {
    let averageGrade = 0;

    const tableGraphData = _.map(this.props.unit.content, (unit) => {

      const name = _.defaultTo(unit[0], 'Section');
      const { shortName: unitShortName } = unit;
      let shortName = 'Section';

      if (!_.isNil(unitShortName)) {
        shortName = unitShortName;
      } else if (!_.isNil(name) && name !== '') {
        shortName = name.match(/\b(\w)/g).join('').toUpperCase();
      }

      averageGrade += parseFloat(unit[2]);

      return { name: shortName, value: parseFloat(unit[2]) };
    });

    return { tableGraphData, averageGrade: parseFloat(averageGrade / this.props.unit.content.length).toFixed(2) };
  }

  generateTableBarChart() {
    return (
      <div className="pt-card pt-elevation-1" style={{ maxWidth: (20 * this.props.unit.content.length < 200) ? 200 : 20 * this.props.unit.content.length, height: 'auto' }}>
        <div>
          <ComposedChart margin={{ bottom: 15 }} style={{ marginLeft: '-50px' }} width={(20 * this.props.unit.content.length < 200) ? 200 : 20 * this.props.unit.content.length} height={200} data={this.state.gradeData.tableGraphData}>
            <CartesianGrid strokeDasharray="3 3" style={{ paddingBottom: '10px' }} />
            <XAxis dataKey="name">
              <Label value="Unit Progress" offset={0} position="bottom" />
            </XAxis>
            <YAxis dataKey="value" />
            <Tooltip />
            <Bar dataKey="value" fill={this.state.tableColor} />
            <Line type="monotone" dataKey="value" stroke="#ff7300" />
          </ComposedChart>
        </div>
      </div>
    );
  }

  generateTableContents() {
    let total = 0;
    let totalGained = 0;

    const tables = _.map(this.props.unit.content, (unitContent, index) => {
      if (!_.isNil(unitContent[1]) && !_.isNil(unitContent[2])) {
        if (parseFloat(unitContent[2]) > 0) {
          total += parseFloat(unitContent[1]) * parseFloat(unitContent[2]);
        }
        totalGained += parseFloat(unitContent[1]);
      }

      return (
        <tr key={index}>
          <td><EditableText placeholder="Section" maxLength="12" onChange={change => this.updateRowContent(change, index, 0)} disabled={!this.state.edit} value={_.defaultTo(unitContent[0], '')} /></td>
          <td><EditableText placeholder="% Weighting" maxLength="4" onChange={change => this.updateRowContent(change, index, 1)} disabled={!this.state.edit} value={_.defaultTo(unitContent[1], '')} /></td>
          <td><EditableText placeholder="% Achieved" maxLength="4" onChange={change => this.updateRowContent(change, index, 2)} disabled={!this.state.edit} value={_.defaultTo(unitContent[2], '')} /></td>
          <td style={{ visibility: (this.state.edit) ? 'visible' : 'hidden' }}>
            <span onClick={() => this.removeRowById(index)} className="pt-icon-standard pt-icon-cross" />
          </td>
          <td style={{ visibility: (this.state.edit) ? 'visible' : 'hidden' }}>
            <span onClick={() => this.insertRowBelow(index)} className="pt-icon-standard pt-icon-plus" />
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
          {topTableContent}
          <table className="pt-table pt-interactive pt-condensed">
            <thead>
              <tr>
                <th>Name</th>
                <th>% Weighting</th>
                <th>% Achieved</th>
                {this.editOrLockTable()}
                <td style={exitVisibilityStyle}>
                  <span onClick={() => this.insertRowBelow(-1)} className="pt-icon-standard pt-icon-plus" />
                </td>
                <th />
              </tr>
            </thead>
            <tbody>
              {tableContent}
            </tbody>
          </table>
          {this.generateTableBarChart()}
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
