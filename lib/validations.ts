import { z } from 'zod';

export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  dueDate: z.string().optional(),
  categoryId: z.number().optional(),
});

export const generateTasksSchema = z.object({
  topic: z.string().min(1, 'Topic is required').max(100, 'Topic too long'),
});

export const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
});

export type TaskFormData = z.infer<typeof taskSchema>;
export type GenerateTasksData = z.infer<typeof generateTasksSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
