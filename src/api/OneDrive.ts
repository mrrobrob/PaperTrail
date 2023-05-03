import { ICategory } from "../categories/Models";
import * as msal from "@azure/msal-browser";
import { GetFilename } from "./FileNamer";

export class OneDrive {
    authToken = "";
    appFolderId = "";

    uploadFile = async (fileBlob: Blob, category: ICategory) => {
        const filename = GetFilename(category);
        const fileExtension = "jpg";
        const response = await fetch(`https://graph.microsoft.com/v1.0/me/drive/items/${this.appFolderId}:/archive/${category.name}/${filename}.${fileExtension}:/content`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${this.authToken}`,
                'Content-Type': 'text/plain'
            },
            body: fileBlob
        });
        if (!response.ok) {
            throw new Error(await response.text());
        }

        console.log('Photo saved to OneDrive');
    }

    login = async () => {

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

            this.authToken = authResult.accessToken;

            const response = await fetch('https://graph.microsoft.com/v1.0/me/drive/special/approot', {
                headers: {
                    'Authorization': `Bearer ${this.authToken}`
                }
            });
            if (!response.ok) {
                throw new Error(await response.text());
            }

            const json = await response.json();

            this.appFolderId = json.id;

            return authResult.account?.username;

        } catch (error) {
            console.error(error);
        }
    }

}
