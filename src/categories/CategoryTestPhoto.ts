import { ICategory } from "./Models";

export const CategoryTestPhoto: ICategory = {
    name: "Test Photo",
    filename: "$$date_year$$/$$date_full$$-$$name$$",
    parameters: [
        { name: "name", value: "" }
    ],
    tasks: []
}