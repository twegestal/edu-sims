import { useState } from 'react';
import Register from './register.jsx';
import PerformCase from './perform_case.jsx';
import Home from './home.jsx';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import CreateCase from './create_case/createCase.jsx';
import Login from './login.jsx';
import { useAuth } from './hooks/useAuth.jsx';
import { Button } from '@chakra-ui/react';

export default function App() {
  const { user, logout } = useAuth();

  return (
    <>
      {user ? (
        <>
          <h2>Logged in</h2>
          <Home />
          <Button onClick={logout}>Logout</Button>
        </>
      ) : (
        <Login />
      )}
    </>
  );

  // return (
  //   <>
  //     {groupId != null && (
  //       <Register
  //         postCallToApi={postCallToApi}
  //         getCallToApi={getCallToApi}
  //         updateLoggedInUser={updateLoggedInUser}
  //         groupId={groupId}
  //       ></Register>
  //     )}

  //     <Routes>
  //       <Route path='/' element={<Home user={user} getCallToApi={getCallToApi}></Home>} />
  //       <Route
  //         path='/login'
  //         element={
  //           <Login
  //             user={user}
  //             postToApi={postCallToApi}
  //             updateLoggedInUser={updateLoggedInUser}
  //             getCallToApi={getCallToApi}
  //           ></Login>
  //         }
  //       />
  //       <Route path='/case'>
  //         <Route
  //           path=':caseid'
  //           element={<PerformCase getCallToApi={getCallToApi}></PerformCase>}
  //         ></Route>
  //       </Route>
  //       <Route
  //         path='/test'
  //         element={
  //           <CreateCase getCallToApi={getCallToApi} postCallToApi={postCallToApi}></CreateCase>
  //         }
  //       ></Route>
  //     </Routes>
  //   </>
  // );
}
