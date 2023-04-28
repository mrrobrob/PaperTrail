import React, { useState } from 'react';
import './App.css';
import * as msal from "@azure/msal-browser";
import { Button, FormGroup } from "reactstrap";
import PaperTrail from './PaperTrail';

const App = () => {

    const [username, setUsername] = useState<string>();
    const [oneDriveAuthToken, setOneDriveAuthToken] = useState("");
    const [oneDriveAppFolderId, setOneDriveAppFolderId] = useState("");

    async function getAppFolderId(accessToken: string) {
        const response = await fetch('https://graph.microsoft.com/v1.0/me/drive/special/approot', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        if (!response.ok) {
            throw new Error(await response.text());
        }
        const data = await response.json();
        return data.id;
    }

    const handleLogin = async () => {

        const msalConfig: msal.Configuration = {
            auth: {
                clientId: "ebec8b29-59be-4401-bdcd-58b5b20f0891",
                authority: 'https://login.microsoftonline.com/consumers',
                redirectUri: window.location.origin
            }
        };

        const msalInstance = new msal.PublicClientApplication(msalConfig);

        try {
            const loginRequest = {
                scopes: ['Files.ReadWrite.AppFolder'],
                prompt: "select_account"
            }

            const authResult = await msalInstance.loginPopup(loginRequest);
            setUsername(authResult.account?.username);
            console.log('Access token:', authResult.accessToken);
            setOneDriveAuthToken(authResult.accessToken);
            const appFolderId = await getAppFolderId(authResult.accessToken);
            console.log('App folder ID:', appFolderId);
            setOneDriveAppFolderId(appFolderId);
        } catch (error) {
            console.error(error);
        }
    }

    return <div className="App">
        {!username ?
            <>
                <FormGroup><Button onClick={handleLogin}>Log in</Button></FormGroup>
            </>
            :
            <>
                <p>Logged in as: {username}</p>

                {oneDriveAppFolderId && oneDriveAuthToken &&
                    <PaperTrail oneDriveAppFolderId={oneDriveAppFolderId} oneDriveAuthToken={oneDriveAuthToken} />
                }
            </>
        }
    </div>

}

export default App;
