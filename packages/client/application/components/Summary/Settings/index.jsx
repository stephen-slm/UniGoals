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

import ModuleWrapper from '../../Utilities/ModuleWrapper';
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
    exportings.exportYearToCsv(this.props.year);
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
        <IconButton style={{ float: 'right' }} onClick={this.handleClickOpen}>
          <Icon color="primary">settings</Icon>
        </IconButton>
        <ModuleWrapper
          disabled={this.props.isExample}
          open={this.state.isDeletingUnit}
          title={this.props.year.title}
          onDelete={this.props.deleteYear}
          onClose={this.showDeleteUnitBox}
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
  }).isRequired,
};

Settings.defaultProps = {
  isExample: false,
};

export default withStyles(styles)(Settings);
