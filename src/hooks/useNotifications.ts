
import { useEffect } from 'react';
import { Task } from '@/components/TaskCard';
import { toast } from '@/components/ui/use-toast';

export const useNotifications = (tasks: Task[]) => {
  useEffect(() => {
    // Request notification permission on first load
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const checkDueTasks = () => {
      const today = new Date();
      const todayStr = today.toDateString();
      
      const dueTasks = tasks.filter(task => {
        const taskDate = new Date(task.dueDate);
        return taskDate.toDateString() === todayStr && task.status !== 'done';
      });

      dueTasks.forEach(task => {
        // Show browser notification if permission granted
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(`Baby, you got this! 💕`, {
            body: `"${task.title}" is due today! Time to show this task who's boss! 👑`,
            icon: '/favicon.ico',
            tag: task.id // Prevents duplicate notifications
          });
        }

        // Also show in-app toast notification
        toast({
          title: "Task Due Today! 🔥",
          description: `"${task.title}" needs your attention, beautiful! You've got this! 💪`,
          duration: 5000
        });
      });
    };

    // Check immediately on mount
    checkDueTasks();

    // Set up interval to check every hour
    const interval = setInterval(checkDueTasks, 60 * 60 * 1000);

    // Also check when the page becomes visible (user switches back to tab)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkDueTasks();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [tasks]);
};
