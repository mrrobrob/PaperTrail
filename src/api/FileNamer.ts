import { ICategory } from "../categories/Models";


export const GetFilename = (category: ICategory) => {

    const filenameTemplate = category.filename || "$$date_dmy$$/$$date_time$$";

    const date = new Date();

    const dmyString = date.toISOString().substring(0, 10);
    const timeString = `${date.getHours()}${date.getMinutes()}${date.getSeconds()}`;
    const fullDateString = `${dmyString}-${timeString}`;
    

    let filename = filenameTemplate
        .replaceAll("$$date_dmy$$", dmyString)
        .replaceAll("$$date_time$$", timeString)
        .replaceAll("$$date_full$$", fullDateString);

    category.parameters.forEach(parameter => {
        filename = filename.replaceAll(`$$${parameter.name}$$`, parameter.value);
    })

    if (filename.includes("$$")) {
        throw new Error("aborting due to unresolved parameters - remaining filename template : " + filename);
    }

    return filename;
}