import ShowAllCases from './show_all_cases.jsx';
import { useAuth } from './hooks/useAuth.jsx';

export default function Home() {
  const { user } = useAuth();
  return (
    <>
      {user && (
        <div>
          <h2>{user.email}</h2>
          <ShowAllCases />
        </div>
      )}

      {/* {props.user.hasOwnProperty('id') == false && (
        <div>
          <h2>Du behöver logga in för att se innehållet</h2>
          <Link to='/login'>
            <Button>Logga in</Button>
          </Link>
        </div>
      )} */}
    </>
  );
}
