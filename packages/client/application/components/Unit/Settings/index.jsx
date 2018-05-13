import Dialog, { DialogActions, DialogContent, DialogContentText, DialogTitle } from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';
import Icon from 'material-ui/Icon';
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
        <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Settings - {this.props.unit.title}</DialogTitle>
          <DialogContent>
            <DialogContentText>
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
            </DialogContentText>
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
