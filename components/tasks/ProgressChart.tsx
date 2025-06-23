'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle, Target, TrendingUp, Calendar, Flame, Award } from 'lucide-react';

interface Task {
  id: number;
  title: string;
  isCompleted: boolean;
  priority: string;
  generatedTopic?: string;
  dueDate?: string;
  createdAt: string;
}

interface ProgressChartProps {
  tasks: Task[];
}

export function ProgressChart({ tasks }: ProgressChartProps) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.isCompleted).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  const highPriorityTasks = tasks.filter(task => task.priority === 'high' && !task.isCompleted).length;
  const mediumPriorityTasks = tasks.filter(task => task.priority === 'medium' && !task.isCompleted).length;
  const lowPriorityTasks = tasks.filter(task => task.priority === 'low' && !task.isCompleted).length;
  
  const aiGeneratedTasks = tasks.filter(task => task.generatedTopic).length;
  const manualTasks = tasks.filter(task => !task.generatedTopic).length;
  
  const overdueTasks = tasks.filter(task => {
    if (!task.dueDate || task.isCompleted) return false;
    return new Date(task.dueDate) < new Date();
  }).length;

  // Calculate streak (consecutive days with completed tasks)
  const getStreak = () => {
    const today = new Date();
    let streak = 0;
    let currentDate = new Date(today);
    
    while (streak < 30) { // Max 30 days check
      const dayTasks = tasks.filter(task => {
        const taskDate = new Date(task.createdAt);
        return taskDate.toDateString() === currentDate.toDateString() && task.isCompleted;
      });
      
      if (dayTasks.length > 0) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  const streak = getStreak();

  // Topic progress breakdown
  const topicStats = tasks.reduce((acc, task) => {
    if (task.generatedTopic) {
      if (!acc[task.generatedTopic]) {
        acc[task.generatedTopic] = { total: 0, completed: 0 };
      }
      acc[task.generatedTopic].total++;
      if (task.isCompleted) {
        acc[task.generatedTopic].completed++;
      }
    }
    return acc;
  }, {} as Record<string, { total: number; completed: number }>);

  // Weekly progress
  const getWeeklyProgress = () => {
    const weekDays = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const dayTasks = tasks.filter(task => {
        const taskDate = new Date(task.createdAt);
        return taskDate.toDateString() === date.toDateString();
      });
      
      const completed = dayTasks.filter(t => t.isCompleted).length;
      
      weekDays.push({
        day: date.toLocaleDateString('en', { weekday: 'short' }),
        completed,
        total: dayTasks.length,
        percentage: dayTasks.length > 0 ? (completed / dayTasks.length) * 100 : 0
      });
    }
    
    return weekDays;
  };

  const weeklyData = getWeeklyProgress();

  return (
    <div className="space-y-6">
      {/* Main Progress Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Completion Circle */}
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
              <Target className="h-5 w-5 text-orange-500" />
              Overall Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-gray-200 dark:text-gray-700"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - completionRate / 100)}`}
                  className="text-orange-500 transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{completionRate.toFixed(0)}%</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Complete</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-500">{completedTasks}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
              <CheckCircle className="h-4 w-4 text-orange-500 mx-auto mt-1" />
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-500">{pendingTasks}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Pending</div>
              <Clock className="h-4 w-4 text-blue-500 mx-auto mt-1" />
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-red-500">{highPriorityTasks}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">High Priority</div>
              <AlertCircle className="h-4 w-4 text-red-500 mx-auto mt-1" />
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-500">{streak}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Day Streak</div>
              <Flame className="h-4 w-4 text-yellow-500 mx-auto mt-1" />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Weekly Activity */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
            <Calendar className="h-5 w-5 text-orange-500" />
            Weekly Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {weeklyData.map((day, index) => (
              <div key={index} className="text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">{day.day}</div>
                <div className="relative">
                  <div className="w-full h-16 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                    <div 
                      className="bg-gradient-to-t from-orange-600 to-orange-400 transition-all duration-500"
                      style={{ height: `${day.percentage}%` }}
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-700 dark:text-white">
                      {day.completed}/{day.total}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Priority Breakdown */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-orange-500" />
            Priority Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">🔴 High Priority</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{highPriorityTasks} remaining</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${highPriorityTasks > 0 ? (highPriorityTasks / totalTasks) * 100 : 0}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">🟡 Medium Priority</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{mediumPriorityTasks} remaining</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-yellow-500 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${mediumPriorityTasks > 0 ? (mediumPriorityTasks / totalTasks) * 100 : 0}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">🟢 Low Priority</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">{lowPriorityTasks} remaining</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${lowPriorityTasks > 0 ? (lowPriorityTasks / totalTasks) * 100 : 0}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Topic Progress */}
      {Object.keys(topicStats).length > 0 && (
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-orange-500" />
              AI Topic Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(topicStats).map(([topic, stats]) => {
                const topicProgress = (stats.completed / stats.total) * 100;
                return (
                  <div key={topic} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">🤖 {topic}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {stats.completed}/{stats.total}
                        </span>
                        <Badge variant="outline" className="text-xs border-orange-500/30 text-orange-500">
                          {topicProgress.toFixed(0)}%
                        </Badge>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-orange-500 to-orange-400 rounded-full h-3 transition-all duration-500"
                          style={{ width: `${topicProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Task Source Analysis */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white text-lg">Task Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">AI Generated</span>
                </div>
                <span className="text-gray-900 dark:text-white font-medium">{aiGeneratedTasks}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300">Manual</span>
                </div>
                <span className="text-gray-900 dark:text-white font-medium">{manualTasks}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {overdueTasks > 0 && (
          <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 shadow-sm">
            <CardHeader>
              <CardTitle className="text-red-700 dark:text-red-300 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Overdue Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 dark:text-red-400">{overdueTasks}</div>
                <div className="text-sm text-red-600 dark:text-red-300">
                  {overdueTasks === 1 ? 'task needs' : 'tasks need'} attention
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
