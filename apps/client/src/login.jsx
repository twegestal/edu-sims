import { useState } from "react";

export default function Login(props) {
    const [emailInput, setEmailInput] = useState('Email');
    const [passwordInput, setPasswordInput] = useState('Password');

    const postToLogin = async (event) => {
        event.preventDefault();
        
        //TODO: kontrollera input

        const body = JSON.stringify({
            email : emailInput,
            password : passwordInput
        })
        
        const url = 'http://localhost:5173/api/user/login';

        const response = await props.postToApi(body, url);
        props.updateLoggedInUser(response.id);
    }

    return (
        <div>
            <form onSubmit={postToLogin}>
                <input type="text" value={emailInput} onChange={(e) => setEmailInput(e.target.value)}/>
                <input type="text" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} />
                <input type="submit" value="Logga in"/>
            </form>
        </div>
        
    );
}