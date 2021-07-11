/* eslint-disable react/jsx-props-no-spreading */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  withRouter,
} from 'react-router-dom';
import { compose } from 'redux';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import ImpelCard from 'components/ImpelCard';
import ErrorIcon from '@material-ui/icons/Error';
import Avatar1 from 'assets/images/avatars/avatar1.jpg';
import Avatar2 from 'assets/images/avatars/avatar2.jpg';
import { getAllActiveChallenges, getUserJoinedChallenges, joinChallenge } from './actions';
import JoinChallengeDialog from './JoinChallengeDialog';
import AchievementBadge from '../../components/AchievementBadge';

function TabPanel(props) {
  const {
    children, value, index, ...other
  } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <div style={{ display: 'flex' }}>{children}</div>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

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
  const dispatch = useDispatch();
  const { history: { push } } = props;

  const {
    walletDetails,
  } = useSelector(
    (state) => state.global,
  );

  const {
    getActiveChallengesStatus,
    activeChallenges,
    getUserJoinedChallengesStatus,
    userJoinedChallenges,
    joinChallengeStatus,
  } = useSelector(
    (state) => state.home,
  );

  const { provider_address } = walletDetails;

  const [value, setValue] = React.useState(0);
  const [neoN3Data, setNeoN3Data] = React.useState({});
  const [openJoinChallengeDialog, setOpenJoinChallengeDialog] = React.useState(false);
  const [gasToJoinChallenge, setGasToJoinChallenge] = React.useState(0);
  const [challengeId, setChallengeId] = React.useState('');
  const badges = 3;

  const setN3Data = (data) => {
    setNeoN3Data(data);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (Object.keys(neoN3Data).length > 0) {
      // eslint-disable-next-line no-undef
      const n3 = new NEOLineN3.Init();
      console.log('inside homepage', n3);
      setN3Data(n3);
    } else {
      // for cases when page is reloaded and NeoLineN3 is no more in scope
      window.addEventListener('NEOLine.N3.EVENT.READY', () => {
        // eslint-disable-next-line no-undef
        const n3 = new NEOLineN3.Init();
        console.log('inside login', n3);
        setN3Data(n3);
      });
    }
    if (newValue === 1) {
      const payload = { provider_address };
      dispatch(getUserJoinedChallenges(payload));
    } else if (newValue === 0) {
      dispatch(getAllActiveChallenges());
    }
  };

  const handleCloseJoinChallengeDialog = (newValue) => {
    setOpenJoinChallengeDialog(false);

    if (newValue) {
      setGasToJoinChallenge(newValue);
      const payload = {
        neoN3Data,
        gasAmount: newValue,
        challengeId: Number(challengeId),
      };
      dispatch(joinChallenge(payload));
    }
  };

  const handleClickOpenJoinChallengeDialog = (data) => {
    setChallengeId((prevState) => {
      return data;
    });
    setOpenJoinChallengeDialog((prevState) => {
      return true;
    });
    // setChallengeId(data);
    // setOpenJoinChallengeDialog(true);
  };

  useEffect(() => {
    if (joinChallengeStatus === 'success') {
      // proceed to joined challenges tab
      setValue(1);
    }
  }, [joinChallengeStatus]);

  useEffect(() => {
    dispatch(getAllActiveChallenges());
    const payload = { provider_address };
    dispatch(getUserJoinedChallenges(payload));
  }, []);

  useEffect(() => {
    if (Object.keys(neoN3Data).length > 0) {
      // eslint-disable-next-line no-undef
      const n3 = new NEOLineN3.Init();
      console.log('inside homepage', n3);
      setN3Data(n3);
    } else {
      // for cases when page is reloaded and NeoLineN3 is no more in scope
      window.addEventListener('NEOLine.N3.EVENT.READY', () => {
        // eslint-disable-next-line no-undef
        const n3 = new NEOLineN3.Init();
        console.log('inside login', n3);
        setN3Data(n3);
      });
    }
  }, []);

  return (
    <div className={classes.root}>
      <>
        <Tabs
          value={value}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChange}
          aria-label="tabs example"
        >
          <Tab label={`Active Challenges (${activeChallenges.length})`} />
          <Tab label={`Joined Challenges (${userJoinedChallenges.length})`} />
          <Tab label={`Your Badges (${badges})`} />
        </Tabs>
        <TabPanel value={value} index={0}>
          <Grid container className="cards">
            {getActiveChallengesStatus === 'loading' && <CircularProgress />}
            {getActiveChallengesStatus === 'success' && activeChallenges.map((item, key) => {
              return (
                <Grid key={item.id} item xs={3}>
                  <ImpelCard
                    data={item}
                    handleJoinChallenge={() => handleClickOpenJoinChallengeDialog(item.id)}
                  />
                </Grid>
              );
            })}
          </Grid>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Grid container className="cards">
            {getUserJoinedChallengesStatus === 'loading' && <CircularProgress />}
            {getUserJoinedChallengesStatus === 'success' && userJoinedChallenges.length === 0
              && (
              <div style={{
                fontSize: 16, color: 'darkgray', margin: '30px 0', display: 'flex', alignItems: 'center',
              }}
              >
                <ErrorIcon />
              You have not subscribed to any challenge. Please go on to the Active Challenges tab and Join a Challenge
              </div>
              )}
            {getUserJoinedChallengesStatus === 'success' && userJoinedChallenges.length > 0 && userJoinedChallenges.map((item, key) => {
              return (
                <Grid key={item.id} item xs={3}>
                  <ImpelCard
                    joined
                    data={item}
                    handleJoinChallenge={() => handleClickOpenJoinChallengeDialog(item.id)}
                  />
                </Grid>
              );
            })}
          </Grid>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <AchievementBadge avatarSrc={Avatar1} title="50k Marathon" />
          <AchievementBadge avatarSrc={Avatar2} title="20k Marathon" />
          <AchievementBadge avatarSrc={Avatar1} title="5k Marathon" />
        </TabPanel>
      </>
      <JoinChallengeDialog
        classes={{
          paper: classes.paper,
        }}
        id="ringtone-menu"
        keepMounted
        open={openJoinChallengeDialog}
        onClose={handleCloseJoinChallengeDialog}
        value={gasToJoinChallenge}
      />
    </div>
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
