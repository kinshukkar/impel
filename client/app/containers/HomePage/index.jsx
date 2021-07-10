/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import {
  withRouter,
} from 'react-router-dom';
import { compose } from 'redux';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import axios from 'utils/axios-base';
import ImpelCard from 'components/ImpelCard';
import config from 'utils/neon';

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
  const theme = useTheme();
  const { history: { push } } = props;

  const {
    walletDetails,
    userDetails,
  } = useSelector(
    (state) => state.global,
  );

  const { provider_address, provider_label } = walletDetails;
  const { user_name } = userDetails;
  const [value, setValue] = React.useState(0);

  console.log('provider_address inside--', walletDetails);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const allChallenges = [
    {
      id: 1,
      title: 'July 10K Challenge',
      startTime: '1 Jul 2021, 00:00:00',
      endTime: '31 Jul 2021, 00:00:00',
      evaluationTime: '15 Aug 2021, 00:00:00',
      activityType: 0,
      state: 0,
      type: 0,
      avatarId: 1,
      value: 10000,
    },
    {
      id: 2,
      title: 'July 5K Challenge',
      startTime: '1 Jul 2021, 00:00:00',
      endTime: '31 Jul 2021, 00:00:00',
      evaluationTime: '15 Aug 2021, 00:00:00',
      activityType: 0,
      state: 0,
      type: 0,
      avatarId: 1,
      value: 10000,
    },
    {
      id: 3,
      title: 'Aug Sprint Marathon',
      startTime: '1 Aug 2021, 00:00:00',
      endTime: '31 Aug 2021, 00:00:00',
      evaluationTime: '15 Sept 2021, 00:00:00',
      activityType: 0,
      state: 0,
      type: 0,
      avatarId: 2,
      value: 10000,
    },
  ];

  const activeChallenges = [
    {
      id: 3,
      title: 'Aug Sprint Marathon',
      startTime: '1 Aug 2021, 00:00:00',
      endTime: '31 Aug 2021, 00:00:00',
      evaluationTime: '15 Sept 2021, 00:00:00',
      activityType: 0,
      state: 0,
      type: 0,
      avatarId: 2,
      value: 10000,
    },
  ];

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
          <Tab label="Active Challenges" />
          <Tab label="Joined Challenges" />
          <Tab label="Badges" />
        </Tabs>
        <TabPanel value={value} index={0}>
          <Grid container className="cards">
            {allChallenges.map((item, key) => {
              return (
                <Grid key={item.id} item xs={3}>
                  <ImpelCard data={item} />
                </Grid>
              );
            })}
          </Grid>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Grid container className="cards">
            {activeChallenges.map((item, key) => {
              return (
                <Grid key={item.id} item xs={3}>
                  <ImpelCard data={item} />
                </Grid>
              );
            })}
          </Grid>
        </TabPanel>
        <TabPanel value={value} index={2}>
          Item Three
        </TabPanel>
      </>
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
