import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, Clock, Tag } from 'lucide-react';

export interface Task {
  id: string;
  title: string;
  category: 'school' | 'rugby' | 'music' | 'personal';
  dueDate: Date;
  status: 'todo' | 'inprogress' | 'done';
  tags?: string[];
  description?: string;
}

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, newStatus: Task['status']) => void;
  onComplete: (task: Task) => void;
}

const categoryEmojis = {
  school: '🧠',
  rugby: '💪',
  music: '🎶',
  personal: '💼'
};

const categoryColors = {
  school: 'bg-baby-lavender border-purple-200',
  rugby: 'bg-success border-success/30',
  music: 'bg-baby-mint border-accent/30',
  personal: 'bg-baby-peach border-orange-200'
};

const getUrgencyStyle = (dueDate: Date) => {
  const now = new Date();
  const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return { color: 'border-l-urgent', emoji: '😱', text: 'Overdue!' };
  } else if (diffDays === 0) {
    return { color: 'border-l-urgent', emoji: '😬', text: 'Due today' };
  } else if (diffDays === 1) {
    return { color: 'border-l-warning', emoji: '🔥', text: 'Due tomorrow' };
  } else if (diffDays <= 3) {
    return { color: 'border-l-warning', emoji: '⏰', text: `Due in ${diffDays} days` };
  } else {
    return { color: 'border-l-success', emoji: '😌', text: `Due in ${diffDays} days` };
  }
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-ZA', {
    month: 'short',
    day: 'numeric',
    weekday: 'short'
  }).format(date);
};

export const TaskCard = ({ task, onStatusChange, onComplete }: TaskCardProps) => {
  const [isChecking, setIsChecking] = useState(false);
  const urgency = getUrgencyStyle(task.dueDate);
  const isDone = task.status === 'done';

  const handleStatusToggle = async () => {
    if (isDone) return;
    
    setIsChecking(true);
    
    // Small delay for animation
    setTimeout(() => {
      onStatusChange(task.id, 'done');
      onComplete(task);
      setIsChecking(false);
    }, 300);
  };

  return (
    <Card className={`
      card-baby transition-all duration-300 hover:shadow-float
      ${categoryColors[task.category]}
      ${urgency.color} border-l-4
      ${isDone ? 'opacity-70 scale-[0.98]' : 'hover:scale-[1.02]'}
      ${isChecking ? 'animate-pulse-love' : ''}
    `}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 pt-1">
          <Checkbox
            checked={isDone}
            onCheckedChange={handleStatusToggle}
            disabled={isChecking}
            className="h-5 w-5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{categoryEmojis[task.category]}</span>
            <Badge variant="secondary" className="text-xs">
              {task.category}
            </Badge>
          </div>
          
          <h3 className={`font-poppins font-semibold mb-2 ${isDone ? 'line-through text-muted-foreground' : ''}`}>
            {task.title}
          </h3>
          
          {task.description && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {task.description}
            </p>
          )}
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(task.dueDate)}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span className="flex items-center gap-1">
                {urgency.emoji} {urgency.text}
              </span>
            </div>
          </div>
          
          {task.tags && task.tags.length > 0 && (
            <div className="flex items-center gap-2 mt-3">
              <Tag className="h-3 w-3 text-muted-foreground" />
              <div className="flex gap-1 flex-wrap">
                {task.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs px-2 py-0">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};