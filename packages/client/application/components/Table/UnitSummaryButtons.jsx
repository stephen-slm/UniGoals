import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, FormControlLabel } from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';
import { withStyles } from 'material-ui/styles';

const styles = () => ({
  root: {
    justifyContent: 'center',
  },
});

const UnitSummaryButtons = props => (
  <FormGroup row className={props.classes.root}>
    <FormControlLabel
      onChange={props.onDoubleClick}
      control={<Checkbox checked={props.isDoubleWeighted} onChange={() => undefined} />}
      label="Double Weighted"
    />
    <FormControlLabel
      control={
        <Checkbox checked={props.isDroppedUnit} onChange={() => undefined} color="primary" />
      }
      label="Dropped Unit"
    />
  </FormGroup>
);

UnitSummaryButtons.propTypes = {
  classes: PropTypes.shape({
    root: PropTypes.string,
  }).isRequired,
  isDoubleWeighted: PropTypes.bool.isRequired,
  isDroppedUnit: PropTypes.bool.isRequired,
  onDoubleClick: PropTypes.func.isRequired,
};

export default withStyles(styles)(UnitSummaryButtons);
