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
    parameters: IParameter[],
    tasks: ITask[]
}

