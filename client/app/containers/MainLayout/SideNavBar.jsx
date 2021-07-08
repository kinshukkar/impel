import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  withRouter,
} from 'react-router-dom';
import { compose } from 'redux';
import {
  MenuItem,
  ListSubheader,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Divider,
} from '@material-ui/core';
import {
  ExpandLess,
  ExpandMore,
} from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import * as consts from 'utils/constants';

const styles = (theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    background: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  selectedMenuList: {
    background: '#3f51b5',
    color: 'white',
  },
});

const SideNavBar = (props) => {
  const items = consts.getNavDetails();
  const { classes } = props;
  const { history: { push } } = props;
  const { location: { pathname } } = props;

  const [states, setStates] = React.useState({
    Stores: false,
    Printers: false, // made true on page landing
    Services: false,
    Items: false,
    Orders: false,
    Customers: false,
    Promotions: false,
    Reports: false,
  });

  const resetStates = () => {
    setStates({
      Stores: false,
      Printers: false,
      Services: false,
      Items: false,
      Orders: false,
      Customers: false,
      Promotions: false,
      Reports: false,
    });
  };

  const setNavStates = (e) => {
    resetStates();
    setStates({
      [e]: !states[e],
    });
  };

  const setNavPath = () => {
    const itemList = items.list;
    itemList.forEach((elem) => {
      elem.items.forEach((item) => {
        if (item.url) {
          if (pathname === item.url) {
            setNavStates(item.name);
          }
        } else {
          item.subitems.forEach((subitem) => {
            if (pathname === subitem.url) {
              setNavStates(item.name);
            }
          });
        }
      });
    });
  };

  useEffect(() => {
    setNavPath();
  }, []);

  const pushContainerRoute = (routeStr, subItemsAvailable) => {
    if (!subItemsAvailable) {
      resetStates();
    }
    push(routeStr);
  };

  return (
    <div>
      {items.list.map((list) => {
        return (
          <List
            className={classes.root}
            key={list.id}
            // subheader={<ListSubheader>{list.title}</ListSubheader>}
          >
            {list.items.map((item) => {
              return (
                <div key={item.id}>
                  {item.subitems != null ? (
                    <div key={item.id}>
                      <MenuItem
                        button
                        key={item.id}
                        // selected={pathname === item.url}
                        onClick={() => setNavStates(item.name)}
                      >
                        <ListItemIcon title={item.name}>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={item.name}
                        />
                        {
                        states[item.name] ? (
                          <ExpandLess />
                        ) : (
                          <ExpandMore />
                        )
                        }
                      </MenuItem>
                      {item.subitems.map(
                        (sitem) => {
                          return (
                            <Collapse
                              key={list.items.id}
                              component="li"
                              in={states[item.name]}
                              timeout="auto"
                              unmountOnExit
                            >
                              <List disablePadding>
                                {/* {item.subitems.map(
                                  (sitem) => {
                                    return ( */}
                                <MenuItem
                                  button
                                  key={sitem.id}
                                  className={classes.nested}
                                  selected={pathname === sitem.url}
                                  // className={classes.selectedMenuList}
                                  onClick={() => pushContainerRoute(sitem.url, true)}
                                >
                                  <ListItemIcon title={sitem.name}>
                                    {sitem.icon}
                                  </ListItemIcon>
                                  <ListItemText
                                    key={sitem.id}
                                    primary={sitem.name}
                                  />
                                </MenuItem>
                                {/* );
                              },
                            )} */}
                              </List>
                            </Collapse>
                          );
                        },
                      )}
                      {' '}
                    </div>
                  ) : (
                    <MenuItem
                      button
                      selected={pathname === item.url}
                      onClick={() => pushContainerRoute(item.url, false)}
                      key={item.id}
                    >
                      <ListItemIcon title={item.name}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.name}
                      />
                    </MenuItem>
                  )}
                </div>
              );
            })}
            <Divider key={list.id} absolute />
          </List>
        );
      })}
    </div>
  );
};

SideNavBar.propTypes = {
  classes: PropTypes.object.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default compose(
  withStyles(styles),
  withRouter,
)(SideNavBar);
