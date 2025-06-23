'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, CheckSquare,Square, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Task {
  id: number;
  title: string;
  description?: string;
  isCompleted: boolean;
  priority: string;
  generatedTopic?: string;
  createdAt: string;
}

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: number, completed: boolean) => Promise<void>;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => Promise<void>;
  onChangePriority: (id: number, priority: string) => Promise<void>;
}

export function TaskItem({ task, onToggleComplete, onEdit, onDelete, onChangePriority }: TaskItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggleComplete = async () => {
    setIsUpdating(true);
    await onToggleComplete(task.id, !task.isCompleted);
    setIsUpdating(false);
  };

  const handlePriorityChange = async (value: string) => {
    setIsUpdating(true);
    await onChangePriority(task.id, value);
    setIsUpdating(false);
  };

  const priorityColors = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };

  return (
    <Card className="hover:shadow-md transition-shadow bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <button
  onClick={handleToggleComplete}
  disabled={isUpdating}
  className="mt-1"
>
  {task.isCompleted ? (
    <CheckSquare className="h-5 w-5 text-orange-500 dark:text-orange-400" />
  ) : (
    <Square className="h-5 w-5 text-gray-400 dark:text-gray-500" />
  )}
</button>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className={`font-medium text-sm leading-5 ${
                task.isCompleted 
                  ? 'line-through text-gray-500 dark:text-gray-400' 
                  : 'text-gray-900 dark:text-gray-100'
              }`}>
                {task.title}
              </h3>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <DropdownMenuItem onClick={() => onEdit(task)} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDelete(task.id)}
                    className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="flex items-center gap-2 mt-2">
              <Select
                value={task.priority}
                onValueChange={handlePriorityChange}
                disabled={isUpdating}
              >
                <SelectTrigger className="w-24 h-7 text-xs bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <SelectItem value="low" className="text-xs">🟢 Low</SelectItem>
                  <SelectItem value="medium" className="text-xs">🟡 Medium</SelectItem>
                  <SelectItem value="high" className="text-xs">🔴 High</SelectItem>
                </SelectContent>
              </Select>
              
              {task.generatedTopic && (
                <Badge variant="outline" className="text-xs border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300">
                  🤖 {task.generatedTopic}
                </Badge>
              )}
              
              <Badge variant={task.isCompleted ? "default" : "secondary"} className="text-xs">
                {task.isCompleted ? "✅ Completed" : "⏳ Pending"}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
