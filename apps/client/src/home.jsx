import ShowAllCases from './showCases/show_all_cases.jsx';
import AdminOverview from './adminPage/adminOverview.jsx';
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
        <AdminOverview />
      )}
    </>
  );
}
