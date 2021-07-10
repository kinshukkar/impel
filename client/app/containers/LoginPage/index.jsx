/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';

// import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
// import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import { userLogin } from 'containers/App/actions';
import appLogo from 'assets/impel.svg';
import CircularProgress from '@material-ui/core/CircularProgress';
import { getUser } from '../../utils/neon';

const useStyles = makeStyles((theme) => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  appLogo: {
    margin: theme.spacing(3, 0, 2),
  },
  copyright: {
    margin: theme.spacing(3, 0, 0),
    marginLeft: theme.spacing(10),
  },
}));

const LoginPage = (props) => {
  const classes = useStyles();
  const { history: { push } } = props;

  const [neoN3Data, setNeoN3Data] = useState({});

  const setN3Data = (data) => {
    setNeoN3Data(data);
  };

  useEffect(() => {
    window.addEventListener('NEOLine.N3.EVENT.READY', () => {
      const n3 = new NEOLineN3.Init();
      console.log('inside login', n3);
      setN3Data(n3);
    });
  }, [neoN3Data]);

  const pushHomeRoute = () => {
    push('/home');
  };

  const goToRegister = () => {
    push('/auth/register');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const { onUserLogin } = props;

    const payload = {
      neoN3Data,
      pushRoute: pushHomeRoute,
    };
    onUserLogin(payload);
  };

  return (
    <div className={classes.paper}>
      {/* <Avatar className={classes.avatar}>
        <LockOutlinedIcon />
      </Avatar> */}
      <img src={appLogo} alt="Impel Logo" width="60" className={classes.appLogo} />
      <Typography component="h1" variant="h5">
        Welcome to Impel
      </Typography>
      <form className={classes.form} noValidate>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          disabled={Object.keys(neoN3Data).length === 0}
          onClick={(e) => handleLogin(e)}
        >
          {Object.keys(neoN3Data).length === 0
            && <CircularProgress size={16} />}
          Connect to Neo Wallet
        </Button>
        {/* <Grid container>
          <Grid item>
            <Link variant="body2" onClick={() => goToRegister()}>
              {"Don't have an account? Sign Up"}
            </Link>
          </Grid>
        </Grid> */}
        {/* <footer className={classes.copyright}>Copyright &copy; Team Impel </footer> */}
      </form>
    </div>
  );
};

LoginPage.propTypes = {
  onUserLogin: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

const mapStateToProps = createStructuredSelector({
  // isAuthenticated: makeSelectIsAuthenticated(),
});

const mapDispatchToProps = (dispatch) => {
  return {
    onUserLogin: (payload) => dispatch(userLogin(payload)),
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(LoginPage);
