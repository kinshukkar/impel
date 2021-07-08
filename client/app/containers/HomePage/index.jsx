import React from 'react';
import PropTypes from 'prop-types';
import {
  withRouter,
} from 'react-router-dom';
import { compose } from 'redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button,
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from '@material-ui/core';
import axios from 'utils/axios-base';
import { useSelector } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  tableWrapper: {
    maxHeight: 407,
    overflow: 'auto',
  },
  headerFont: {
    fontSize: 24,
    margin: theme.spacing(3, 0, 3),
  },
}));

const HomePage = (props) => {
  const classes = useStyles();
  const { history: { push } } = props;

  const {
    userDetails,
  } = useSelector(
    (state) => state.global,
  );

  const { provider_address, provider_label } = userDetails;

  console.log('provider_address inside--', userDetails);

  return (
    <Paper className={classes.root}>
      {`Congratulations ${provider_label}! You can checkout Impel now!`}
    </Paper>
  );
};

HomePage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default compose(
  withRouter,
)(HomePage);
