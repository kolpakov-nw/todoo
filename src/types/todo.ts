export type TodoFilter = 'all' | 'completed' | 'active';

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
}

export interface CreateTodoDto {
  text: string;
}

export interface UpdateTodoDto {
  text: string;
  completed: boolean;
}

export interface TodosResponse {
  data: Todo[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
