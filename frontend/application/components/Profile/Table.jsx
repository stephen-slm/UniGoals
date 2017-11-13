import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { Dialog, Button } from '@blueprintjs/core';
import toaster from '../../utils/toaster';


export default class Table extends React.Component {
  constructor(props) {
    super(props);

    this.showEditButtons = this.showEditButtons.bind(this);
    this.editOrLockTable = this.editOrLockTable.bind(this);
    this.showRowDeleteBox = this.showRowDeleteBox.bind(this);
    this.removeRowByIdAndTitle = this.removeRowByIdAndTitle.bind(this);
    this.insertRowBelow = this.insertRowBelow.bind(this);

    this.state = {
      edit: false,
      showRowDeleteBox: false,
      canEscapeKeyClose: true,
      activeContent: {
        name: '',
      },
      activeIndex: null,
    };
  }

  removeRowByIdAndTitle() {
    this.showRowDeleteBox();

    if (_.isNil(this.state.activeIndex)) {
      toaster.danger('Cannot remove row because of no active index!');
    } else if (_.isNil(this.state.activeContent)) {
      toaster.danger('Cannot remove row because of no active unit content!');
    } else {
      this.props.removeUnitRow(this.state.activeIndex, this.props.unit.title);
    }
  }

  insertRowBelow(unitTitle, rowIndex) {
    this.props.insertUnitRow(rowIndex, unitTitle);
  }

  showRowDeleteBox(unitContent = { name: null }, index = 0) {
    this.setState({
      showRowDeleteBox: !this.state.showRowDeleteBox,
      activeContent: unitContent,
      activeIndex: index,
    });
  }

  showEditButtons() {
    this.setState({
      edit: !this.state.edit,
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

  render() {
    const { unit } = this.props;
    const { content } = unit;

    return (
      <div>
        <h3>{unit.title}</h3>
        <table className="pt-table pt-interactive">
          <thead>
            <tr>
              <th>Name</th>
              <th>Weighting</th>
              <th>% Achieved</th>
              {this.editOrLockTable()}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {_.map(content, (unitContent, index) => {
              return (
                <tr key={index}>
                  <td>{unitContent.name}</td>
                  <td>{unitContent.weighting}</td>
                  <td>{unitContent.achieved}</td>
                  <td style={{ visibility: (this.state.edit) ? 'visible' : 'hidden' }}>
                  <span onClick={() => this.showRowDeleteBox(unitContent, index)} className="pt-icon-standard pt-icon-cross" />
                  <Dialog
                    iconName="pt-icon-trash"
                    title={`Removing ${this.state.activeContent.name} - row ${this.state.activeIndex + 1}`}
                    isOpen={this.state.showRowDeleteBox}
                    onClose={this.showRowDeleteBox}
                    canEscapeKeyClose={this.state.canEscapeKeyClose}
                  >
                    <div className="pt-dialog-body">
                      Do you want to delete
                      <b> {this.state.activeContent.name} </b>
                      on
                      <b> row {this.state.activeIndex + 1} </b>
                      from
                      <b> {this.props.unit.title}</b>?
                    </div>
                    <div className="pt-dialog-footer">
                      <div className="pt-dialog-footer-actions">
                        <Button onClick={this.removeRowByIdAndTitle} text="Yes" />
                        <Button onClick={this.showRowDeleteBox} text="No" />
                      </div>
                    </div>
                  </Dialog>
                </td>
                <td style={{ visibility: (this.state.edit) ? 'visible' : 'hidden' }}>
                  <span onClick={() => this.insertRowBelow(this.props.unit.title, index)} className="pt-icon-standard pt-icon-plus" />
                </td>
                </tr>
              );
            })}
            </tbody>
        </table>
      </div>
    );
  }
}


Table.propTypes = {
  unit: PropTypes.shape({
    title: PropTypes.string.isRequired,
    content: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      weighting: PropTypes.string.isRequired,
      achieved: PropTypes.string.isRequired,
    })).isRequired,
  }).isRequired,
  removeUnitRow: PropTypes.func.isRequired,
  insertUnitRow: PropTypes.func.isRequired,
};
