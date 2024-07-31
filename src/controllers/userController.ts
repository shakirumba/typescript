import { Request, Response } from 'express';
import { getUserById, getUsers } from '../models/userModel';



export const getUsersController = async (req: Request, res: Response) => {
  try {
    // Extract and parse query parameters
    const page = parseInt(req.query.page as string, 10) || 1; 
    const limit = parseInt(req.query.limit as string, 10) || 10; 
    const search = req.query.search as string;
    const access_level_id = parseInt(req.query.access_level_id as string, 10); 

    const users = await getUsers(page, limit, search,access_level_id);

    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' }); 
  }
};


export const getUserByIdController = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await getUserById(parseInt(id));
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
