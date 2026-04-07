import type { TaskPriority, TaskStatus } from "./enums.types";

export interface TaskCreateDTO {
    userId: number;
    taskDate: string; 
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    noteDescription?: string; 
}

export interface TaskResponseDTO {
    id: number;
    userId: number;
    userFullName: string;
    taskDate: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    noteDescription?: string;
}
