'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { generateTasksSchema, type GenerateTasksData } from '@/lib/validations';
import { Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/components/hooks/use-toast';

interface TaskGeneratorProps {
  onTasksGenerated: () => void;
}

export function TaskGenerator({ onTasksGenerated }: TaskGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const form = useForm<GenerateTasksData>({
    resolver: zodResolver(generateTasksSchema),
    defaultValues: {
      topic: '',
    },
  });

  const onSubmit = async (data: GenerateTasksData) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/tasks/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to generate tasks');
      }

      const tasks = await response.json();
      toast({
        title: 'Success!',
        description: `Generated ${tasks.length} tasks for "${data.topic}"`,
      });

      form.reset();
      onTasksGenerated();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate tasks. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Generate Learning Tasks
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What do you want to learn?</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Learn Python, Master React, Study Machine Learning"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isGenerating} className="w-full">
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Tasks...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate 5 Tasks
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
