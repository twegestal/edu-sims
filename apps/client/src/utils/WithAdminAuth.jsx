import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const WithAdminAuth = ({ children }) => {
  const { user } = useAuth();

  if (!user || !user.isAdmin) {
    return <Navigate to='/' />;
  }

  return typeof children === 'function' ? children() : children;
};

export default WithAdminAuth;
