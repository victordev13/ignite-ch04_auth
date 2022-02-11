import React from 'react';
import { NextPage } from 'next';
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const Dashboard: NextPage = () => {  
  const { user } = useContext(AuthContext);

  if(!user) {
  }

  return (<h1>{user?.email}</h1>)
}

export default Dashboard;
