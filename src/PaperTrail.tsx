import React, { useEffect, useState } from 'react';
import { Button, FormGroup, Input } from 'reactstrap';
import { Categories } from './categories/All';

interface PaperTrailProps {
    oneDriveAppFolderId: string;
    oneDriveAuthToken: string;
}

const PaperTrail = (props: PaperTrailProps) => {

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



    useEffect(() => {

        navigator.mediaDevices
            .enumerateDevices()
            .then((devices) => {
                devices.forEach((device) => {
                    console.log(`${device.kind}: ${device.label} id = ${device.deviceId}`);
                });
            });

        navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
            .then(stream => {
                const video = document.getElementsByTagName('video')[0];
                video.srcObject = stream;
                video.play();
            })
            .catch(err => console.error('Error accessing user media:', err));
    });

    const handleTakePicture = () => {
        const video = document.getElementsByTagName('video')[0];
        video.pause();
    }

    const handleUpload = async () => {
        const video = document.getElementsByTagName('video')[0];

        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            throw new Error("Could not get 2d context")
        }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL();

        saveToOneDrive(dataUrl);

        video.play();
    }

    return <div>
        <video id="video" autoPlay></video>
        <input type="file" accept="image/*;capture=camera" />
        <FormGroup>
            <Input type="text" value={uploadName} onChange={handleUploadNameChange} />
        </FormGroup>
        <FormGroup>
            <Input type="select" value={currentCategory} onChange={handleCurrentCategoryChange}>
                {categories.map(category => <option key={category.name}>{category.name}</option>)}
            </Input>
        </FormGroup>
        <p>

            <Button onClick={handleTakePicture}>Take Picture</Button>
            {" "}
            <Button onClick={handleUpload}>Upload</Button>
        </p>

    </div>
}

export default PaperTrail;