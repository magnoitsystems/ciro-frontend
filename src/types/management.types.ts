import type { Shift } from "./clinical.types";
import type { TaskPriority, TaskStatus } from "./enums.types";
import type { User } from "./users.types";

export interface Task {
    id?: number;
    user: User;
    taskDate: string; 
    title: string;
    description?: string;
    status: TaskStatus;
    priority: TaskPriority;
}

export interface Note {
    id?: number;
    description: string;
    date: string;
    shift?: Shift;
    task?: Task;
}