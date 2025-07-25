import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Zap, Trophy, Target } from 'lucide-react';
import type { Task } from './TaskCard';

interface ProgressHypeProps {
  tasks: Task[];
}

const getHypeLevel = (percentage: number) => {
  if (percentage === 100) return { text: "ABSOLUTE LEGEND", emoji: "👑", color: "text-yellow-600" };
  if (percentage >= 80) return { text: "BOSS BABE ENERGY", emoji: "⚡", color: "text-primary" };
  if (percentage >= 60) return { text: "CRUSHING IT", emoji: "💪", color: "text-success" };
  if (percentage >= 40) return { text: "GAINING MOMENTUM", emoji: "🚀", color: "text-warning" };
  if (percentage >= 20) return { text: "GETTING STARTED", emoji: "🌱", color: "text-accent-foreground" };
  return { text: "READY TO CONQUER", emoji: "✨", color: "text-muted-foreground" };
};

const getEncouragementMessage = (percentage: number) => {
  if (percentage === 100) return "You did it all! Time to celebrate! 🥳";
  if (percentage >= 80) return "Almost there, superstar! 🌟";
  if (percentage >= 60) return "You're on fire today! 🔥";
  if (percentage >= 40) return "Keep this energy going! 💫";
  if (percentage >= 20) return "Every step counts, babe! 👣";
  return "Your journey starts here! 💕";
};

export const ProgressHype = ({ tasks }: ProgressHypeProps) => {
  const completedTasks = tasks.filter(task => task.status === 'done').length;
  const totalTasks = tasks.length;
  const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const hype = getHypeLevel(percentage);
  const encouragement = getEncouragementMessage(percentage);

  return (
    <div className="card-baby gradient-baby border-none">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Zap className="h-6 w-6 text-primary animate-bounce-soft" />
          <h2 className="font-poppins font-bold text-2xl">Progress Hype Meter</h2>
          <Zap className="h-6 w-6 text-primary animate-bounce-soft" />
        </div>
        <p className="text-muted-foreground">
          {encouragement}
        </p>
      </div>

      <div className="space-y-4">
        {/* Main Progress Bar */}
        <div className="relative">
          <Progress 
            value={percentage} 
            className="h-4 bg-white/50"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-white drop-shadow-sm">
              {percentage}%
            </span>
          </div>
        </div>

        {/* Hype Level Badge */}
        <div className="text-center">
          <Badge 
            variant="secondary" 
            className={`${hype.color} font-poppins font-bold text-sm px-4 py-2 bg-white/80`}
          >
            <span className="mr-2 text-lg">{hype.emoji}</span>
            {hype.text}
          </Badge>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-6 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Target className="h-4 w-4" />
            <span className="font-medium">
              {completedTasks} of {totalTasks} done
            </span>
          </div>
          
          {percentage === 100 && totalTasks > 0 && (
            <div className="flex items-center gap-1 text-yellow-600">
              <Trophy className="h-4 w-4" />
              <span className="font-medium">ALL COMPLETE!</span>
            </div>
          )}
        </div>

        {/* Motivational Milestone */}
        {percentage > 0 && percentage < 100 && (
          <div className="text-center p-3 bg-white/60 rounded-xl">
            <p className="text-xs text-muted-foreground">
              Next milestone: {Math.ceil(totalTasks * ((Math.floor(percentage / 25) + 1) * 25) / 100)} tasks 
              ({((Math.floor(percentage / 25) + 1) * 25)}%)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};