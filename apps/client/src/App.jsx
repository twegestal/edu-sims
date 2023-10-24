import { useState } from 'react'
import Login from './login.jsx'
import Register from './register.jsx'
import './App.css'
import Introduction from './introduction.jsx';

function App() {
  const [message, setMessage] = useState('');
  const [user, setUser] = useState({});

  const urlParams = new URLSearchParams(window.location.search);
  const groupId = urlParams.get("groupId");

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
    console.log('apiResponse efter json: ' + apiResponse);

    return apiResponse;
  }

  return (
    <>
      {groupId != null && 
        <Register
        postCallToApi = {postCallToApi}
        getCallToApi = {getCallToApi}
        updateLoggedInUser = {updateLoggedInUser}
        groupId = {groupId}></Register>
      }
      {groupId === null &&
        <div>
          <h1>{message}</h1>
        <button onClick={handleFetchMessageFromBackend}>Klicka här</button>
        <Login user = {user}
        postToApi = {postCallToApi}
        updateLoggedInUser = {updateLoggedInUser}
        getCallToApi = {getCallToApi}></Login>

        <Introduction user = {user}
        getCallToApi = {getCallToApi}>

        </Introduction>
        </div>
      }

      
      

      
      <h1>{user.email}</h1>
      
    </>
  )
}

export default App
