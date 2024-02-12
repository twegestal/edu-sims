import { Box } from '@chakra-ui/react';
import Register from './pages/login/Register.jsx';
import PerformCase from './pages/cases/PerformCase.jsx';
import Home from './pages/Home.jsx';
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import ManageCases from './pages/admin/ManageCases.jsx';
import Login from './pages/login/Login.jsx';
import { useAuth } from './hooks/useAuth.jsx';
import ManageUsers from './pages/admin/userManagement/ManageUsers.jsx';
import ProfilePage from './pages/profile/ProfilePage.jsx';
import NavBar from './components/NavBar.jsx';
import CaseBuilder from './pages/caseBuilder/CaseBuilder.jsx';
import ManageLists from './pages/admin/listManagement/ManageLists.jsx';
import WithAdminAuth from './utils/WithAdminAuth.jsx';
import DisplayCase from './pages/cases/performCaseComponents/DisplayCase.jsx';

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
