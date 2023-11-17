import { createContext, useContext, useState } from 'react';

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [title, setTitle] = useState();
  const [status, setStatus] = useState();
  const [message, setMessage] = useState();

  const setAlert = (status, title, message) => {
    setStatus(status);
    setTitle(title); 
    setMessage(message);
    setShowAlert(true);
  };

  const resetAlert = () => {
    setShowAlert(false);
    setTitle('');
    setStatus('');
    setMessage('');
    console.log(showAlert);
  };

  return (
    <AlertContext.Provider value={{ showAlert, title, status, message, setAlert, resetAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);
