import React, { lazy, Suspense } from 'react';

/* eslint-disable react/jsx-filename-extension */
const loadable = (importFunc, { fallback = null } = { fallback: null }) => {
  const LazyComponent = lazy(importFunc);

  /* eslint-disable react/jsx-props-no-spreading */
  return (props) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

export default loadable;
