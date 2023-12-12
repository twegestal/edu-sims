import { Box } from '@chakra-ui/react';
import Register from './register.jsx';
import PerformCase from './perform_case.jsx';
import Home from './home.jsx';
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import ManageCases from './adminPage/manageCases.jsx';
import Login from './login.jsx';
import { useAuth } from './hooks/useAuth.jsx';
import ShowStatistics from './statistics/showStatistics.jsx';
import ManageUsers from './adminPage/manageUsers.jsx';
import ProfilePage from './profilePage/profilePage.jsx';
import NavBar from './components/NavBar.jsx';
import CaseBuilder from './create_case/CaseBuilder.jsx';
import ManageLists from './adminPage/ManageLists.jsx';

export default function App() {
  const { user } = useAuth();
  const location = useLocation();

  const isPerformCaseRoute = location.pathname.startsWith('/case');

  return (
    <>
      <Box id='container' bg='brand.bg'>
        {!isPerformCaseRoute && <NavBar />}
        {user ? (
          <>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/case'>
                <Route path=':caseid/:attemptid/:reload' element={<PerformCase />} />
              </Route>
              <Route path='/manageCases' element={<ManageCases />}></Route>
              <Route path='/showStatistics' element={<ShowStatistics />} />
              <Route path='/manageUsers' element={<ManageUsers />}></Route>
              <Route path='/caseBuilder' element={<CaseBuilder />} />
              <Route path='/profilePage' element={<ProfilePage />}></Route>
              <Route path='/manageLists' element={<ManageLists />} />
            </Routes>
          </>
        ) : (
          <>
            <Routes>
              <Route path='/register/:groupId' element={<Register />}></Route>
            </Routes>
            <Login />
          </>
        )}
      </Box>
    </>
  );
}
