import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Switch,
  Route,
  Redirect,
  withRouter,
} from 'react-router-dom';
import { compose } from 'redux';
import { connect, useSelector } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import clsx from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import InputIcon from '@material-ui/icons/Input';
import appLogo from 'assets/impel.svg';
import { userLogout } from 'containers/App/actions';
import SideNavBar from './SideNavBar';
import mainRoutes from './routes';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    // backgroundColor: 'gray',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
    background: 'white',
  },
  copyright: {
    position: 'fixed',
    bottom: 30,
    textAlign: 'right',
    right: 20,
  },
}));


const MainLayout = (props) => {
  const classes = useStyles();
  const {
    walletDetails,
    userDetails,
  } = useSelector(
    (state) => state.global,
  );
  const { onUserLogout } = props;

  const [open, setOpen] = useState(false);

  const { user_name } = userDetails;

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const getRoutePath = (link) => {
    const routePath = link.path;
    return routePath;
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <div>
            <Typography component="h1" variant="h6" color="inherit" noWrap>
              Welcome to Impel
            </Typography>
            <Typography component="h4" variant="h6" noWrap className={classes.title} style={{ fontSize: 13 }}>
              Experience Fitmess Excellence and Claim Rewards now
            </Typography>
          </div>
          <Typography component="h1" variant="h6" color="inherit" noWrap style={{ marginLeft: 'auto' }}>
            {user_name}
          </Typography>
          <IconButton color="inherit" title="Logout" onClick={() => onUserLogout()}>
            <InputIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      {/* <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <img src={appLogo} alt="Impel Logo" width="60" className={classes.appLogo} />
          <Typography component="h1" variant="h5">
            Impel
          </Typography>
          <IconButton onClick={handleDrawerClose} style={{ marginLeft: 'auto' }}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          <SideNavBar />
        </List>
      </Drawer> */}

      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Switch>
          {mainRoutes.map((eachLink) => (
            <Route
              key={eachLink.key}
              path={getRoutePath(eachLink, props)}
              component={eachLink.component}
              exact={eachLink.exact}
            />
          ))}
          <Redirect
            to={{ pathname: '/home' }}
          />
        </Switch>
        {/* <div className={classes.copyright}>
          Copyright &copy;
          2019 Tattavam | HP Inc
        </div> */}
      </main>
    </div>
  );
};

MainLayout.propTypes = {
  onUserLogout: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({});

const mapDispatchToProps = (dispatch) => {
  return {
    onUserLogout: (payload) => dispatch(userLogout(payload)),
  };
};

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
)(MainLayout);
