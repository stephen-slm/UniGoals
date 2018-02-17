import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import TextField from 'material-ui/TextField';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';

import * as constants from '../../utils/constants';
import Percentages from '../Summary/Percentages';

const styles = (theme) => ({
  root: {
    margin: '25px auto',
    maxWidth: '80%',
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 3,
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
  },
  title: {
    textAlign: 'center',
  },
  tableWrapper: {
    overflow: 'auto',
    minWidth: '30%',
  },
  table: {
    maxWidth: '75%',
    margin: '0 auto',
  },
});

class UnitTable extends React.Component {
  constructor() {
    super();

    this.calculateTotal = this.calculateTotal.bind(this);

    this.state = {};
  }

  // Returns the current total to be displayed at the bottom of the table
  calculateTotal() {
    let weighting = 0;
    let achieved = 0;

    _.forEach(this.props.unit.content, (row) => {
      if (parseFloat(row.achieved) > 0 && parseFloat(row.weighting) > 0) {
        achieved += parseFloat(row.weighting) * parseFloat(row.achieved);
      }
      if (parseFloat(row.weighting) > 0) {
        weighting += parseFloat(row.weighting);
      }
    });

    return { weighting: parseInt(weighting, 10), achieved: parseFloat(achieved / 100).toFixed(2) };
  }

  render() {
    const { classes } = this.props;
    const totals = this.calculateTotal();

    return (
      <Paper className={classes.root} elevation={3}>
        <Typography className={classes.title} variant="headline" component="h5">
          {this.props.unit.title}
        </Typography>
        <Percentages height={2} unit={this.props.unit} backdrop={false} />
        <Typography component="div" className={classes.tableWrapper}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>% Weighting</TableCell>
                <TableCell>% Achieved</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {_.map(this.props.unit.content, (row, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <TextField type="text" defaultValue={row.name} />
                  </TableCell>
                  <TableCell>{row.weighting}</TableCell>
                  <TableCell>{row.achieved}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell>Total</TableCell>
                <TableCell>{totals.weighting}</TableCell>
                <TableCell>{totals.achieved}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Typography>
      </Paper>
    );
  }
}

UnitTable.propTypes = {
  firebase: PropTypes.shape({
    updateUnitRowSection: PropTypes.func,
  }).isRequired,
  yearIndex: PropTypes.string.isRequired,
  tableIndex: PropTypes.string.isRequired,
  classes: PropTypes.shape({}).isRequired,
  unit: PropTypes.shape({
    content: PropTypes.shape({}),
    title: PropTypes.string,
  }).isRequired,
  isExample: PropTypes.bool,
};

UnitTable.defaultProps = {
  isExample: false,
};

export default withStyles(styles)(UnitTable);
