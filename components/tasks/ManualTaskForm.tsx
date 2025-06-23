'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Calendar } from 'lucide-react';

interface ManualTaskFormProps {
  onTaskCreated: () => void;
}

export function ManualTaskForm({ onTaskCreated }: ManualTaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !user) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/tasks/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          priority,
          dueDate: dueDate || null,
          firebaseUid: user.uid,
        }),
      });

      if (response.ok) {
        setTitle('');
        setDescription('');
        setPriority('medium');
        setDueDate('');
        onTaskCreated();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to create task');
      }
    } catch (error) {
      console.error('Error creating task:', error);
      setError('Failed to create task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
          <Plus className="h-5 w-5" />
          Create Manual Task
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Task title (e.g., Review JavaScript fundamentals)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
            required
            className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
          />
          
          <Textarea
            placeholder="Task description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
            rows={3}
            className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              value={priority}
              onValueChange={(value) => setPriority(value)}
              disabled={loading}
            >
              <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <SelectItem value="low" className="text-gray-900 dark:text-gray-100">🟢 Low Priority</SelectItem>
                <SelectItem value="medium" className="text-gray-900 dark:text-gray-100">🟡 Medium Priority</SelectItem>
                <SelectItem value="high" className="text-gray-900 dark:text-gray-100">🔴 High Priority</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                disabled={loading}
                className="pl-10 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                placeholder="Due date (optional)"
              />
            </div>
          </div>
          
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
              {error}
            </div>
          )}
          
          <Button type="submit" disabled={loading || !title.trim()} className="w-full">
            {loading ? 'Creating Task...' : 'Create Task'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
