import { Button } from '@chakra-ui/react';
import ShowAllCases from './showCases/show_all_cases.jsx';
import AdminOverview from './adminPage/adminOverview.jsx';
import { Link, Navigate } from 'react-router-dom';

export default function Home(props) {
  return (
    <>
      {(props.user.hasOwnProperty('id') && props.user.isAdmin == false) && (
        <div>
          <h2>{props.user.email}</h2>
          <ShowAllCases 
            getCallToApi={props.getCallToApi}
            user = {props.user}
          ></ShowAllCases>
        </div>
      )}

      {(props.user.hasOwnProperty('id') && props.user.isAdmin) && ( 
        <AdminOverview
          user={props.user}
          getCallToApi={props.getCallToApi}
        ></AdminOverview>
      )}

      {props.user.hasOwnProperty('id') == false && (
        <div>
          <h2>Du behöver logga in för att se innehållet</h2>
          <Link to='/login'>
            <Button>Logga in</Button>
          </Link>
        </div>
      )}
    </>
  );
}
