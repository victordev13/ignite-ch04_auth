import React, { useEffect } from 'react';
import { NextPage } from 'next';
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { api } from '../services/api';

const Dashboard: NextPage = () => {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    api.get('/me').then(res => {
      console.log(res);
    })
  }, []);

  return (<h1>{user?.email}</h1>)
}

export default Dashboard;
