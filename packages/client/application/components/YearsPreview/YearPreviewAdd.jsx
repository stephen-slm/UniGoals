import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import { withSnackbar } from '../Utilities/SnackbarWrapper';
import firebase from '../../utils/FirebaseWrapper';

const styles = (theme) => ({
  root: {
    height: theme.spacing.unit * 15,
    width: theme.spacing.unit * 18,
    opacity: '0.3',
    color: 'grey',
    cursor: 'pointer',
  },
  addPreview: {
    position: 'relative',
    top: '50%',
    transform: 'translateY(100%)',
  },
});

class YearPreviewAdd extends React.Component {
  constructor(props) {
    super(props);

    this.insertNewYear = this.insertNewYear.bind(this);
  }

  insertNewYear() {
    firebase
      .insertNewYear()
      .then((year) => {
        this.props.insertNewYear(year.yearKey, year.title, year.unitKey);
        this.props.snackbar.showMessage(`Added new year ${year.title}`);
      })
      .catch((error) => this.props.snackbar.showMessage(error.message));
  }

  render() {
    const { classes } = this.props;

    return (
      <Card className={classes.root} onClick={this.insertNewYear}>
        <CardContent>
          <Typography className={classes.addPreview} variant="subheading">
            Add
          </Typography>
        </CardContent>
      </Card>
    );
  }
}

YearPreviewAdd.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  insertNewYear: PropTypes.func.isRequired,
  snackbar: PropTypes.shape({
    showMessage: PropTypes.func,
  }).isRequired,
};

YearPreviewAdd.defaultProps = {};

export default withStyles(styles)(withSnackbar()(YearPreviewAdd));
