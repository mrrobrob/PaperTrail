export interface IParameter {
    name: string,
    value: string,
}

export interface ITask {
    name: string,    
    remindMeInDays: number,
}

export interface ICategory {
    name: string,
    filename: string,
    parameters: IParameter[],
    tasks: ITask[]
}

