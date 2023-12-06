import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth.jsx';
import { AlertProvider } from './hooks/useAlert.jsx';
import { MantineProvider } from '@mantine/core';
import theme from '../theme.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <MantineProvider>
        <ChakraProvider theme={theme}>
          <AuthProvider>
            <AlertProvider>
              <App />
            </AlertProvider>
          </AuthProvider>
        </ChakraProvider>
      </MantineProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
