import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React from 'react';

import { withSnackbar } from '../../Utilities/SnackbarWrapper';
import ModuleWrapper from '../../Utilities/ModuleWrapper';
import Summary from '../Summary';

import * as exportings from '../../../utils/export';

const styles = (theme) => ({
  button: {
    margin: theme.spacing.unit,
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
    exportings.exportUnitToCSV(this.props.unit);
    this.props.snackbar.showMessage(`Exporting unit ${this.props.unit.title} to csv`);
  };

  exportToPDF = () => {
    exportings.exportToPDF(this.props.unit);
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
        <IconButton style={{ float: 'right' }} onClick={this.handleClickOpen}>
          <Icon color="primary">settings</Icon>
        </IconButton>
        <ModuleWrapper
          description={`Are you sure you wish to delete ${this.props.unit.title}?`}
          disabled={this.props.isExample}
          open={this.state.isDeletingUnit}
          title={`Deleting ${this.props.unit.title}`}
          onComplete={this.props.deleteUnitTable}
          onClose={this.showDeleteUnitBox}
          completeText="Delete"
        />
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
          style={{ visibility: this.state.open ? 'visible' : 'hidden' }}
        >
          <DialogTitle id="form-dialog-title">Settings - {this.props.unit.title}</DialogTitle>
          <DialogContent>
            <Summary
              onDoubleClick={this.props.isExample ? () => undefined : this.props.setUnitDoubleWeightedValue}
              onDroppedClick={this.props.isExample ? () => undefined : this.props.setUnitDroppedValue}
              isDoubleWeighted={this.props.unit.double}
              isDroppedUnit={this.props.unit.dropped}
            />
            <Grid container spacing={8} justify="center" alignItems="center" style={{ flexGrow: 1 }}>
              <Grid item>
                <Button color="primary" className={classes.button} onClick={this.exportToCSV}>
                  Export CSV
                </Button>
              </Grid>
              <Grid item />
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
  setUnitDoubleWeightedValue: PropTypes.func.isRequired,
  deleteUnitTable: PropTypes.func.isRequired,
  setUnitDroppedValue: PropTypes.func.isRequired,
  classes: PropTypes.shape().isRequired,
  unit: PropTypes.shape({
    title: PropTypes.string,
    double: PropTypes.bool,
    dropped: PropTypes.bool,
  }).isRequired,
  snackbar: PropTypes.shape({
    showMessage: PropTypes.func,
  }).isRequired,
};

Settings.defaultProps = {
  isExample: false,
};

export default withStyles(styles)(withSnackbar()(Settings));
