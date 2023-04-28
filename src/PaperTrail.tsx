import React, { useEffect, useState } from 'react';
import { Alert, Button, FormGroup, Input, Toast, ToastBody } from 'reactstrap';
import { Categories } from './categories/All';

interface PaperTrailProps {
    oneDriveAppFolderId: string;
    oneDriveAuthToken: string;
}

const PaperTrail = (props: PaperTrailProps) => {

    const [uploadSuccess, setUploadSuccess] = useState(false);

    const categories = Categories;

    const [currentCategory, setCurrentCategory] = useState(categories[0].name);
    const [uploadName, setUploadName] = useState("");

    const handleCurrentCategoryChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = evt.currentTarget;
        setCurrentCategory(value);
    }

    const handleUploadNameChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = evt.currentTarget;
        setUploadName(value);
    }

    const saveToOneDrive = async (dataUrl: string) => {
        const date = new Date();
        const dateString = `${date.toISOString().substring(0, 10)}-${date.getHours()}${date.getMinutes()}${date.getSeconds()}`;
        const filename = `${dateString}-${uploadName}.jpg`;
        const response = await fetch(`https://graph.microsoft.com/v1.0/me/drive/items/${props.oneDriveAppFolderId}:/archive/${currentCategory}/${filename}:/content`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${props.oneDriveAuthToken}`,
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
    
    const handleUpload = async () => {

        const fileInput = document.getElementById("fileInput") as HTMLInputElement;
        if (fileInput.files && fileInput.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                const result = e.target!.result as string;

                if (result) {
                    saveToOneDrive(result);
                    setUploadSuccess(true);
                }
            }

            reader.readAsDataURL(fileInput.files[0]);
        }
    }

    return <div>
        
        <FormGroup>
            <Input type="select" value={currentCategory} onChange={handleCurrentCategoryChange}>
                {categories.map(category => <option key={category.name}>{category.name}</option>)}
            </Input>
        </FormGroup>
        <FormGroup>
            <Input type="text" value={uploadName} onChange={handleUploadNameChange} />
        </FormGroup>
        <FormGroup>
            <Input id="fileInput" type="file" accept="image/*;capture=camera" />
        </FormGroup>
        <FormGroup>
            <Button onClick={handleUpload}>Upload</Button>
        </FormGroup>
        {uploadSuccess && <Alert variant="success">File uploaded</Alert>}

    </div>
}

export default PaperTrail;