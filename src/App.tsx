import React, { useState } from 'react';
import './App.css';

import { Button, FormGroup } from "reactstrap";
import PaperTrail from './PaperTrail';
import { Header } from './Header';
import { OneDrive } from './api/OneDrive';

const oneDrive = new OneDrive();

const App = () => {

    const [username, setUsername] = useState<string>();

    const handleLogin = async () => {
        const user = await oneDrive.login();
        setUsername(user);
    }

    return <div className="App">
        <Header />
        {!username ?
            <>
                <FormGroup><Button onClick={handleLogin}>Log in</Button></FormGroup>
            </>
            :
            <>
                <p>Logged in as: {username}</p>
                <PaperTrail oneDrive={oneDrive} />
            </>
        }
    </div>

}

export default App;
