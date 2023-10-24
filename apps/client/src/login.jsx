import { useState } from "react";
import { Input, Button } from '@chakra-ui/react'

export default function Login(props) {
    const [emailInput, setEmailInput] = useState('Email');
    const [passwordInput, setPasswordInput] = useState('Password');

    const postToLogin = async (event) => {
        event.preventDefault();
        
        if (emailInput != 'Email' && passwordInput != 'Password') {
            const body = JSON.stringify({
                email : emailInput,
                password : passwordInput
            })
    
            const response = await props.postToApi(body, 'http://localhost:5173/api/user/login');


            const headers = {
                "Content-type" : "application/json",
                "user_id" : response.id
            }
            const user = await props.getCallToApi('http://localhost:5173/api/user', headers);


            props.updateLoggedInUser(user.id, user.email, user.is_admin);
        }

        
    }

    return (
        <div>
            <form onSubmit={postToLogin}>
                <Input placeholder="Email" onChange={(e) => setEmailInput(e.target.value)}/>
                <Input placeholder="Password" onChange={(e) => setPasswordInput(e.target.value)} />
                <Button type="submit">Logga in</Button>
            </form>
        </div>
        
    );
}