import { useState } from 'react';

export const useAlert = () => {
    const [showAlert, setShowAlert] = useState(false);
    const [title, setTitle] = useState();
    const [status, setStatus] = useState();
    const [message, setMessage] = useState();

    return {
        showAlert,
        setShowAlert,
        title,
        setTitle,
        status,
        setStatus,
        message,
        setMessage
    }
}