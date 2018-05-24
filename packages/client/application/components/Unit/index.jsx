import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';

import { getAchievedFromUnit } from '../../utils/utils';
import * as constants from '../../utils/constants';

import Settings from './Settings';
import EditableText from '../Utilities/EditableText';
import Percentages from '../Summary/Percentages';

const styles = (theme) => ({
  root: {
    margin: '25px auto',
    maxWidth: '80%',
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 3,
  },
  title: {
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.87)',
    fontSize: '1.5rem',
    fontWeight: '400',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  tableWrapper: {
    overflow: 'auto',
    minWidth: '30%',
    '-webkit-overflow-scrolling': 'touch',
  },
  table: {
    overflow: 'auto',
    maxWidth: '75%',
    margin: '0 auto',
  },
});

class UnitTable extends React.Component {
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

  constructor() {
    super();

    this.state = {
      showInsertRow: false,
    };
  }

  /**
   * Updates the units double weighted value to the flipped value of the current
   */
  setUnitDoubleWeightedValue = () => {
    const { yearIndex, tableIndex } = this.props;
    const { double } = this.props.unit;

    this.props.setUnitDoubleWeightStatus(yearIndex, tableIndex, !double);
    this.props.firebase.setUnitDoubleWeightStatus(yearIndex, tableIndex, !double);
  };

  /**
   * Updates the units double weighted value to the flipped value of the current
   */
  setUnitDroppedValue = () => {
    const { yearIndex, tableIndex } = this.props;
    const { dropped } = this.props.unit;

    this.props.setUnitDroppedStatus(yearIndex, tableIndex, !dropped);
    this.props.firebase.setUnitDroppedStatus(yearIndex, tableIndex, !dropped);
  };

  moveOverShowInsert = () => {
    this.setState({
      showInsertRow: true,
    });
  };

  moveHideShowInsert = () => {
    this.setState({
      showInsertRow: false,
    });
  };

  /**
   * Updates a row content based on a key on the firebase database and when updating the
   * database we also check that the table content being updated is valid with validateChangeUpdate
   * @param {string} change the change to update
   * @param {string} rowIndex row key
   * @param {string} columnIndex column key
   */
  updateRowContentDatabase = (change, rowIndex, columnIndex) => {
    if (this.props.isExample) return;

    let updatedChange = change;

    if ((columnIndex === 'achieved' || columnIndex === 'weighting') && updatedChange === '') {
      this.updateRowContent('0', rowIndex, columnIndex);
      updatedChange = '0';
    }

    if (_.isNil(rowIndex) || _.isNil(columnIndex)) {
      return;
      // TODO: Could not update content, due to rowIndex or columnIndex being undefined!
    } else if (!UnitTable.validateChangeUpdate(columnIndex, updatedChange)) {
      return;
      // TODO: `${columnIndex} update did not meet requirements`
    }

    const validUpdate = updatedChange !== this.props.unit.content[rowIndex][columnIndex];

    if ((!_.isNil(updatedChange) || validUpdate) && !this.props.isExample) {
      const { tableIndex, yearIndex } = this.props;
      this.props.firebase.updateUnitRowSection(updatedChange, yearIndex, tableIndex, rowIndex, columnIndex);
    }
  };

  /**
   * Updates a row content based on a key
   * @param {string} change the change to update
   * @param {string} rowIndex row key
   * @param {string} columnIndex column key
   */
  updateRowContent = (change, rowIndex, columnIndex) => {
    if (this.props.isExample) return;

    if (_.isNil(rowIndex) || _.isNil(columnIndex)) {
      return;
      // TODO: Could not update content, due to rowIndex or columnIndex being undefined!
    }

    const { yearIndex, tableIndex } = this.props;

    // This means that its the same content as was already there, so there is no need to update
    // when it does not change.
    if (!_.isNil(change) || change !== this.props.unit.content[rowIndex][columnIndex]) {
      this.props.updateRowContent(change, yearIndex, tableIndex, rowIndex, columnIndex);
    }
  };

