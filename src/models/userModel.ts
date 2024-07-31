//src/models/userModel.ts
import { User, PaginatedUsersResponse } from '../types/userType';
import pool from '../utils/db';
import { RowDataPacket } from 'mysql2/promise';
import { Pagination } from '../utils/pagination';

type GetUsersResponse = {
  users: User[];
} & PaginatedUsersResponse;

const getCount = async (search: string, access_level_id?: number): Promise<number> => {
  try {
    // Construct the base query
    let query = `
      SELECT COUNT(id) AS total_count
      FROM users
      WHERE username LIKE ?
    `;

    // Add condition for access_level_id if it is provided
    if (typeof access_level_id === 'number' && !isNaN(access_level_id)) {
      query += ' AND access_level_id = ?';
    }

    // Define parameters based on the conditions
    const params: any[] = [`${search}%`];
    if (typeof access_level_id === 'number' && !isNaN(access_level_id)) {
      params.push(access_level_id);
    }

    // Execute the query
    const [countResults] = await pool.query<RowDataPacket[]>(query, params);

    // Return the total count
    return (countResults[0] as { total_count: number }).total_count || 0;
  } catch (error) {
    console.error('Error fetching count from database:', error);
    throw new Error('Failed to fetch count from database');
  }
};


const getUsersFromDatabase = async (pagination: Pagination, search: string, access_level_id?: number): Promise<User[]> => {
  try {
    // Construct the base query
    let query = `
      SELECT u.*, a.description
      FROM users u
      INNER JOIN access_level a ON u.access_level_id = a.id
      WHERE u.username LIKE ?
    `;
    

    // Add condition for access_level_id if it is provided
    if (typeof access_level_id === 'number' && !isNaN(access_level_id)) {
      query += ' AND u.access_level_id = ?';
    }

    // Add pagination
    query += ' LIMIT ? OFFSET ?';

    // Define parameters based on the conditions
    const params: any[] = [`${search}%`];
    if (typeof access_level_id === 'number' && !isNaN(access_level_id)) {
      params.push(access_level_id);
    }
    params.push(pagination.getLimit(), pagination.getOffset());

    // Execute the query
    const [rows] = await pool.query<RowDataPacket[]>(query, params);

    // Map rows to User type
    return rows.map(row => row as User);
  } catch (error) {
    console.error('Error fetching users from database:', error);
    throw new Error('Failed to fetch users from database');
  }
};


export const getUsers = async (page: number, limit: number , search: string, access_level_id: number): Promise<GetUsersResponse> => {
  try {
    const pagination = new Pagination(page, limit);
    const totalCount = await getCount(search,access_level_id);
    const { totalPages } = pagination.getPaginationInfo(totalCount);
    const users = await getUsersFromDatabase(pagination, search, access_level_id);

    return {
      page,
      totalPages,
      totalCount,
      users,
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }

};

export const getUserById = async (id: number): Promise<User | null> => {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM users WHERE id = ?', [id]);
    // Get the first row and map it to User type
    const userRow = rows[0] as User;
    return userRow;
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error);
    throw new Error('Failed to fetch user');
  }
};
