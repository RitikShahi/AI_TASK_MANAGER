import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  CheckCircle, 
  Target, 
  BarChart3, 
  Brain, 
  Zap, 
  Users, 
  ArrowRight,
  Star,
  Play
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">TaskAI</span>
          </div>
          <div className="flex gap-4">
            <Link href="/sign-in">
              <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-800">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Badge className="mb-6 bg-orange-500/20 text-orange-400 border-orange-500/30">
          <Sparkles className="h-3 w-3 mr-1" />
          Powered by Google Gemini AI
        </Badge>
        
        <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Learn Anything with
          <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent block">
            AI-Task MANAGER
          </span>
        </h1>
        
        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
          Transform your learning journey with personalized, AI-generated tasks. 
          From coding to cooking, our intelligent system creates step-by-step learning paths 
          tailored to your goals and pace.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href="/sign-up">
            <Button size="lg" className="text-lg px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all text-white border-0">
              <Sparkles className="mr-2 h-5 w-5" />
              Start Learning for Free
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-2 border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white hover:border-orange-500">
            <Play className="mr-2 h-5 w-5" />
            Watch Demo
          </Button>
        </div>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Why Choose TaskAI?
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Experience the future of personalized learning with cutting-edge AI technology
          </p>
        </div>
        </section>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: Brain,
              title: 'AI-Powered Generation',
              description: 'Advanced Google Gemini AI creates personalized learning tasks based on your goals and skill level',
              bgColor: 'bg-gray-800/50',
            },
            {
              icon: Target,
              title: 'Smart Task Management',
              description: 'Organize, prioritize, and track your learning progress with intelligent task management',
              bgColor: 'bg-gray-800/50',
            },
            {
              icon: BarChart3,
              title: 'Progress Analytics',
              description: 'Visualize your learning journey with detailed progress tracking and completion insights',
              bgColor: 'bg-gray-800/50',
            },
            {
              icon: Zap,
              title: 'Instant Results',
              description: 'Generate 5 progressive learning tasks in seconds for any topic you want to master',
              bgColor: 'bg-gray-800/50',
            },
          ].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border border-gray-700 bg-gray-800/30 backdrop-blur-sm hover:border-orange-500/50">
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 rounded-2xl ${feature.bgColor} border border-orange-500/30 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-8 w-8 text-orange-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Demo Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge className="mb-4 bg-orange-500/20 text-orange-400 border-orange-500/30">
              Live Demo
            </Badge>
            <h2 className="text-4xl font-bold text-white mb-6">
              See AI Task Generation in Action
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Watch how our AI transforms a simple learning goal into a structured, 
              progressive learning path with actionable tasks.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-orange-400" />
                <span className="text-gray-300">Personalized to your skill level</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-orange-400" />
                <span className="text-gray-300">Progressive difficulty increase</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-orange-400" />
                <span className="text-gray-300">Actionable and specific tasks</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <Card className="bg-gray-800 border border-gray-700 shadow-2xl">
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                      <Sparkles className="h-4 w-4 text-orange-400" />
                      AI Task Generator
                    </div>
                    <div className="bg-gray-600 rounded p-2 text-sm text-white">
                      Input: "Learn Python Programming"
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {[
                    "Set up Python development environment",
                    "Complete basic syntax and data types tutorial",
                    "Build a simple calculator project",
                    "Practice with loops and functions exercises",
                    "Create a portfolio web scraper project"
                  ].map((task, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-xs font-medium text-white">
                        {index + 1}
                      </div>
                      <span className="text-sm text-gray-300">{task}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-r from-orange-600 to-orange-500 border-0 text-white">
          <CardContent className="p-12 text-center">
            <h2 className="text-4xl font-bold mb-4">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of learners who are achieving their goals faster with AI-powered task management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sign-up">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-4 bg-white text-orange-600 hover:bg-gray-100">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Start Learning Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t border-gray-700">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-white">TaskAI</span>
          </div>
          <p className="text-sm text-gray-400">
            © 2025 TaskAI. Powered by Google Gemini AI.
          </p>
        </div>
      </footer>
    </div>
  );
}
