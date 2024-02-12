import ShowAllCases from './cases/ShowAllCases.jsx';
import AdminOverview from './admin/AdminOverview.jsx';
import { useAuth } from '../hooks/useAuth.jsx';

export default function Home() {
  const { user } = useAuth();
  return (
    <>
      {!user.isAdmin ? (
        <div>
          <ShowAllCases />
        </div>
      ) : (
        <AdminOverview />
      )}
    </>
  );
}
