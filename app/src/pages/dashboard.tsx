import React, { useEffect } from 'react';
import { NextPage } from 'next';
import { useContext } from "react";
import { AuthContext, signOut } from "../contexts/AuthContext";
import { api } from '../services/api';

const Dashboard: NextPage = () => {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    api.get('/me').then(res => console.log(res)).catch(() => {
      signOut();
    })
  }, []);

  return (<h1>{user?.email}</h1>)
}

export default Dashboard;
