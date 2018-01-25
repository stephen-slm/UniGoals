import React from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';

import { EditableText, Button, Alert, Intent } from '@blueprintjs/core';
import HomeUnitBarChart from '../HomeUnitBarChart/HomeUnitBarChart';
import AverageGrade from '../AverageGrade/AverageGrade';

import toaster from '../../../utils/toaster';
import * as constants from '../../../utils/constants';
import style from './tables.less';

export default class Table extends React.Component {
  static validateChangeUpdate(columnIndex, change) {
    if (columnIndex === 'name' && change.length > constants.TABLE.NAME.MAX) {
      return false;
    } else if (columnIndex === 'name' && change.length < constants.TABLE.NAME.MIN) {
      return false;
    } else if (columnIndex === 'weighting' && change.length > constants.TABLE.WEIGHT.MAX) {
      return false;
    } else if (columnIndex === 'achieved' && change.length > constants.TABLE.ACHIEVED.MAX) {
      return false;
    } else if ((columnIndex === 'weighting' || columnIndex === 'achieved') && change !== '' && _.isNaN(parseInt(change, 10))) {
      return false;
    }
    return true;
  }

  constructor(props) {
    super(props);

    this.showDeleteUnitBox = this.showDeleteUnitBox.bind(this);
    this.insertRowBelow = this.insertRowBelow.bind(this);
    this.updateRowContent = this.updateRowContent.bind(this);
    this.deleteUnitTable = this.deleteUnitTable.bind(this);

    this.generateTableContents = this.generateTableContents.bind(this);
    this.generateTableTopContent = this.generateTableTopContent.bind(this);

    this.mouseOverEdit = this.mouseOverEdit.bind(this);
    this.moveOutEdit = this.moveOutEdit.bind(this);
    this.moveOverDeleteUnit = this.moveOverDeleteUnit.bind(this);
    this.moveOverhideDeleteUnit = this.moveOverhideDeleteUnit.bind(this);
    this.moveOverShowInsert = this.moveOverShowInsert.bind(this);
    this.moveHideShowInsert = this.moveHideShowInsert.bind(this);

    this.state = {
      isDeletingUnit: false,
      tableTitle: this.props.unit.title,
      tableColor: (this.props.tableNum % 2 === 0) ?
        constants.TABLE.COLORS[0] : constants.TABLE.COLORS[1],
      editing: false,
      showDeleteUnit: false,
      showInsertRow: false,
    };
  }

  /**
   * Removes a row from a unit table, requires the row key for removing from both the index
   * and from the firebase database.
   * @param {string} rowIndex the row key to remove
   */
  removeRowById(rowIndex) {
    if (!_.isNil(rowIndex) && _.isString(rowIndex)) {
      this.props.removeUnitRow(rowIndex, this.props.tableIndex);

      if (!this.props.exampleUser) {
        this.props.firebase.deleteUnitRowById(rowIndex, this.props.tableIndex);
      }
    }
  }

  /**
   * inserts a new row at the bottom of the current table, this does not require
   * any more information but the firebase will return a key which will require
   * for creating the row in the redux, (without this we cannot update this row for
   * the firebase or the redux)
   */
  insertRowBelow() {
    if (!this.props.exampleUser) {
      this.props.firebase.insertUnitRowById(this.props.tableIndex)
        .then(key => this.props.insertUnitRow(key, this.props.tableIndex))
        .catch(error => toaster.danger(error.message));
    }
  }

  /**
   * Updates a row content based on a key
   * @param {string} change the change to update
   * @param {string} rowIndex row key
   * @param {string} columnIndex column key
   */
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

  /**
   * Updates a row content based on a key on the firebase database and when updating the
   * database we also check that the table content being updated is valid with validateChangeUpdate
   * @param {string} change the change to update
   * @param {string} rowIndex row key
   * @param {string} columnIndex column key
   */
  updateRowCententDatabase(change, rowIndex, columnIndex) {
    let updatedChange = change;

    if ((columnIndex === 'achieved' || columnIndex === 'weighting') && updatedChange === '') {
      this.updateRowContent('0', rowIndex, columnIndex);
      updatedChange = '0';
    }

    if (_.isNil(rowIndex) || _.isNil(columnIndex)) {
      toaster.danger('Could not update content, due to rowIndex or columnIndex being undefined!');
    } else if (!Table.validateChangeUpdate(columnIndex, updatedChange)) {
      toaster.danger(`${columnIndex} update did not meet requirements`);
    }

    const validUpdate = updatedChange !== this.props.unit.content[rowIndex][columnIndex];

    if ((!_.isNil(updatedChange) || validUpdate) && !this.props.exampleUser) {
      const { tableIndex } = this.props;
      this.props.firebase.updateUnitRowSection(updatedChange, tableIndex, rowIndex, columnIndex);
    }
  }

  /**
   * updates a unit title
   * @param {string} change title change
   */
  updateUnitTitle(change) {
    if (!_.isNil(change) || change !== this.props.unit.title) {
      this.props.updateUnitTitle(change, this.props.tableIndex);
    }
  }

  /**
   * updates a unit title on the database
   * @param {string} change title change
   */
  updateUnitTitleDatabase(change) {
    if ((!_.isNil(change) || change !== this.props.unit.title) && !this.props.exampleUser) {
      this.props.firebase.updateUnitTitle(change, this.props.tableIndex)
        .catch(error => toaster.danger(error.message));
    }
  }


