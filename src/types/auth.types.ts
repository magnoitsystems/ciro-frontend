export interface AuthResponseDTO {
    accessToken: string;
    refreshToken: string;
    userId: number;
    name: string;
    color?: string; 
}

export interface LoginRequestDTO {
    username: string;
    password: string;
}

export interface RefreshTokenRequestDTO {
    refreshToken: string;
}