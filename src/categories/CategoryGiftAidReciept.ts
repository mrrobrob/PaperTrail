import { ICategory } from "./Models";

export const CategoryGiftAidReciept: ICategory = {
    name: "Gift Aid Reciept",
    filename: "$$date_year$$/$$date_full$$-$$name$$",
    parameters: [
        { name: "name", value: "" }
    ],
    tasks: []
}