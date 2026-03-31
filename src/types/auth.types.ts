export type Role = 'USER' | 'ADMIN';

export interface AuthResponseDTO {
    accessToken: string;
    refreshToken: string;
    userId: number;
    name: string;
    color?: string; 
    role: Role;
}

export interface LoginRequestDTO {
    username: string;
    password: string;
}

export interface RefreshTokenRequestDTO {
    refreshToken: string;
}