import React from 'react';
import { NextPage } from 'next';
import { withSSRAuth } from '../utils/withSSRAuth';
import { setupAPIClient } from '../services/api';

const Metrics: NextPage = () => {
  return (
    <>
      <h1>Metrics</h1>
    </>
  );
};

export const getServerSideProps = withSSRAuth(
  async (ctx) => {
    const apiClient = setupAPIClient(ctx);
    await apiClient.get('/me');

    return {
      props: {},
    };
  },
  {
    permissions: ['metrics.list'],
    roles: ['administrator'],
  }
);

export default Metrics;
