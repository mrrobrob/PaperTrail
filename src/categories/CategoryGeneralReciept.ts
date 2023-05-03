import { ICategory } from "./Models";

export const CategoryGeneralReciept: ICategory = {
    name: "General Reciept",
    filename: "$$date_year$$/$$date_full$$-$$name$$",
    parameters: [
        { name: "name", value: "" }
    ],
    tasks: []
}