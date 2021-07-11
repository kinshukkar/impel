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
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
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
}));

const ImpelCard = (props) => {
  const {
    data,
    joined,
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
        title={data.title}
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
          <span style={{ color: 'rgba(0, 0, 0, 0.54)' }}>This is a bike challenge, which will be evaluated on </span>
          <span className={classes.dark}>{new Date(data.evaluationTime).toDateString()}</span>
        </div>
      </CardContent>
      <CardActions disableSpacing style={{ padding: 16 }}>
        {joined ? (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex' }}>
              <div style={{ marginRight: 5, color: 'rgba(0, 0, 0, 0.54)' }}>Challenge ends in: </div>
              <div className={classes.red}>{`${getDiffBetweenDatesInDays(new Date(), new Date(data.endTime))} days`}</div>
            </div>
            <div style={{ display: 'flex' }}>
              <div className={classes.dark}>{new Date(data.endTime).toDateString()}</div>
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
        <Button
          variant="contained"
          // disable Submit button if current date before evaluation date
          disabled={joined && (new Date() < new Date(data.evaluationTime))}
          color="primary"
          style={{ marginLeft: 'auto' }}
          onClick={() => handleJoinChallenge(Number(data.id))}
        >
          {joined ? 'Submit' : 'Join'}
        </Button>
      </CardActions>
    </Card>
  );
};

ImpelCard.defaultProps = {
  data: {},
  joined: false,
};

ImpelCard.propTypes = {
  data: PropTypes.object,
  joined: PropTypes.bool,
  handleJoinChallenge: PropTypes.func.isRequired,
};

export default ImpelCard;
