import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../database';
import { Todo, CreateTodoRequest, UpdateTodoRequest, TodoFilters, TodoStats } from '../types/todo';

const router = Router();

// Get all todos with filtering
router.get('/', async (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const filters: TodoFilters = req.query;
    
    let query = 'SELECT * FROM todos WHERE 1=1';
    const params: any[] = [];
    
    if (filters.completed !== undefined) {
      query += ' AND completed = ?';
      params.push(filters.completed);
    }
    
    if (filters.priority) {
      query += ' AND priority = ?';
      params.push(filters.priority);
    }
    
    if (filters.category) {
      query += ' AND category = ?';
      params.push(filters.category);
    }
    
    if (filters.search) {
      query += ' AND (title LIKE ? OR description LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm);
    }
    
    if (filters.due_date) {
      query += ' AND due_date = ?';
      params.push(filters.due_date);
    }
    
    query += ' ORDER BY created_at DESC';
    
    db.all(query, params, (err, rows) => {
      if (err) {
        console.error('Error fetching todos:', err);
        return res.status(500).json({ error: 'Failed to fetch todos' });
      }
      
      res.json(rows);
    });
  } catch (error) {
    console.error('Error in GET /todos:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get todo by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const { id } = req.params;
    
    db.get('SELECT * FROM todos WHERE id = ?', [id], (err, row) => {
      if (err) {
        console.error('Error fetching todo:', err);
        return res.status(500).json({ error: 'Failed to fetch todo' });
      }
      
      if (!row) {
        return res.status(404).json({ error: 'Todo not found' });
      }
      
      res.json(row);
    });
  } catch (error) {
    console.error('Error in GET /todos/:id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new todo
router.post('/', async (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const todoData: CreateTodoRequest = req.body;
    
    if (!todoData.title || todoData.title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const id = uuidv4();
    const now = new Date().toISOString();
    
    const query = `
      INSERT INTO todos (id, title, description, priority, due_date, category, tags, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      id,
      todoData.title.trim(),
      todoData.description?.trim() || null,
      todoData.priority || 'medium',
      todoData.due_date || null,
      todoData.category?.trim() || null,
      todoData.tags?.trim() || null,
      now,
      now
    ];
    
    db.run(query, params, function(err) {
      if (err) {
        console.error('Error creating todo:', err);
        return res.status(500).json({ error: 'Failed to create todo' });
      }
      
      // Fetch the created todo
      db.get('SELECT * FROM todos WHERE id = ?', [id], (err, row) => {
        if (err) {
          console.error('Error fetching created todo:', err);
          return res.status(500).json({ error: 'Failed to fetch created todo' });
        }
        
        res.status(201).json(row);
      });
    });
  } catch (error) {
    console.error('Error in POST /todos:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update todo
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const { id } = req.params;
    const updateData: UpdateTodoRequest = req.body;
    
    // Check if todo exists
    db.get('SELECT * FROM todos WHERE id = ?', [id], (err, row) => {
      if (err) {
        console.error('Error checking todo existence:', err);
        return res.status(500).json({ error: 'Failed to check todo' });
      }
      
      if (!row) {
        return res.status(404).json({ error: 'Todo not found' });
      }
      
      // Build update query dynamically
      const updates: string[] = [];
      const params: any[] = [];
      
      if (updateData.title !== undefined) {
        updates.push('title = ?');
        params.push(updateData.title.trim());
      }
      
      if (updateData.description !== undefined) {
        updates.push('description = ?');
        params.push(updateData.description?.trim() || null);
      }
      
      if (updateData.completed !== undefined) {
        updates.push('completed = ?');
        params.push(updateData.completed);
      }
      
      if (updateData.priority !== undefined) {
        updates.push('priority = ?');
        params.push(updateData.priority);
      }
      
      if (updateData.due_date !== undefined) {
        updates.push('due_date = ?');
        params.push(updateData.due_date || null);
      }
      
      if (updateData.category !== undefined) {
        updates.push('category = ?');
        params.push(updateData.category?.trim() || null);
      }
      
      if (updateData.tags !== undefined) {
        updates.push('tags = ?');
        params.push(updateData.tags?.trim() || null);
      }
      
      if (updates.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
      }
      
      updates.push('updated_at = ?');
      params.push(new Date().toISOString());
      params.push(id);
      
      const query = `UPDATE todos SET ${updates.join(', ')} WHERE id = ?`;
      
      db.run(query, params, function(err) {
        if (err) {
          console.error('Error updating todo:', err);
          return res.status(500).json({ error: 'Failed to update todo' });
        }
        
        // Fetch the updated todo
        db.get('SELECT * FROM todos WHERE id = ?', [id], (err, row) => {
          if (err) {
            console.error('Error fetching updated todo:', err);
            return res.status(500).json({ error: 'Failed to fetch updated todo' });
          }
          
          res.json(row);
        });
      });
    });
  } catch (error) {
    console.error('Error in PUT /todos/:id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete todo
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const { id } = req.params;
    
    db.run('DELETE FROM todos WHERE id = ?', [id], function(err) {
      if (err) {
        console.error('Error deleting todo:', err);
        return res.status(500).json({ error: 'Failed to delete todo' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Todo not found' });
      }
      
      res.json({ message: 'Todo deleted successfully' });
    });
  } catch (error) {
    console.error('Error in DELETE /todos/:id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get todo statistics
router.get('/stats/overview', async (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    
    const stats: TodoStats = {
      total: 0,
      completed: 0,
      pending: 0,
      overdue: 0,
      byPriority: { low: 0, medium: 0, high: 0 },
      byCategory: {}
    };
    
    // Get basic counts
    db.get('SELECT COUNT(*) as total FROM todos', (err, row) => {
      if (err) {
        console.error('Error getting total count:', err);
        return res.status(500).json({ error: 'Failed to get statistics' });
      }
      
        stats.total = row.total;
        
        // Get completed count
        db.get('SELECT COUNT(*) as completed FROM todos WHERE completed = 1', (err, row) => {
          if (err) {
            console.error('Error getting completed count:', err);
            return res.status(500).json({ error: 'Failed to get statistics' });
          }
          
          stats.completed = row.completed;
          stats.pending = stats.total - stats.completed;
          
          // Get priority counts
          db.all('SELECT priority, COUNT(*) as count FROM todos GROUP BY priority', (err, rows) => {
            if (err) {
              console.error('Error getting priority counts:', err);
              return res.status(500).json({ error: 'Failed to get statistics' });
            }
            
            rows.forEach((row: any) => {
              if (row.priority) {
                stats.byPriority[row.priority as keyof typeof stats.byPriority] = row.count;
              }
            });
            
            // Get category counts
            db.all('SELECT category, COUNT(*) as count FROM todos WHERE category IS NOT NULL GROUP BY category', (err, rows) => {
              if (err) {
                console.error('Error getting category counts:', err);
                return res.status(500).json({ error: 'Failed to get statistics' });
              }
              
              rows.forEach((row: any) => {
                if (row.category) {
                  stats.byCategory[row.category] = row.count;
                }
              });
              
              // Get overdue count
              const today = new Date().toISOString().split('T')[0];
              db.get('SELECT COUNT(*) as overdue FROM todos WHERE due_date < ? AND completed = 0', [today], (err, row) => {
                if (err) {
                  console.error('Error getting overdue count:', err);
                  return res.status(500).json({ error: 'Failed to get statistics' });
                }
                
                stats.overdue = row.overdue;
                res.json(stats);
              });
            });
          });
        });
    });
  } catch (error) {
    console.error('Error in GET /todos/stats/overview:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;