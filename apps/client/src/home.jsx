import ShowAllCases from './show_all_cases.jsx'
import { Link } from 'react-router-dom'

export default function Home(props) {
    
    return(
        <>
            {props.user.hasOwnProperty('id') &&
                <div>
                    <h2>{props.user.email}</h2>
                    <ShowAllCases
                    getCallToApi = {props.getCallToApi}>
                    </ShowAllCases>
                </div>
            }

            {props.user.hasOwnProperty('id') == false &&
                <div>
                    <h2>Du behöver logga in för att se innehållet</h2>
                    <Link to="/login">Login</Link>
                </div>
            }
        </>
    );
}