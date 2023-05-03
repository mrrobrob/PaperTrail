import { ICategory } from "./Models";

export const CategoryPostalReturn : ICategory = {
    name: "Postal Return",
    filename: "$$date_year$$/$$date_full$$-$$name$$",
    parameters: [
        { name: "name", value: "" }
    ],
    tasks: [{
        name: "Check return for $$_name_$$",
        remindMeInDays: 14
    }]
}