import React, { useEffect } from 'react';
import { NextPage } from 'next';
import { useContext } from "react";
import { AuthContext, signOut } from "../contexts/AuthContext";
import { api } from '../services/apiClient';
import { withSSRAuth } from '../utils/withSSRAuth';
import { setupAPIClient } from '../services/api';
import { useCan } from '../hooks/useCan';

const Dashboard: NextPage = () => {
  const { user } = useContext(AuthContext);

  const userCanSeeMetrics = useCan({
    permissions: ['metrics.list'],
    roles: ['administrator']
  })

  useEffect(() => {
    api.get('/me').then(res => console.log(res)).catch(() => {
      signOut();
    })
  }, []);

  return (<><h1>{user?.email}</h1>{userCanSeeMetrics && <p>Metrics</p>}</>)
}

export const getServerSideProps = withSSRAuth(async ctx => {
  const apiClient = setupAPIClient(ctx);
  const { data } = await apiClient.get('/me');

  console.log(data);

  return {
    props: {}
  }
})

export default Dashboard;
