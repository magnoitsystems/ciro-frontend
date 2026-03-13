// src/types/users.types.ts

export interface User {
    id: number;
    name: string;
    lastname: string;
    username: string;
    color: string;
}


export interface UserCreateDTO {
    name: string;
    lastname: string;
    username: string;
    password: string;
    color: string;
}
