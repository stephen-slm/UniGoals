import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import Paper from 'material-ui/Paper';
import Icon from 'material-ui/Icon';

import * as constants from '../../utils/constants';

import UnitTable from '../Table/UnitTable';

const styles = (theme) => ({
  root: {
    margin: '0 auto',
    maxWidth: '75%',
    marginBottom: theme.spacing.unit * 5,
    paddingBottom: theme.spacing.unit * 3,
    [theme.breakpoints.down('md')]: {
      maxWidth: '95%',
    },
  },
  button: {
    margin: theme.spacing.unit,
  },
});

class Tables extends React.Component {
  constructor() {
    super();

    this.addTable = this.addTable.bind(this);
    this.insertTableAndNavigate = this.insertTableAndNavigate.bind(this);

    this.state = {};
  }

  /**
   * Inserts the new table into redux and navigates on the site
   * @param {string} ref reference to the new table
   */
  insertTableAndNavigate(ref) {
    this.props.addUnitTable(this.props.yearIndex, ref);
    const element = document.getElementById(ref);
    element.scrollIntoView();
    return Promise.resolve();
  }

  /**
   * Used to call the creation of the table in firebase
   * @param {string} ref reference of table
   */
  addTable() {
    if (_.size(this.props.units) >= constants.UNIT.MAX) {
      console.log(`Only a maximum of ${constants.UNIT.MAX} units at anyone time`);
    } else {
      this.props.firebase
        .insertUnitById(this.props.yearIndex)
        .then((ref) => this.insertTableAndNavigate(ref))
        .catch((error) => console.log(error.message));
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <Paper className={classes.root}>
        <Button color="primary" className={classes.button} onClick={this.addTable}>
          <Icon>add</Icon> Add Unit
        </Button>
        {_.map(this.props.units, (unit, index) => (
          <div key={index} id={`${index}`}>
            <UnitTable
              tableIndex={index}
              yearIndex={this.props.yearIndex}
              insertUnitRow={this.props.insertUnitRow}
              updateRowContent={this.props.updateRowContent}
              removeUnitRow={this.props.removeUnitRow}
              updateUnitTitle={this.props.updateUnitTitle}
              addUnitTable={this.props.addUnitTable}
              removeUnitTable={this.props.removeUnitTable}
              firebase={this.props.firebase}
              unit={unit}
            />
          </div>
        ))}
      </Paper>
    );
  }
}

Tables.propTypes = {
  yearIndex: PropTypes.string.isRequired,
  firebase: PropTypes.shape({
    insertUnitById: PropTypes.func,
  }).isRequired,
  classes: PropTypes.shape({}).isRequired,
  units: PropTypes.shape({}).isRequired,
  insertUnitRow: PropTypes.func.isRequired,
  removeUnitRow: PropTypes.func.isRequired,
  addUnitTable: PropTypes.func.isRequired,
  removeUnitTable: PropTypes.func.isRequired,
  updateUnitTitle: PropTypes.func.isRequired,
  updateRowContent: PropTypes.func.isRequired,
};

Tables.defaultProps = {};

export default withStyles(styles)(Tables);
