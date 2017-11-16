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


    this.props.updateUnits([{
      title: 'Intro to Programming',
      content: [
        ['Java CW', '20', '0'],
        ['PY CW', '20', '10'],
        ['QUIZ', '10', '0'],
        ['Math F Exam', '10', '0'],
        ['Math 01', '1.43', '100'],
        ['Math 02', '1.43', '100'],
        ['Math 03', '1.43', '100'],
        ['Math 04', '1.43', '100'],
        ['Math 05', '1.43', '0'],
        ['Math 06', '1.43', '30'],
        ['Math 07', '1.43', '0'],
        ['PY Exam 1', '5', '80'],
        ['PY Exam 2', '5', '100'],
        ['PY Exam 3', '5', '80'],
        ['Java Exam 1', '5', '0'],
        ['Java Exam 2', '5', '0'],
        ['Java Exam 3', '5', '50'],
      ],
    }, {
      title: 'Computer Architecture',
      content: [
        ['Coursework 1', '10', '10'],
        ['Coursework 2', '10', '22'],
        ['Coursework 3', '10', '0'],
        ['Presentation', '10', '33'],
        ['Exam', '60', '0'],
      ],
    }, {
      title: 'Database Design',
      content: [
        ['Exam', '30', '0'],
        ['Coursework 1', '15', '54'],
        ['Coursework 2', '15', '0'],
        ['Coursework 3', '40', '99'],
      ],
    }, {
      title: 'Network Fundamentals',
      content: [
        ['CW', '50', '40'],
        ['Eam', '50', '1'],
      ],
    }, {
      title: 'Web Foundation',
      content: [
        ['Review', '30', '60'],
        ['Website', '30', '33'],
        ['Exam', '40', '73'],
      ],
    }]);
  }

  createTables() {
    if (_.isNil(this.props.units) || _.isNil(this.props.units[0])) {
      return (<div />);
    }

    return _.map(this.props.units, (unit, index) => (
      <div key={index} className={`pt-card pt-elevation-3 ${style.tableWrapper}`}>
        <Table
          tableIndex={index}
          updateRowContent={this.props.updateRowContent}
          removeUnitRow={this.props.removeUnitRow}
          insertUnitRow={this.props.insertUnitRow}
          updateUnitTitle={this.props.updateUnitTitle}
          removeUnitTable={this.props.removeUnitTable}
          unit={unit}
        />
      </div>));
  }

  render() {
    return (
        <div className={`pt-card pt-elevation-3 ${style.tablesWrapper}`}>
          <Button className="pt-button pt-icon-plus pt-minimal" text="Add Unit" onClick={this.props.addUnitTable} />
          {this.createTables()}
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
