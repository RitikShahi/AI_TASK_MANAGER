'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, X, Filter } from 'lucide-react';

export interface TaskFilters {
  search: string;
  priority: string;
  status: string;
  topic: string;
}

interface TaskFiltersProps {
  filters: TaskFilters;
  onFiltersChange: (filters: TaskFilters) => void;
  topics: string[];
}

export function TaskFilters({ filters, onFiltersChange, topics }: TaskFiltersProps) {
  const updateFilter = (key: keyof TaskFilters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      priority: '',
      status: '',
      topic: '',
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
          <Input
            placeholder="Search tasks..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
          />
        </div>
        
        <Select value={filters.status || undefined} onValueChange={(value) => updateFilter('status', value || '')}>
          <SelectTrigger className="w-full sm:w-[150px] bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <SelectItem value="all" className="text-gray-900 dark:text-gray-100">All Status</SelectItem>
            <SelectItem value="completed" className="text-gray-900 dark:text-gray-100">✅ Completed</SelectItem>
            <SelectItem value="pending" className="text-gray-900 dark:text-gray-100">⏳ Pending</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={filters.priority || undefined} onValueChange={(value) => updateFilter('priority', value || '')}>
          <SelectTrigger className="w-full sm:w-[150px] bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <SelectItem value="all" className="text-gray-900 dark:text-gray-100">All Priority</SelectItem>
            <SelectItem value="high" className="text-gray-900 dark:text-gray-100">🔴 High</SelectItem>
            <SelectItem value="medium" className="text-gray-900 dark:text-gray-100">🟡 Medium</SelectItem>
            <SelectItem value="low" className="text-gray-900 dark:text-gray-100">🟢 Low</SelectItem>
          </SelectContent>
        </Select>
        
        {topics.length > 0 && (
          <Select value={filters.topic || undefined} onValueChange={(value) => updateFilter('topic', value || '')}>
            <SelectTrigger className="w-full sm:w-[180px] bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100">
              <SelectValue placeholder="AI Topic" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <SelectItem value="all" className="text-gray-900 dark:text-gray-100">All Topics</SelectItem>
              {topics.map((topic) => (
                <SelectItem key={topic} value={topic} className="text-gray-900 dark:text-gray-100">
                  🤖 {topic}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
      
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
          
          {filters.search && (
            <Badge variant="secondary" className="gap-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
              Search: {filters.search}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilter('search', '')}
              />
            </Badge>
          )}
          
          {filters.status && filters.status !== 'all' && (
            <Badge variant="secondary" className="gap-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
              Status: {filters.status}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilter('status', '')}
              />
            </Badge>
          )}
          
          {filters.priority && filters.priority !== 'all' && (
            <Badge variant="secondary" className="gap-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
              Priority: {filters.priority}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilter('priority', '')}
              />
            </Badge>
          )}
          
          {filters.topic && filters.topic !== 'all' && (
            <Badge variant="secondary" className="gap-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
              Topic: {filters.topic}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilter('topic', '')}
              />
            </Badge>
          )}
          
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
