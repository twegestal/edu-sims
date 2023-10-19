import { useState } from 'react'
import Login from './login.jsx'
import './App.css'

function App() {
  const [message, setMessage] = useState('');
  const [user, setUser] = useState({});

  const updateLoggedInUser = (id, email, is_admin) => {
    setUser({
      id : id,
      email : email,
      is_admin : is_admin
    })
  }

  const handleFetchMessageFromBackend = () => {
    fetch('api/hello')
    .then(response => response.json())
    .then(data => {
        setMessage(data);
      })
  }
  
  const postCallToApi = async (body, url) => {
    const options = {
      method : "POST",
      headers : {
        "Content-type" : "application/json"
      },
      body : body
    }
    var apiResponse = "";
    
    apiResponse = await fetch(url, options);

    apiResponse = apiResponse.json();
    
    return apiResponse;
    
  }

  const getCallToApi = async (url, inputHeaders) => {
    const options = {
      method : "GET",
      headers : inputHeaders
    }
    
    var apiResponse = "";

    apiResponse = await fetch(url, options);

    apiResponse = apiResponse.json();

    return apiResponse;
  }

  return (
    <>
      <h1>{message}</h1>
      <button onClick={handleFetchMessageFromBackend}>Klicka här</button>
      <Login user = {user}
      postToApi = {postCallToApi}
      updateLoggedInUser = {updateLoggedInUser}
      getCallToApi = {getCallToApi}></Login>
      <h1>{user.email}</h1>
    </>
  )
}

export default App
