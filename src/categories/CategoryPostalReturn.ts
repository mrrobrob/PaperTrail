import { ICategory } from "./Models";

export const CategoryPostalReturn : ICategory = {
    name: "Postal Return",
    parameters: [ ],
    tasks: [{
        name: "Check return for $$_name_$$",
        remindMeInDays: 14
    }]
}