import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';

import NotFoundPage from 'containers/NotFoundPage';
import authRoutes from './routes';

import './auth-layout.scss';

const AuthLayout = (props) => {
  const getRoutePath = (link, { match }) => (match.path + link.path);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Switch>
        {
          authRoutes.map((e) => (
            <Route
              key={e.key}
              path={getRoutePath(e, props)}
              component={e.component}
              exact={e.exact}
            />
          ))
        }
        <NotFoundPage />
      </Switch>
    </Container>
  );
};

export default withRouter(AuthLayout);
