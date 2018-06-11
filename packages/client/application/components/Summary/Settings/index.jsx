import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';

import { withSnackbar } from '../../Utilities/SnackbarWrapper';
import ModuleWrapper from '../../Utilities/ModuleWrapper';
import * as exportings from '../../../utils/export';

import { getAchievedFromUnit } from '../../../utils/utils';

const styles = (theme) => ({
  button: {
    margin: theme.spacing.unit,
  },
  settingsButton: {
    float: 'right',
    '&:hover': {
      backgroundColor: 'inherit',
      color: 'black',
    },
  },
});

class Settings extends React.Component {
  state = {
    open: false,
    isDeletingUnit: false,
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  showDeleteUnitBox = () => {
    this.setState({
      isDeletingUnit: !this.state.isDeletingUnit,
      tableTitle: this.state.tableTitle,
    });
  };

  exportToCSV = () => {
    exportings.exportYearToCsv(this.props.year);
    this.props.snackbar.showMessage(`Exporting year ${this.props.year.title} to csv`);
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
        <IconButton className={classes.settingsButton} onClick={this.handleClickOpen}>
          <Icon>more_vert</Icon>
        </IconButton>
        <ModuleWrapper
          description={`Are you sure you wish to delete ${this.props.year.title}?`}
          disabled={this.props.isExample}
          open={this.state.isDeletingUnit}
          title={`Deleting ${this.props.year.title}`}
          onComplete={this.props.deleteYear}
          onClose={this.showDeleteUnitBox}
          completeText="Delete"
        />
        <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Settings - {this.props.year.title}</DialogTitle>
          <DialogContent>
            <Grid container spacing={8} justify="center" alignItems="center" style={{ flexGrow: 1 }}>
              <Grid item>
                <Button color="primary" className={classes.button} onClick={this.exportToCSV}>
                  Export CSV
                </Button>
              </Grid>
              <Grid item />
            </Grid>
            <Grid style={{ flex: '1' }}>
              <Typography variant="subheading">Units</Typography>
              {_.map(this.props.year.units, (unit, index) => (
                <Grid container key={index}>
                  <Grid item xs={10}>
                    <Typography variant="caption">{unit.title}</Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant="caption">{getAchievedFromUnit(unit, unit.double).toFixed(2)}%</Typography>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </DialogContent>
          <DialogActions style={{ display: 'block' }}>
            <Button style={{ float: 'left' }} onClick={this.showDeleteUnitBox} color="primary">
              Delete
            </Button>
            <Button style={{ float: 'right' }} onClick={this.handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

Settings.propTypes = {
  isExample: PropTypes.bool,
  deleteYear: PropTypes.func.isRequired,
  classes: PropTypes.shape().isRequired,
  year: PropTypes.shape({
    title: PropTypes.string,
    units: PropTypes.shape({}),
  }).isRequired,
  snackbar: PropTypes.shape({
    showMessage: PropTypes.func,
  }).isRequired,
};

Settings.defaultProps = {
  isExample: false,
};

export default withStyles(styles)(withSnackbar()(Settings));
