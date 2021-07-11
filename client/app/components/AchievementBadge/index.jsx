import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import Avatar1 from 'assets/images/avatars/avatar1.jpg';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  large: {
    width: theme.spacing(12),
    height: theme.spacing(12),
  },
  title: {
    fontSize: 16,
    margin: 10,
    color: 'darkgray',
  },
}));

const AchievementBadge = (props) => {
  const {
    title,
    avatarSrc,
  } = props;
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Tooltip title={title} arrow>
        <Avatar alt={title} src={avatarSrc} className={classes.large} />
      </Tooltip>
      <div className={classes.title}>{title}</div>
    </div>
  );
};

AchievementBadge.defaultProps = {
  avatarSrc: <Avatar1 />,
};

AchievementBadge.propTypes = {
  title: PropTypes.string.isRequired,
  avatarSrc: PropTypes.node,
};

export default AchievementBadge;