  /**
   * Removes a row from a unit table, requires the row key for removing from both the index
   * and from the firebase database.
   * @param {string} rowIndex the row key to remove
   */
  removeRowById = (rowIndex) => {
    if (this.props.isExample) return;

    const { yearIndex, tableIndex } = this.props;

    if (!_.isNil(rowIndex) && _.isString(rowIndex)) {
      this.props.removeUnitRow(yearIndex, rowIndex, tableIndex);
      this.props.firebase.deleteUnitRowById(yearIndex, rowIndex, tableIndex);
    }
  };

  /**
   * Removes the table (unit) completely from both firebase and redux
   */
  deleteUnitTable = () => {
    if (this.props.isExample) return;

    console.log(`Deleted ${this.props.unit.title === null ? 'the' : this.props.unit.title} unit`);
    const { tableIndex: unitTableIndex, yearIndex } = this.props;

    this.props.removeUnitTable(yearIndex, unitTableIndex);
    this.props.firebase.deleteUnitById(yearIndex, unitTableIndex);
  };

  /**
   * updates a unit title on the database
   * @param {string} change title change
   */
  updateUnitTitleDatabase = (change) => {
    if ((!_.isNil(change) || change !== this.props.unit.title) && !this.props.isExample) {
      this.props.firebase.updateUnitTitle(change, this.props.yearIndex, this.props.tableIndex).catch((error) => console.log(error.message));
    }
  };

  /**
   * updates a unit title
   * @param {string} change title change
   */
  updateUnitTitle = (change) => {
    if (!_.isNil(change) || change !== this.props.unit.title) {
      this.props.updateUnitTitle(change, this.props.yearIndex, this.props.tableIndex);
    }
  };

  /**
   * inserts a new row at the bottom of the current table, this does not require
   * any more information but the firebase will return a key which will require
   * for creating the row in the redux, (without this we cannot update this row for
   * the firebase or the redux)
   */
  insertRowBelow = () => {
    if (this.props.isExample) return;

    const { tableIndex, yearIndex } = this.props;

    if (_.size(this.props.unit.content) >= constants.UNIT.ENTRY_MAX) {
      console.log(`Only a maximum of ${constants.UNIT.ENTRY_MAX} rows at anyone time per unit.`);
    } else {
      this.props.firebase
        .insertUnitRowById(yearIndex, tableIndex)
        .then((key) => this.props.insertUnitRow(key, yearIndex, tableIndex))
        .catch((error) => console.log(error.message));
    }
  };

