//src/type/userType.ts
export interface User {
    id: number;
    access_level_id: number;
    username: string;
    email: string;
    // password: string;
    description: string;
  }

  export interface PaginatedUsersResponse {
    totalPages: number;
    totalCount: number;
    page: number;
  }