import React, { useEffect } from 'react';

interface CameraProps {
    saveToOneDrive: (dataUrl: string) => void;
}

const Camera = (props: CameraProps) => {

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

        props.saveToOneDrive(dataUrl);

        video.play();
    }

    return <div>
        <video id="video" width="100%" autoPlay></video>
        <p>

            <button onClick={handleTakePicture}>Take Picture</button>
            <button onClick={handleUpload}>Upload</button>
        </p>
    </div>
}

export default Camera;