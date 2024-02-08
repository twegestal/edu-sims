import { Box } from '@chakra-ui/react';
import Register from './register.jsx';
import PerformCase from './perform_case.jsx';
import Home from './home.jsx';
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import ManageCases from './adminPage/manageCases.jsx';
import Login from './login.jsx';
import { useAuth } from './hooks/useAuth.jsx';
import ManageUsers from './adminPage/manageUsers.jsx';
import ProfilePage from './profilePage/profilePage.jsx';
import NavBar from './components/NavBar.jsx';
import CaseBuilder from './create_case/CaseBuilder.jsx';
import ManageLists from './adminPage/ManageLists.jsx';
import WithAdminAuth from './adminPage/WithAdminAuth.jsx';
import DisplayCase from './performCaseComponents/DisplayCase.jsx';

export default function App() {
  const { user } = useAuth();
  const location = useLocation();

  const isPerformCaseRoute = location.pathname.startsWith('/case/');
  const isRegisterRoute = location.pathname.startsWith('/register');

  return (
    <>
      <Box id='container' bg='brand.bg'>
        {!isPerformCaseRoute && <NavBar />}
        <Routes>
          <Route path='/register/:groupId' element={<Register />}></Route>
        </Routes>
        {user && (
          <>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/profilePage' element={<ProfilePage />}></Route>
              <Route path='/case'>
                <Route path=':caseid/:attemptid' element={<PerformCase />} />
              </Route>
              <Route path='/caseRedux' element={<DisplayCase />} />

              <Route
                path='/manageCases'
                element={<WithAdminAuth>{() => <ManageCases />}</WithAdminAuth>}
              />
              <Route
                path='/manageUsers'
                element={<WithAdminAuth>{() => <ManageUsers />}</WithAdminAuth>}
              />
              <Route
                path='/caseBuilder'
                element={<WithAdminAuth>{() => <CaseBuilder />}</WithAdminAuth>}
              />
              <Route
                path='/manageLists'
                element={<WithAdminAuth>{() => <ManageLists />}</WithAdminAuth>}
              />
            </Routes>
          </>
        )}
        {!user && !isRegisterRoute && <Login />}
      </Box>
    </>
  );
}