  render() {
    const { classes } = this.props;
    const totals = {
      achieved: getAchievedFromUnit(this.props.unit, this.props.unit.double).toFixed(2),
      weighting: 0,
    };

    return (
      <Paper className={classes.root} elevation={3}>
        <Grid container justify="center" alignItems="center">
          <Grid item xs={1} />
          <Grid item xs={10} style={{ textAlign: 'center' }}>
            <EditableText
              className={classes.title}
              maxLength={constants.UNIT.TITLE.MAX}
              onChange={this.updateUnitTitle}
              onConfirm={this.updateUnitTitleDatabase}
              value={this.props.unit.title}
              variant="headline"
              type="h5"
            />
          </Grid>
          <Grid item xs={1} style={{ paddingRight: '5px' }}>
            <Settings
              unit={this.props.unit}
              deleteUnitTable={this.deleteUnitTable}
              setUnitDoubleWeightedValue={this.setUnitDoubleWeightedValue}
              setUnitDroppedValue={this.setUnitDroppedValue}
            />
          </Grid>
        </Grid>
        <Percentages height={2} unit={this.props.unit} backdrop={false} />
        <Typography
          component="div"
          className={classes.tableWrapper}
          onMouseEnter={this.moveOverShowInsert}
          onMouseLeave={this.moveHideShowInsert}
          onTouchStart={this.moveOverShowInsert}
          style={{ gridColumn: 'col / span 4', gridRow: '3' }}
        >
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>% Weighting</TableCell>
                <TableCell>% Achieved</TableCell>
                <TableCell
                  style={{
                    visibility: this.state.showInsertRow ? 'visible' : 'hidden',
                  }}
                >
                  <IconButton onClick={this.insertRowBelow}>
                    <Icon color="primary">add</Icon>
                  </IconButton>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {_.map(this.props.unit.content, (row, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <EditableText
                      placeholder="Section"
                      maxLength={constants.TABLE.NAME.MAX}
                      onChange={(change) => this.updateRowContent(change, index, 'name')}
                      onConfirm={(change) => this.updateRowContentDatabase(change, index, 'name')}
                      value={_.defaultTo(row.name, 'Section')}
                    />
                  </TableCell>
                  <TableCell>
                    <EditableText
                      placeholder="% Weighting"
                      maxLength={constants.TABLE.WEIGHT.MAX}
                      onChange={(change) => this.updateRowContent(change, index, 'weighting')}
                      onConfirm={(change) => this.updateRowContentDatabase(change, index, 'weighting')}
                      value={_.defaultTo(row.weighting, '0')}
                    />
                  </TableCell>
                  <TableCell>
                    <EditableText
                      placeholder="% Achieved"
                      maxLength={constants.TABLE.ACHIEVED.MAX}
                      onChange={(change) => this.updateRowContent(change, index, 'achieved')}
                      onConfirm={(change) => this.updateRowContentDatabase(change, index, 'achieved')}
                      value={_.defaultTo(row.achieved, '0')}
                    />
                  </TableCell>
                  <TableCell
                    style={{
                      visibility: this.state.showInsertRow ? 'visible' : 'hidden',
                    }}
                  >
                    <IconButton onClick={() => this.removeRowById(index)}>
                      <Icon color="secondary">clear</Icon>
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell>Total</TableCell>
                <TableCell>{totals.weighting}</TableCell>
                <TableCell>{totals.achieved}</TableCell>
                <TableCell
                  style={{
                    visibility: this.state.showInsertRow ? 'visible' : 'hidden',
                  }}
                />
              </TableRow>
            </TableBody>
          </Table>
        </Typography>
      </Paper>
    );
  }
}

UnitTable.propTypes = {
  updateRowContent: PropTypes.func,
  removeUnitRow: PropTypes.func,
  setUnitDoubleWeightStatus: PropTypes.func.isRequired,
  setUnitDroppedStatus: PropTypes.func.isRequired,
  insertUnitRow: PropTypes.func,
  updateUnitTitle: PropTypes.func,
  removeUnitTable: PropTypes.func,
  firebase: PropTypes.shape({
    setUnitDoubleWeightStatus: PropTypes.func,
    setUnitDroppedStatus: PropTypes.func,
    deleteUnitById: PropTypes.func,
    updateUnitTitle: PropTypes.func,
    deleteUnitRowById: PropTypes.func,
    insertUnitRowById: PropTypes.func,
    updateUnitRowSection: PropTypes.func,
  }).isRequired,
  yearIndex: PropTypes.string.isRequired,
  tableIndex: PropTypes.string.isRequired,
  classes: PropTypes.shape({}).isRequired,
  unit: PropTypes.shape({
    content: PropTypes.shape({}),
    title: PropTypes.string,
    double: PropTypes.bool,
    dropped: PropTypes.bool,
  }).isRequired,
  isExample: PropTypes.bool,
};

UnitTable.defaultProps = {
  isExample: false,
  updateRowContent: () => {},
  removeUnitRow: () => {},
  insertUnitRow: () => {},
  updateUnitTitle: () => {},
  removeUnitTable: () => {},
};

export default withStyles(styles)(UnitTable);
