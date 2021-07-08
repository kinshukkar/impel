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

  return (
    <Paper className={classes.root}>
      Congratulations! You can checkout Impel now!
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
