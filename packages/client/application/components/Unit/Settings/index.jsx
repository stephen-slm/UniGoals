import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import PropTypes from 'prop-types';
import React from 'react';

import Summary from '../Summary';
import DeleteModule from '../../Utilities/DeleteModule';

export default class Settings extends React.Component {
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

  render() {
    return (
      <div>
        <IconButton style={{ float: 'right' }} onClick={this.handleClickOpen}>
          <Icon color="primary">settings</Icon>
        </IconButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Settings - {this.props.unit.title}</DialogTitle>
          <DialogContent>
              <Summary
                onDoubleClick={this.props.setUnitDoubleWeightedValue}
                onDroppedClick={this.props.setUnitDroppedValue}
                isDoubleWeighted={this.props.unit.double}
                isDroppedUnit={this.props.unit.dropped}
              />
              <DeleteModule
                disabled={this.props.isExample}
                open={this.state.isDeletingUnit}
                title={this.props.unit.title}
                onDelete={this.props.deleteUnitTable}
                onClose={this.showDeleteUnitBox}
              />
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
  unit: PropTypes.shape({
    title: PropTypes.string,
    double: PropTypes.bool,
    dropped: PropTypes.bool,
  }).isRequired,
};

Settings.defaultProps = {
  isExample: false,
};
