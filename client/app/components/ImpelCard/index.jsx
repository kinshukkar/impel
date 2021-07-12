/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { green, red } from '@material-ui/core/colors';
import Badge from '@material-ui/core/Badge';
import MailIcon from '@material-ui/icons/Mail';
import Tooltip from '@material-ui/core/Tooltip';
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';
import Avatar1 from 'assets/images/avatars/avatar1.jpg';
import Avatar2 from 'assets/images/avatars/avatar2.jpg';
import { getDiffBetweenDatesInDays } from '../Utils/Utils';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: green[500],
  },
  dark: {
    color: '#3c4d08',
  },
  red: {
    color: 'red',
  },
  ellipsis: {
    width: 200,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
}));

const defaultBadgeProps = {
  color: 'secondary',
  children: <MailIcon />,
};

const ImpelCard = (props) => {
  const {
    data,
    joined,
    provider_address,
    hasUserJoined,
    handleJoinChallenge,
  } = props;

  const getAvatar = () => {
    switch (data.avatarId) {
      case 1:
        return Avatar1;
      case 2:
        return Avatar2;
      default:
        return Avatar1;
    }
  };

  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={(
          <Avatar aria-label="recipe" className={classes.avatar}>
            <DirectionsRunIcon />
          </Avatar>
)}
        // title={<span className={classes.ellipsis}><Tooltip title={data.title} arrow>{data.title}</Tooltip></span>}
        title={(
          <>
            <Tooltip title={data.title} arrow="true">
              <div className={classes.ellipsis}>{data.title}</div>
            </Tooltip>
            {/* <Badge badgeContent={1000} max={999} {...defaultBadgeProps} /> */}
          </>
)}
        // subheader={(
        //   <>
        //     <div style={{ display: 'flex' }}>
        //       <div style={{ marginRight: 5 }}>Starts on: </div>
        //       <div className={classes.dark}>{new Date(data.startTime).toDateString()}</div>
        //     </div>
        //     <div style={{ display: 'flex' }}>
        //       <div style={{ marginRight: 5 }}>Ends on: </div>
        //       <div className={classes.dark}>{new Date(data.endTime).toDateString()}</div>
        //     </div>
        //   </>
        // )}
      />
      <CardMedia
        className={classes.media}
        image={getAvatar()}
        title={data.title}
      />
      <CardContent>
        <div>
          <span style={{ color: 'rgba(0, 0, 0, 0.54)' }}>This is a running challenge, which will be evaluated on </span>
          <span className={classes.dark}>{new Date(data.evaluationTime).toDateString()}</span>
        </div>
      </CardContent>
      <CardActions disableSpacing style={{ padding: 16 }}>
        {joined ? (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex' }}>
              {new Date() > new Date(data.endTime) ? (
                <>
                  <div style={{ marginRight: 5, color: 'rgba(0, 0, 0, 0.54)' }}>Submission ends in: </div>
                  <div className={classes.red}>{`${getDiffBetweenDatesInDays(new Date(), new Date(data.endTime))} days`}</div>
                </>
              )
                : (
                  <>
                    <div style={{ marginRight: 5, color: 'rgba(0, 0, 0, 0.54)' }}>Challenge ends in: </div>
                    <div className={classes.red}>{`${getDiffBetweenDatesInDays(new Date(), new Date(data.endTime))} days`}</div>
                  </>
                )}
              {/* <div style={{ marginRight: 5, color: 'rgba(0, 0, 0, 0.54)' }}>Challenge ends in: </div>
              <div className={classes.red}>{`${getDiffBetweenDatesInDays(new Date(), new Date(data.endTime))} days`}</div> */}
            </div>
            <div style={{ display: 'flex' }}>
              <div className={classes.dark}>{new Date(data.endTime).toDateString()}</div>
            </div>
            <div style={{ display: 'flex' }}>
              <div style={{ marginRight: 5, color: 'rgba(0, 0, 0, 0.54)' }}>Commit Amount: </div>
              <div style={{ color: 'green', fontWeight: 'bold' }}>{`${data.commitAmount * 10 ** 8} GAS`}</div>
            </div>
          </div>
        )
          : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex' }}>
                <div style={{ marginRight: 5, color: 'rgba(0, 0, 0, 0.54)' }}>Starts on: </div>
                <div className={classes.dark}>{new Date(data.startTime).toDateString()}</div>
              </div>
              <div style={{ display: 'flex' }}>
                <div style={{ marginRight: 5, color: 'rgba(0, 0, 0, 0.54)' }}>Ends on: </div>
                <div className={classes.dark}>{new Date(data.endTime).toDateString()}</div>
              </div>
            </div>
          )}
        {joined ? (
          <Button
            variant="contained"
          // disable Submit button if current date before evaluation date
            disabled={new Date() < new Date(data.endTime)}
            color="primary"
            href={`http://139.59.77.81/:9000/user/strava-auth/?provider_address=${provider_address}&challengeId=${data.challengeId}&startTime=${data.startTime}&endTime=${data.endTime}`}
            style={{ marginLeft: 'auto' }}
          >
          Submit
          </Button>
        ) : (
          <Button
            variant="contained"
          // disable Submit button if current date before evaluation date
            disabled={hasUserJoined}
            color="primary"
            style={{ marginLeft: 'auto' }}
            onClick={() => handleJoinChallenge(Number(data.id))}
          >
          Join
          </Button>
        )}
        {/* <Button
          variant="contained"
          // disable Submit button if current date before evaluation date
          // disabled={(joined && (new Date() < new Date(data.evaluationTime))) || hasUserJoined}
          color="primary"
          href={`/user/strava-auth/?provider_address=${provider_address}&challenge_id=${data.challengeId}&startTime=${data.startTime}&endTime=${data.endTime}`}
          style={{ marginLeft: 'auto' }}
          onClick={() => handleJoinChallenge(Number(data.id))}
        >
          {joined ? 'Submit' : 'Join'}
        </Button> */}
      </CardActions>
    </Card>
  );
};

ImpelCard.defaultProps = {
  data: {},
  joined: false,
  hasUserJoined: false,
};

ImpelCard.propTypes = {
  data: PropTypes.object,
  provider_address: PropTypes.string.isRequired,
  hasUserJoined: PropTypes.bool,
  joined: PropTypes.bool,
  handleJoinChallenge: PropTypes.func.isRequired,
};

export default ImpelCard;
