import { useState, useEffect } from 'react';
import { TaskCard, type Task } from '@/components/TaskCard';
import { SuccessModal } from '@/components/SuccessModal';
import { ProgressHype } from '@/components/ProgressHype';
import { AddTaskForm } from '@/components/AddTaskForm';
import Calendar from '@/components/Calendar';
import { useNotifications } from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Toaster } from '@/components/ui/toaster';
import { Heart, Moon, Sun, Calendar as CalendarIcon, ListTodo, Plus, Bell } from 'lucide-react';

// Sample motivational quotes
const motivationalQuotes = [
  "I believe in you like Sundowns believes in winning. 🏆",
  "You're not just smart, you're brilliant - and I'm here for it! 💎",
  "Every task you complete makes me prouder than the last. 🥹",
  "You've got the heart of a champion, baby! 💕",
  "Watching you chase your dreams is my favorite show. 📺✨",
  "You're proof that angels can multitask. 👼",
  "Boss babe energy: activated! Time to dominate! 👑",
  "You're writing your success story, one task at a time. 📖"
];

// Sample initial tasks with realistic dates (kept for reference but not used)
const sampleTasks: Task[] = [
  {
    id: '1',
    title: 'Submit Business Management Essay',
    description: 'Final essay on sustainable business practices - 2000 words',
    category: 'school',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    status: 'todo',
    tags: ['Online Submission', 'Essay']
  },
  {
    id: '2',
    title: 'Rugby Training Session',
    description: 'Full team practice at 4 PM - work on lineout throws',
    category: 'rugby',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // tomorrow
    status: 'todo',
    tags: ['Team Practice']
  },
  {
    id: '3',
    title: 'Piano Practice - Chopin',
    description: 'Work on Nocturne in E-flat major, focus on dynamics',
    category: 'music',
    dueDate: new Date(), // today
    status: 'inprogress',
    tags: ['Classical', 'Performance Prep']
  },
  {
    id: '4',
    title: 'Plan Weekend Date Ideas',
    description: 'Research fun activities for our Saturday adventure',
    category: 'personal',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    status: 'todo',
    tags: ['Fun', 'Us Time']
  }
];

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning, smartypants 🌞";
  if (hour < 17) return "Good afternoon, superstar ⭐";
  return "Good evening, beautiful 🌙";
};

const getRandomQuote = () => {
  return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
};

