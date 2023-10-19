import { useState } from 'react'
import Login from './login.jsx'
import './App.css'

function App() {
  const [message, setMessage] = useState('');
  const [user, setUser] = useState({
    id : ""
  });

  const updateLoggedInUser = (id) => {
    setUser({
      id : id
    })
  }

  const handleFetchMessageFromBackend = () => {
    fetch('api/hello')
    .then(response => response.json())
    .then(data => {
        setMessage(data);
      })
  }
  
  const postToApi = async (body, url) => {
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

  return (
    <>
      <h1>{message}</h1>
      <button onClick={handleFetchMessageFromBackend}>Klicka här</button>
      <Login user = {user} postToApi = {postToApi} updateLoggedInUser = {updateLoggedInUser}></Login>
    </>
  )
}

export default App
