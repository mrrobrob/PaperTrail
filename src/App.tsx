import React, { useState } from 'react';
import './App.css';
import Camera from './Camera';
import * as msal from "@azure/msal-browser";
import { Categories } from './categories/All';

const App = () => {

    const categories = Categories;

    const [appId, setAppId] = useState("");
    const [username, setUsername] = useState<string>();
    const [oneDriveAuthToken, setOneDriveAuthToken] = useState("");
    const [oneDriveAppFolderId, setOneDriveAppFolderId] = useState("");
    const [currentCategory, setCurrentCategory] = useState(categories[0].name);
    const [uploadName, setUploadName] = useState("");


    const handleAppIdChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = evt.currentTarget;
        setAppId(value);
    }

    const handleCurrentCategoryChange = (evt: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = evt.currentTarget;
        setCurrentCategory(value);
    }

    const handleUploadNameChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = evt.currentTarget;
        setUploadName(value);
    }

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

    const getMsalInstance = () => {

        const msalConfig: msal.Configuration = {
            auth: {
                clientId: appId,
                authority: 'https://login.microsoftonline.com/consumers',
                redirectUri: window.location.origin
            }
        };

        const msalInstance = new msal.PublicClientApplication(msalConfig);

        return msalInstance;
    }

    const handleLogin = async () => {

        const msalInstance = getMsalInstance();

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

    const saveToOnedrive = async (dataUrl: string) => {
        const date = new Date();
        const dateString = `${date.toISOString().substring(0,10)}-${date.getHours()}${date.getMinutes()}${date.getSeconds()}`;
        const filename = `${dateString}-${uploadName}.jpg`;
        const response = await fetch(`https://graph.microsoft.com/v1.0/me/drive/items/${oneDriveAppFolderId}:/archive/${currentCategory}/${filename}:/content`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${oneDriveAuthToken}`,
                'Content-Type': 'text/plain'
            },
            body: await fetch(dataUrl).then(response => response.blob())
        });
        if (!response.ok) {
            throw new Error(await response.text());
        }
        console.log('Photo saved to OneDrive');
        setUploadName("");
    }

    return <div className="App">
        {!username ?
            <>
                <p><label>App Id: <input type="text" value={appId} onChange={handleAppIdChange} /></label></p>
                <p><button onClick={handleLogin}>Log in</button></p>
            </>
            :
            <>
                <p>Logged in as: {username}</p>
                <p>OneDrive App folder ID: {oneDriveAppFolderId}</p>
                <input value={uploadName} onChange={handleUploadNameChange} />
                <select onChange={handleCurrentCategoryChange} value={currentCategory}>
                    {categories.map(category => <option key={category.name}>{category.name}</option>)}
                </select>
                {oneDriveAppFolderId && oneDriveAuthToken &&
                    <Camera saveToOneDrive={saveToOnedrive} />
                }
            </>
        }
    </div>

}

export default App;