const Index = () => {
  // Changed from sampleTasks to empty array []
  const [tasks, setTasks] = useState<Task[]>([]);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [completedTask, setCompletedTask] = useState<Task | null>(null);
  const [currentQuote, setCurrentQuote] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeView, setActiveView] = useState<'list' | 'calendar'>('list');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Use the notification hook
  useNotifications(tasks);

  useEffect(() => {
    setCurrentQuote(getRandomQuote());
    // Check for dark mode preference
    const isDark = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }

    // Check notification permission status
    if ('Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }
  }, []);

  const enableNotifications = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === 'granted');
      
      if (permission === 'granted') {
        // Show a test notification
        new Notification('Notifications enabled! 🎉', {
          body: 'You\'ll now get sweet reminders when tasks are due, baby! 💕',
          icon: '/favicon.ico'
        });
      }
    }
  };

  const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const handleTaskComplete = (task: Task) => {
    setCompletedTask(task);
    setSuccessModalOpen(true);
  };

  const handleAddTask = (newTaskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: Date.now().toString()
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const groupTasksByCategory = (tasks: Task[]) => {
    return tasks.reduce((groups, task) => {
      const category = task.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(task);
      return groups;
    }, {} as Record<Task['category'], Task[]>);
  };

  const categoryEmojis = {
    school: '🧠',
    rugby: '💪',
    music: '🎶',
    personal: '💼'
  };

  const categoryLabels = {
    school: 'School',
    rugby: 'Rugby',
    music: 'Music Practice',
    personal: 'Personal Goals'
  };

  const pendingTasks = tasks.filter(task => task.status !== 'done');
  const groupedTasks = groupTasksByCategory(pendingTasks);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-baby border-b border-border/20">
        <div className="container max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Heart className="h-8 w-8 text-primary animate-pulse-love" />
              <h1 className="font-poppins font-bold text-3xl text-foreground">
                You Got This, Baby!
              </h1>
            </div>
            
            <div className="flex items-center gap-2">
              {!notificationsEnabled && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={enableNotifications}
                  className="bg-white/80 border-white/40 hover:bg-white/90 flex items-center gap-2"
                >
                  <Bell className="h-4 w-4" />
                  Enable Reminders
                </Button>
              )}
              
              <Button
                variant="outline"
                size="icon"
                onClick={toggleDarkMode}
                className="bg-white/80 border-white/40 hover:bg-white/90"
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <h2 className="font-poppins font-semibold text-xl text-foreground">
              {getGreeting()}
            </h2>
            <p className="font-caveat text-lg text-muted-foreground max-w-2xl mx-auto">
              {currentQuote}
            </p>
            <p className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString('en-ZA', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Progress Section */}
        <ProgressHype tasks={tasks} />

        {/* Tasks Section with View Toggle */}
        <Tabs value={activeView} onValueChange={(value) => setActiveView(value as 'list' | 'calendar')} className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="bg-card shadow-card">
              <TabsTrigger value="list" className="flex items-center gap-2">
                <ListTodo className="h-4 w-4" />
                List View
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Calendar View
              </TabsTrigger>
            </TabsList>

            <AddTaskForm onAddTask={handleAddTask}>
              <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4" />
                Add Task
              </Button>
            </AddTaskForm>
          </div>
          
          <TabsContent value="list" className="space-y-6">
            {Object.entries(groupedTasks).length === 0 ? (
              <Card className="card-baby text-center py-12">
                <div className="space-y-4">
                  <div className="text-6xl">🎉</div>
                  <h3 className="font-poppins font-bold text-2xl">Ready to start your journey!</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Your task list is empty and ready for action! Add your first task and let's 
                    start building something amazing together! 💕
                  </p>
                  <AddTaskForm onAddTask={handleAddTask}>
                    <Button className="mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Task
                    </Button>
                  </AddTaskForm>
                </div>
              </Card>
            ) : (
              Object.entries(groupedTasks).map(([category, categoryTasks]) => (
                <div key={category} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{categoryEmojis[category as Task['category']]}</span>
                    <h3 className="font-poppins font-bold text-xl">
                      {categoryLabels[category as Task['category']]}
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      {categoryTasks.length}
                    </Badge>
                  </div>
                  
                  <div className="grid gap-4">
                    {categoryTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onStatusChange={handleStatusChange}
                        onComplete={handleTaskComplete}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="calendar" className="space-y-4">
            {tasks.length === 0 ? (
              <Card className="card-baby text-center py-12">
                <div className="space-y-4">
                  <CalendarIcon className="h-16 w-16 mx-auto text-muted-foreground" />
                  <h3 className="font-poppins font-bold text-2xl">Your Calendar Awaits!</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Add some tasks with due dates to see them beautifully organized in your calendar view! 📅✨
                  </p>
                  <AddTaskForm onAddTask={handleAddTask}>
                    <Button className="mt-4">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Task
                    </Button>
                  </AddTaskForm>
                </div>
              </Card>
            ) : (
              <Calendar
                tasks={tasks}
                onStatusChange={handleStatusChange}
                onComplete={handleTaskComplete}
              />
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/20 bg-muted/30 mt-16">
        <div className="container max-w-6xl mx-auto px-4 py-8 text-center">
          <p className="font-caveat text-lg text-muted-foreground flex items-center justify-center gap-2">
            <Heart className="h-5 w-5 text-primary animate-pulse-love" />
            No matter how many tasks you finish, I'm always your biggest fan
            <Heart className="h-5 w-5 text-primary animate-pulse-love" />
          </p>
        </div>
      </footer>

      {/* Floating Add Button */}
      <AddTaskForm onAddTask={handleAddTask} />

      {/* Success Modal */}
      <SuccessModal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        task={completedTask}
      />

      {/* Add Toaster for notifications */}
      <Toaster />
    </div>
  );
};

export default Index;