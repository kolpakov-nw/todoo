export type TodoFilter = 'all' | 'completed' | 'active'

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
}

export interface UpdateTodoStatusDto {
  completed: boolean;

}

export interface TodosApiResponse {
  todos: Todo[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  count?: number;
}