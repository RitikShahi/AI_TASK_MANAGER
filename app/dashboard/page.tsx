'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { TaskGenerator } from '@/components/tasks/TaskGenerator';
import { ManualTaskForm } from '@/components/tasks/ManualTaskForm';
import { TaskItem } from '@/components/tasks/TaskItem';
import { TaskFilters, TaskFilters as ITaskFilters } from '@/components/tasks/TaskFilters';
import { ProgressChart } from '@/components/tasks/ProgressChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  BarChart3, 
  Loader2, 
  Trash2, 
  TrendingUp, 
  Target, 
  Zap, 
  Brain,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Sparkles
} from 'lucide-react';

interface Task {
  id: number;
  title: string;
  description?: string;
  isCompleted: boolean;
  priority: string;
  generatedTopic?: string;
  dueDate?: string;
  createdAt: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showManualForm, setShowManualForm] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [filters, setFilters] = useState<ITaskFilters>({
    search: '',
    priority: '',
    status: '',
    topic: '',
  });

  useEffect(() => {
    if (!user) {
      router.push('/sign-in');
    } else {
      fetchTasks();
    }
  }, [user, router]);

  // Filter tasks based on current filters
  useEffect(() => {
    let filtered = [...tasks];

    if (filters.search) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.description?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.priority && filters.priority !== 'all') {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

    if (filters.status && filters.status !== 'all') {
      if (filters.status === 'completed') {
        filtered = filtered.filter(task => task.isCompleted);
      } else if (filters.status === 'pending') {
        filtered = filtered.filter(task => !task.isCompleted);
      }
    }

    if (filters.topic && filters.topic !== 'all') {
      filtered = filtered.filter(task => task.generatedTopic === filters.topic);
    }

    setFilteredTasks(filtered);
  }, [tasks, filters]);

  const fetchTasks = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firebaseUid: user.uid }),
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(data.tasks || []);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (id: number, completed: boolean) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          firebaseUid: user?.uid,
          isCompleted: completed 
        }),
      });

      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleChangePriority = async (id: number, priority: string) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          firebaseUid: user?.uid,
          priority 
        }),
      });

      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error('Error updating task priority:', error);
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firebaseUid: user?.uid }),
      });

      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleDeleteAllTasks = async () => {
    if (!confirm('Are you sure you want to delete ALL tasks? This action cannot be undone.')) return;

    try {
      const response = await fetch('/api/tasks/delete-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firebaseUid: user?.uid }),
      });

      if (response.ok) {
        fetchTasks();
      } else {
        alert('Failed to delete all tasks');
      }
    } catch (error) {
      console.error('Error deleting all tasks:', error);
      alert('Error deleting all tasks');
    }
  };

  const handleEditTask = (task: Task) => {
    console.log('Edit task:', task);
  };

  if (!user) return null;

  const topics = Array.from(new Set(
    tasks
      .map(task => task.generatedTopic)
      .filter(Boolean)
  )) as string[];

  const completedTasks = tasks.filter(t => t.isCompleted).length;
  const pendingTasks = tasks.length - completedTasks;
  const completionRate = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;
  const highPriorityPending = tasks.filter(t => t.priority === 'high' && !t.isCompleted).length;

  // Get current time greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gradient-to-br dark:from-gray-900 dark:via-black dark:to-gray-800">
      <div className="p-6 space-y-8">
        {/* Enhanced Header with Greeting */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <Brain className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {getGreeting()}, {user.email?.split('@')[0]}!
                </h1>
                <p className="text-gray-600 dark:text-gray-400">Ready to conquer your learning goals?</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="outline"
              onClick={() => setShowProgress(!showProgress)}
              className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white hover:border-orange-500"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              {showProgress ? 'Hide' : 'Show'} Analytics
            </Button>
            <Button 
              onClick={() => setShowManualForm(!showManualForm)}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              {showManualForm ? 'Hide' : 'Add'} Task
            </Button>
            {tasks.length > 0 && (
              <Button 
                variant="destructive" 
                onClick={handleDeleteAllTasks}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Enhanced Stats Cards with Light/Dark Support */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900 border-gray-200 dark:border-gray-700 hover:border-orange-500/50 transition-all duration-300 group shadow-sm dark:shadow-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Tasks</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{tasks.length}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-orange-500 mr-1" />
                    <span className="text-orange-500 text-sm">Active</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Target className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gradient-to-br dark:from-green-800/20 dark:to-green-900/20 border-gray-200 dark:border-gray-700 hover:border-green-500/50 transition-all duration-300 group shadow-sm dark:shadow-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Completed</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{completedTasks}</p>
                  <div className="flex items-center mt-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mr-1" />
                    <span className="text-green-600 dark:text-green-400 text-sm">{completionRate.toFixed(0)}% done</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gradient-to-br dark:from-blue-800/20 dark:to-blue-900/20 border-gray-200 dark:border-gray-700 hover:border-blue-500/50 transition-all duration-300 group shadow-sm dark:shadow-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Pending</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{pendingTasks}</p>
                  <div className="flex items-center mt-2">
                    <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-1" />
                    <span className="text-blue-600 dark:text-blue-400 text-sm">In progress</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gradient-to-br dark:from-red-800/20 dark:to-red-900/20 border-gray-200 dark:border-gray-700 hover:border-red-500/50 transition-all duration-300 group shadow-sm dark:shadow-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">High Priority</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{highPriorityPending}</p>
                  <div className="flex items-center mt-2">
                    <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400 mr-1" />
                    <span className="text-red-600 dark:text-red-400 text-sm">Urgent</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-red-100 dark:bg-red-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Overview */}
        {showProgress && (
          <div className="animate-in slide-in-from-top duration-500">
            <ProgressChart tasks={tasks} />
          </div>
        )}

        {/* AI Task Generator */}
        <TaskGenerator onTasksGenerated={fetchTasks} />

        {/* Manual Task Form */}
        {showManualForm && (
          <div className="animate-in slide-in-from-top duration-300">
            <ManualTaskForm onTaskCreated={() => { fetchTasks(); setShowManualForm(false); }} />
          </div>
        )}

        {/* Enhanced Task Filters */}
        <TaskFilters
          filters={filters}
          onFiltersChange={setFilters}
          topics={topics}
        />

        {/* Tasks List with Enhanced Design */}
        <Card className="bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 shadow-sm dark:backdrop-blur-sm">
          <CardHeader className="border-b border-gray-200 dark:border-gray-700/50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-orange-500" />
                Your Learning Tasks ({filteredTasks.length}
                {filteredTasks.length !== tasks.length && ` of ${tasks.length}`})
              </CardTitle>
              {filteredTasks.length > 0 && (
                <Badge variant="outline" className="border-orange-500/30 text-orange-500">
                  {Math.round((filteredTasks.filter(t => t.isCompleted).length / filteredTasks.length) * 100)}% Complete
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-500" />
                <p className="text-gray-600 dark:text-gray-400">Loading your tasks...</p>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="text-center py-12">
                {tasks.length === 0 ? (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto">
                      <Target className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white">No tasks yet!</h3>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                      Start your learning journey by generating AI tasks or creating manual ones.
                    </p>
                    <div className="flex justify-center gap-3 mt-6">
                      <Button 
                        onClick={() => setShowManualForm(true)}
                        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Task
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto">
                      <Target className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white">No matching tasks</h3>
                    <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filter criteria.</p>
                    <Button 
                      variant="outline" 
                      onClick={() => setFilters({ search: '', priority: '', status: '', topic: '' })}
                      className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTasks.map((task, index) => (
                  <div 
                    key={task.id} 
                    className="animate-in slide-in-from-left duration-300"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <TaskItem
                      task={task}
                      onToggleComplete={handleToggleComplete}
                      onEdit={handleEditTask}
                      onDelete={handleDeleteTask}
                      onChangePriority={handleChangePriority}
                    />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