  /**
   * Removes the table (unit) completely from both firebase and redux
   */
  deleteUnitTable() {
    this.showDeleteUnitBox();
    toaster.success(`Deleted ${(this.state.tableTitle === null) ? 'the' : this.state.tableTitle} unit`);
    const unitTableIndex = this.props.tableIndex;
    this.props.removeUnitTable(unitTableIndex);

    if (!this.props.exampleUser) {
      this.props.firebase.deleteUnitById(unitTableIndex);
    }
  }

  mouseOverEdit() {
    this.setState({
      editing: true,
    });
  }

  moveOutEdit() {
    this.setState({
      editing: false,
    });
  }

  moveOverDeleteUnit() {
    this.setState({
      showDeleteUnit: true,
    });
  }

  moveOverhideDeleteUnit() {
    this.setState({
      showDeleteUnit: false,
    });
  }

  moveOverShowInsert() {
    this.setState({
      showInsertRow: true,
    });
  }

  moveHideShowInsert() {
    this.setState({
      showInsertRow: false,
    });
  }

  showDeleteUnitBox(title) {
    this.setState({
      isDeletingUnit: !this.state.isDeletingUnit,
      tableTitle: title,
    });
  }

  /**
   * Generates each row for the current table based on the content passed down from firebase
   */
  generateTableContents() {
    let totalAchieved = 0;
    let totalWeighting = 0;

    const tables = _.map(this.props.unit.content, (unitContent, index) => {
      if (parseFloat(unitContent.achieved) > 0 && parseFloat(unitContent.weighting) > 0) {
        totalAchieved += parseFloat(unitContent.weighting) * parseFloat(unitContent.achieved);
      }
      if (parseFloat(unitContent.weighting) > 0) {
        totalWeighting += parseFloat(unitContent.weighting);
      }

      return (
        <tr key={index} onMouseEnter={this.mouseOverEdit} onMouseLeave={this.moveOutEdit}>
          <td>
            <EditableText
              placeholder="Section"
              maxLength="12"
              onChange={change => this.updateRowContent(change, index, 'name')}
              onConfirm={change => this.updateRowCententDatabase(change, index, 'name')}
              value={_.defaultTo(unitContent.name, '')}
            />
          </td>
          <td>
            <EditableText
              placeholder="% Weighting"
              maxLength="4"
              onChange={change => this.updateRowContent(change, index, 'weighting')}
              onConfirm={change => this.updateRowCententDatabase(change, index, 'weighting')}
              value={_.defaultTo(unitContent.weighting, '0')}
            />
          </td>
          <td>
            <EditableText
              placeholder="% Achieved"
              maxLength="4"
              onChange={change => this.updateRowContent(change, index, 'achieved')}
              onConfirm={change => this.updateRowCententDatabase(change, index, 'achieved')}
              value={_.defaultTo(unitContent.achieved, '0')}
            />
          </td>
          <td style={{ visibility: (this.state.editing) ? 'visible' : 'hidden' }}>
            <Button onClick={() => this.removeRowById(index)} className="pt-button pt-minimal pt-icon-cross" />
          </td>
        </tr>
      );
    });

    tables.push((
      <tr key={tables.length}>
        <td>Total</td>
        <td>{parseInt(totalWeighting, 10)}</td>
        <td>{parseFloat(totalAchieved / 100).toFixed(2)}</td>
      </tr>
    ));

    return tables;
  }

  generateTableTopContent() {
    const deleteUnitConfirmButtonText = (this.state.tableTitle === null) ? '' : `${this.state.tableTitle}`;
    const showDeleteUnitButton = () => { this.showDeleteUnitBox(this.props.unit.title); };
    const exitVisibilityStyle = { visibility: (this.state.showDeleteUnit) ? 'visible' : 'hidden' };

    return (
      <h3 onMouseEnter={this.moveOverDeleteUnit} onMouseLeave={this.moveOverhideDeleteUnit}>
        <EditableText
          placeholder="Unit title"
          maxLength="32"
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

    const exitVisibilityStyle = { visibility: (this.state.showInsertRow) ? 'visible' : 'hidden' };

    return (
      <div className={style.tableWrapper}>
        <div
          className={style.unitTable}
          onMouseEnter={this.moveOverShowInsert}
          onMouseLeave={this.moveHideShowInsert}
        >
          {topTableContent}
          <table className={`pt-table pt-interactive pt-condensed ${style.tablesCoreTable}`}>
            <thead>
              <tr>
                <th>Name</th>
                <th>% Weighting</th>
                <th>% Achieved</th>
                <td style={exitVisibilityStyle}>
                  <Button onClick={this.insertRowBelow} className="pt-button pt-minimal pt-icon-plus" />
                </td>
                <th />
              </tr>
            </thead>
            <tbody>
              {tableContent}
            </tbody>
          </table>
        </div>
        <HomeUnitBarChart
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
  firebase: PropTypes.shape({
    deleteUnitById: PropTypes.func,
    updateUnitTitle: PropTypes.func,
    deleteUnitRowById: PropTypes.func,
    updateUnitRowSection: PropTypes.func,
    insertUnitRowById: PropTypes.func,
  }).isRequired,
  unit: PropTypes.shape({
    title: PropTypes.string,
    new: PropTypes.bool,
    content: PropTypes.shape({}),
  }),
  removeUnitRow: PropTypes.func.isRequired,
  insertUnitRow: PropTypes.func.isRequired,
  updateUnitTitle: PropTypes.func.isRequired,
  updateRowContent: PropTypes.func.isRequired,
  removeUnitTable: PropTypes.func.isRequired,
  tableIndex: PropTypes.string.isRequired,
  tableNum: PropTypes.number.isRequired,
  exampleUser: PropTypes.bool,
};

Table.defaultProps = {
  unit: {
    content: {},
  },
  exampleUser: false,
};
