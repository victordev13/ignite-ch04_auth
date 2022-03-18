import React, { useEffect } from 'react';
import { NextPage } from 'next';
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { api } from '../services/apiClient';
import { withSSRAuth } from '../utils/withSSRAuth';
import { setupAPIClient } from '../services/api';
import { Can } from '../components/Can';
import Link from 'next/link';

const Dashboard: NextPage = () => {
  const { user, signOut } = useContext(AuthContext);

  useEffect(() => {
    api.get('/me').then(res => console.log(res)).catch(() => {
      signOut();
    })
  }, []);

  return (
    <>
      <h1>{user?.email}</h1>
      <button onClick={() => signOut()}>Sign Out</button>
      <Can permissions={['metrics.list']}><Link href="/metrics">Metrics</Link></Can>
    </>
  )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  const { data } = await apiClient.get('/me');

  console.log(data);

  return {
    props: {}
  }
})

export default Dashboard;
