import React, { useState } from 'react';
import { Alert, Button, FormGroup, Input } from 'reactstrap';
import { OneDrive } from './api/OneDrive';
import { Categories } from './categories/All';

interface PaperTrailProps {
    oneDrive: OneDrive;
}

const PaperTrail = (props: PaperTrailProps) => {

    const [uploadSuccess, setUploadSuccess] = useState(false);

    const categories = Categories;

    const [currentCategory, setCurrentCategory] = useState(categories[0]);

    const handleCurrentCategoryChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = evt.currentTarget;
        setCurrentCategory(categories.find(e=>e.name === value)!);
    }

    const handleParameterChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = evt.currentTarget;

        console.log(`set ${name} to ${value}`)

        setCurrentCategory({
            ...currentCategory,
            parameters: [...currentCategory.parameters.map(e => e.name === name ? {...e, value: value} : e)]
        })
    }

    const handleUpload = async () => {

        const fileInput = document.getElementById("fileInput") as HTMLInputElement;
        if (fileInput.files && fileInput.files[0]) {

            await props.oneDrive.uploadFile(fileInput.files[0], currentCategory);
            
            setUploadSuccess(true);

        }
    }

    return <div>

        <FormGroup>
            <Input type="select" value={currentCategory.name} onChange={handleCurrentCategoryChange}>
                {categories.map(category => <option key={category.name}>{category.name}</option>)}
            </Input>
        </FormGroup>
        <FormGroup>
            {currentCategory.parameters.map(param =>
                <Input type="text" key={param.name} name={param.name} value={param.value} onChange={handleParameterChange} />
            )}
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