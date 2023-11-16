import Register from './register.jsx';
import PerformCase from './perform_case.jsx';
import Home from './home.jsx';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import CreateCase from './create_case/createCase.jsx';
import ManageCases from './adminPage/manageCases.jsx';
import Login from './login.jsx';
import { useAuth } from './hooks/useAuth.jsx';
import { Button } from '@chakra-ui/react';
import ShowStatistics from './statistics/showStatistics.jsx';
import ManageUsers from './adminPage/manageUsers.jsx';

export default function App() {
  const { user, logout } = useAuth();
  const groupId = null;

  return (
    <>
      {groupId !== null && (
        <Register groupId={groupId}></Register>
      )}
      {user ? (
        <>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/case'>
              <Route path=':caseid' element={<PerformCase />} />
            </Route>
            <Route path='/createCase' element={<CreateCase />}></Route>
            <Route path='/manageCases' element={<ManageCases />}></Route>
            <Route path='/showStatistics' element={<ShowStatistics />} />
            <Route path='/manageUsers' element={<ManageUsers />}></Route>
          </Routes>
          <Button onClick={logout}>Logout</Button>
        </>
      ) : (
        <Login />
      )}
    </>
  );
}
