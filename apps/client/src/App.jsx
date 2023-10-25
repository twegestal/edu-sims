import { useState } from 'react'
import Login from './login.jsx'
import Register from './register.jsx'
import PerformCase from './perform_case.jsx'
import Home from './home.jsx'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Introduction from './introduction.jsx';

function App() {
  const [message, setMessage] = useState('');
  const [user, setUser] = useState({});

  const urlParams = new URLSearchParams(window.location.search);
  const groupId = urlParams.get("groupId");
  const isIntroduction = urlParams.get("isIntroduction");

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
      {groupId != null && 
        <Register
        postCallToApi = {postCallToApi}
        getCallToApi = {getCallToApi}
        updateLoggedInUser = {updateLoggedInUser}
        groupId = {groupId}></Register>
      }

      <Routes>
        <Route path='/' element={<Home
          user={user}
          getCallToApi = {getCallToApi}
        ></Home>}/>
        <Route path='/login'  element={<Login
          user = {user}
          postToApi = {postCallToApi}
          updateLoggedInUser = {updateLoggedInUser}
          getCallToApi = {getCallToApi}
        ></Login>}/>
        <Route path="/case">
            <Route path=":caseid" element={
              <PerformCase
                getCallToApi = {getCallToApi}
              ></PerformCase>}>
            </Route>
        </Route>
      </Routes>
      
    </>
  )
}

export default App
