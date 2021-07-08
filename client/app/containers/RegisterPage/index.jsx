import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';

// import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
// import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
// import Select from 'components/Material/Select';
// import LabeledCheckboxMaterialUi from 'labeled-checkbox-material-ui';
import appLogo from 'assets/impel.svg';
import axios from 'utils/axios-base';


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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  checkbox: {
    margin: theme.spacing(1),
  },
  appLogo: {
    margin: theme.spacing(3, 0, 2),
  },
  copyright: {
    margin: theme.spacing(3, 0, 0),
    marginLeft: theme.spacing(10),
  },
}));

const RegisterPage = (props) => {
  const classes = useStyles();
  const { history: { push } } = props;

  const [name, setName] = useState('');

  const goToLogin = () => {
    push('/auth/login');
  };

  const clearFields = () => {
    setName('');
  };

  const pushToPrintersRoute = () => {
    push('/home');
  };

  const handleRegister = () => {
    const payload = {
      name,
    };
    axios.post('/register', payload)
      .then((res) => {
        console.log(res);
        clearFields();
        // eslint-disable-next-line no-alert
        alert('You have successfully Registered as a Printer Provider!');
        pushToPrintersRoute();
      })
      .catch((err) => {
        console.error(err);
        // eslint-disable-next-line no-alert
        alert('Error in api call', err);
      });
  };

  return (
    <div className={classes.paper}>
      {/* <Avatar className={classes.avatar}>
        <LockOutlinedIcon />
      </Avatar> */}
      <img src={appLogo} alt="Imepl Logo" width="60" className={classes.appLogo} />
      <Typography component="h1" variant="h5">
        Register in Impel
      </Typography>
      <form className={classes.form} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="name"
              label="Name"
              name="name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
        </Grid>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          className={classes.submit}
          onClick={(e) => handleRegister(e)}
        >
          Register
        </Button>
        {/* <Grid container justify="flex-end">
          <Grid item>
            <Link variant="body2" onClick={() => goToLogin()}>
              Already have an account? Sign in
            </Link>
          </Grid>
        </Grid> */}
      </form>
    </div>
  );
};

RegisterPage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default compose(
  withRouter,
)(RegisterPage);
