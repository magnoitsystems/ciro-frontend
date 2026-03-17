export type Role = 'USER' | 'ADMIN';

export interface UserCreateDTO {
    name: string;
    lastname: string;
    username: string;
    password: string;
    color: string;
}

export interface UserResponseDTO {
    id: number;
    name: string;
    lastname: string;
    username: string;
    color: string;
    role: Role;
}