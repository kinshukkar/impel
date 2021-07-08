import React from 'react';
import {
  Dashboard,
  ShoppingCart,
  People,
  PlaylistAdd,
  StoreMallDirectory,
  LocalPrintshop,
  InsertChart,
  RoomService,
  Collections,
  MonetizationOn,
} from '@material-ui/icons';

const getNavDetails = () => {
  const json = {
    list: [
      {
        id: 2,
        title: 'Analytics',
        items: [
          {
            id: 1,
            name: 'Dashboard',
            icon: (<Dashboard />),
            url: '/home',
          },
          {
            id: 2,
            name: 'Reports',
            icon: (<InsertChart />),
            url: '/reports',
          },
        ],
      },
    ],
  };
  return json;
};

export {
  getNavDetails,
};
