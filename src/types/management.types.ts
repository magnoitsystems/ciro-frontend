import type { TaskPriority, TaskStatus } from "./enums.types";

export interface SubtaskDTO {
    id?: number; 
    title: string;
    description: string;
    status?: TaskStatus;
    evaluation?: string;
}

export interface TaskCreateDTO {
    userId: number;
    taskDate: string; 
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    noteDescription?: string; 
    evaluation?: string;
    subtasks?: SubtaskDTO[];
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
    evaluation?: string;
    subtasks?: SubtaskDTO[];
}

export interface TaskWidgetDTO {
    pendingCount: number;
    pendingTasks: TaskResponseDTO[];
}

export interface NoteCreateDTO {
    description: string;
    date?: string;
    shiftId?: number;
    taskId?: number;
}

export interface NoteResponseDTO {
    id: number;
    description: string;
    date: string;
    shiftId?: number;
    taskId?: number;
}