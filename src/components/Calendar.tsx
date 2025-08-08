import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Tag } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { type Task } from '@/components/TaskCard';

interface CalendarProps {
  tasks: Task[];
  onStatusChange: (taskId: string, newStatus: Task['status']) => void;
  onComplete: (task: Task) => void;
}

const Calendar: React.FC<CalendarProps> = ({ tasks, onStatusChange, onComplete }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get the first day of the month and number of days
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday
  const daysInMonth = lastDayOfMonth.getDate();

  // Generate calendar days
  const calendarDays = [];
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get tasks for a specific date
  const getTasksForDate = (day: number) => {
    const dateToCheck = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getDate() === day &&
        taskDate.getMonth() === currentDate.getMonth() &&
        taskDate.getFullYear() === currentDate.getFullYear() &&
        task.status !== 'done'
      );
    });
  };

  // Check if a date is today
  const isToday = (day: number) => {
    const today = new Date();
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return (
      today.getDate() === checkDate.getDate() &&
      today.getMonth() === checkDate.getMonth() &&
      today.getFullYear() === checkDate.getFullYear()
    );
  };

  // Check if a date is in the past
  const isPast = (day: number) => {
    const today = new Date();
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    today.setHours(0, 0, 0, 0);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
  };

  // Category colors for tasks
  const categoryColors = {
    school: 'bg-blue-100 text-blue-800 border-blue-200',
    rugby: 'bg-green-100 text-green-800 border-green-200',
    music: 'bg-purple-100 text-purple-800 border-purple-200',
    personal: 'bg-orange-100 text-orange-800 border-orange-200'
  };

  const categoryEmojis = {
    school: '🧠',
    rugby: '💪',
    music: '🎶',
    personal: '💼'
  };

  // Status colors
  const statusColors = {
    todo: 'bg-gray-100 text-gray-700',
    inprogress: 'bg-yellow-100 text-yellow-700',
    done: 'bg-green-100 text-green-700'
  };

  const handleTaskClick = (task: Task) => {
    if (task.status === 'todo') {
      onStatusChange(task.id, 'inprogress');
    } else if (task.status === 'inprogress') {
      onStatusChange(task.id, 'done');
      onComplete(task);
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Card className="card-baby p-6 space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CalendarIcon className="h-6 w-6 text-primary" />
          <h2 className="font-poppins font-bold text-2xl">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
            className="text-xs"
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={goToPreviousMonth}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={goToNextMonth}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="space-y-4">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1">
          {dayNames.map((day) => (
            <div
              key={day}
              className="p-2 text-center text-sm font-medium text-muted-foreground border-b"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            if (day === null) {
              return <div key={index} className="h-24 p-1"></div>;
            }

            const dayTasks = getTasksForDate(day);
            const isTodayDate = isToday(day);
            const isPastDate = isPast(day);

            return (
              <div
                key={day}
                className={`h-24 p-1 border rounded-lg relative overflow-hidden ${
                  isTodayDate
                    ? 'bg-primary/10 border-primary/30 shadow-sm'
                    : isPastDate
                    ? 'bg-muted/30'
                    : 'bg-background hover:bg-muted/20'
                } transition-colors duration-150`}
              >
                {/* Day Number */}
                <div className={`text-sm font-medium mb-1 ${
                  isTodayDate ? 'text-primary font-bold' : 'text-foreground'
                }`}>
                  {day}
                </div>

                {/* Tasks */}
                <div className="space-y-1 overflow-hidden">
                  {dayTasks.slice(0, 2).map((task) => (
                    <div
                      key={task.id}
                      onClick={() => handleTaskClick(task)}
                      className={`px-1 py-0.5 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity border ${
                        categoryColors[task.category]
                      } ${statusColors[task.status]}`}
                      title={`${task.title} - ${task.description}`}
                    >
                      <div className="flex items-center gap-1">
                        <span className="text-xs">
                          {categoryEmojis[task.category]}
                        </span>
                        <span className="truncate font-medium">
                          {task.title}
                        </span>
                      </div>
                      
                      {task.tags && task.tags.length > 0 && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <Tag className="h-2 w-2" />
                          <span className="truncate text-xs opacity-75">
                            {task.tags[0]}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {/* Show more indicator */}
                  {dayTasks.length > 2 && (
                    <div className="text-xs text-muted-foreground text-center py-0.5">
                      +{dayTasks.length - 2} more
                    </div>
                  )}
                </div>

                {/* Overdue indicator */}
                {isPastDate && dayTasks.length > 0 && (
                  <div className="absolute top-1 right-1">
                    <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Calendar Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-4 border-t">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 bg-primary/20 rounded border border-primary/30"></div>
          <span>Today</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 bg-red-500 rounded-full"></div>
          <span>Overdue</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 bg-blue-100 rounded border border-blue-200"></div>
          <span>School</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 bg-green-100 rounded border border-green-200"></div>
          <span>Rugby</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 bg-purple-100 rounded border border-purple-200"></div>
          <span>Music</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 bg-orange-100 rounded border border-orange-200"></div>
          <span>Personal</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="flex items-center justify-center gap-6 pt-4 border-t text-sm">
        <div className="text-center">
          <div className="font-bold text-lg text-primary">
            {tasks.filter(task => task.status !== 'done').length}
          </div>
          <div className="text-muted-foreground">Pending Tasks</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-lg text-green-600">
            {tasks.filter(task => task.status === 'done').length}
          </div>
          <div className="text-muted-foreground">Completed</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-lg text-yellow-600">
            {tasks.filter(task => {
              const today = new Date();
              const taskDate = new Date(task.dueDate);
              return taskDate < today && task.status !== 'done';
            }).length}
          </div>
          <div className="text-muted-foreground">Overdue</div>
        </div>
      </div>
    </Card>
  );
};

export default Calendar;