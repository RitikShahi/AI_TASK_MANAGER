'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface TaskGeneratorProps {
  onTasksGenerated: () => void;
}

export function TaskGenerator({ onTasksGenerated }: TaskGeneratorProps) {
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  const { user } = useAuth();

  const handleGenerate = async () => {
    if (!topic.trim() || !user) return;

    setIsGenerating(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/tasks/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: topic.trim(),
          firebaseUid: user.uid,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate tasks');
      }

      setSuccess(`Successfully generated ${data.tasks.length} tasks for "${data.topic}"!`);
      setTopic('');
      onTasksGenerated();
    } catch (error: any) {
      console.error('Error generating tasks:', error);
      setError(error.message || 'Failed to generate tasks. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isGenerating) {
      handleGenerate();
    }
  };

  const exampleTopics = [
    'Learn Python Programming',
    'Master React Development',
    'Study Data Science',
    'Learn Digital Photography',
    'Master Guitar Playing',
    'Study Machine Learning',
  ];

  return (
    <Card className="mb-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
          <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          Generate Learning Tasks with AI
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter a topic (e.g., Learn Python, Master Photography, Study Data Science)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
            disabled={isGenerating}
          />
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating || !topic.trim() || !user}
            className="min-w-[140px]"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate 5 Tasks
              </>
            )}
          </Button>
        </div>

        {/* Success Message */}
        {success && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-300 text-sm flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        {/* Example Topics */}
        <div className="space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">💡 Try these example topics:</p>
          <div className="flex flex-wrap gap-2">
            {exampleTopics.map((exampleTopic) => (
              <button
                key={exampleTopic}
                onClick={() => setTopic(exampleTopic)}
                className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full text-gray-700 dark:text-gray-300 transition-colors"
                disabled={isGenerating}
              >
                {exampleTopic}
              </button>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
          <strong className="text-gray-700 dark:text-gray-300">How it works:</strong> Enter any learning topic and our AI will generate 5 progressive, 
          actionable tasks to help you master that skill. Tasks are automatically saved to your dashboard.
        </div>
      </CardContent>
    </Card>
  );
}
