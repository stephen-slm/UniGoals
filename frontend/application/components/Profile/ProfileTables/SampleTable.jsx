import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { EditableText, Button, Alert, Intent } from '@blueprintjs/core';
import ProfileUnitBarChart from '../ProfileUnitBarChart/ProfileUnitBarChart';
import AverageGrade from '../AverageGrade/AverageGrade';

import style from './tables.less';

export default class SampleTable extends React.Component {
  constructor(props) {
    super(props);

    this.showDeleteUnitBox = this.showDeleteUnitBox.bind(this);
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
      tableColor: (this.props.tableNum % 2 === 0) ? '#621362' : '#009FE3',
      editing: false,
      showDeleteUnit: false,
      showInsertRow: false,
    };
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
      if (!_.isNil(unitContent.weighting) && !_.isNil(unitContent.achieved) && (unitContent.weighting !== '' && unitContent.achieved !== '')) {
        if (parseFloat(unitContent.achieved) > 0) {
          totalAchieved += parseFloat(unitContent.weighting) * parseFloat(unitContent.achieved);
        }
        if (!_.isNil(unitContent.weighting) && unitContent.weighting !== '') {
          totalWeighting += parseFloat(unitContent.weighting);
        }
      }

      return (
        <tr key={index} onMouseEnter={this.mouseOverEdit} onMouseLeave={this.moveOutEdit}>
          <td>
            <EditableText
              placeholder="Section"
              maxLength="12"
              value={_.defaultTo(unitContent.name, '')}
            />
          </td>
          <td>
            <EditableText
              placeholder="% Weighting"
              maxLength="4"
              value={_.defaultTo(unitContent.weighting, '0')}
            />
          </td>
          <td>
            <EditableText
              placeholder="% Achieved"
              maxLength="4"
              value={_.defaultTo(unitContent.achieved, '0')}
            />
          </td>
          <td style={{ visibility: (this.state.editing) ? 'visible' : 'hidden' }}>
            <Button className="pt-button pt-minimal pt-icon-cross" />
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
    const exitVisibilityStyle = { visibility: (this.state.showDeleteUnit) ? 'visible' : 'hidden' };

    return (
      <h3 onMouseEnter={this.moveOverDeleteUnit} onMouseLeave={this.moveOverhideDeleteUnit}>
        <EditableText
          placeholder="Unit title"
          maxLength="32"
          value={this.props.unit.title}
        />
        <Button className="pt-button pt-icon-trash pt-minimal" style={exitVisibilityStyle} />
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
                  <Button className="pt-button pt-minimal pt-icon-plus" />
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


SampleTable.propTypes = {
  unit: PropTypes.shape({
    title: PropTypes.string,
    new: PropTypes.bool,
    content: PropTypes.shape({}),
  }),
  tableNum: PropTypes.number.isRequired,
};

SampleTable.defaultProps = {
  unit: {
    content: {},
  },
};
