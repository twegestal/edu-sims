import {useState} from 'react';
import {Input, Button} from '@chakra-ui/react';

export default function Register(props) {
    const [emailInput, setEmailInput] = useState('Email');
    const [passwordInput, setPasswordInput] = useState('Password');

    const postToRegister = async (event) => {
        event.preventDefault();

        const groupId = props.groupId;
        if (emailInput != 'Email' && passwordInput != 'Password') {
            const body = JSON.stringify({
                email : emailInput,
                password : passwordInput,
                group_id : groupId
            })

            const response = await props.postCallToApi(body, 'http://localhost:5173/api/user/register');

            console.log('returnerat användarobj' + response);

            const headers = {
                "Content-type" : "application/json",
                "user_id" : response.id
            }
            const user = await props.getCallToApi('http://localhost:5173/api/user', headers);

            props.updateLoggedInUser(user.id, user.email, user.is_admin);
            
            window.history.pushState('state', 'title', '/');
        }
    }

    
    return (
        <div>
            <form onSubmit={postToRegister}>
                <Input placeholder='Email' onChange={(e) => setEmailInput(e.target.value)}/>
                <Input placeholder='Password' onChange={(e) => setPasswordInput(e.target.value)} />
                <Button type="submit">Skapa konto</Button>
            </form>
        </div>
    )
}