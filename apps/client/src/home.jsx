import ShowAllCases from './show_all_cases.jsx';
import AdminOverview from './adminPage/adminOverview.jsx';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth.jsx';

export default function Home() {
  const { user } = useAuth();
  return (
    <>
      {!user.isAdmin ? (
        <div>
          <h2>{user.email}</h2>
          <ShowAllCases />
        </div>
      ) : (
        <AdminOverview
          user={user}
        ></AdminOverview>
      )}
    </>
  );
}
