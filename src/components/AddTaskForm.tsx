import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar as CalendarIcon, X, Heart } from 'lucide-react';
import { format } from 'date-fns';
import type { Task } from './TaskCard';

interface AddTaskFormProps {
  onAddTask: (task: Omit<Task, 'id'>) => void;
  children?: React.ReactNode;
}

const categoryOptions = [
  { value: 'school' as const, label: '🧠 School', color: 'bg-baby-lavender' },
  { value: 'rugby' as const, label: '💪 Rugby', color: 'bg-success' },
  { value: 'music' as const, label: '🎶 Music Practice', color: 'bg-baby-mint' },
  { value: 'personal' as const, label: '💼 Personal Goals', color: 'bg-baby-peach' }
];

export const AddTaskForm = ({ onAddTask, children }: AddTaskFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Task['category']>('school');
  const [dueDate, setDueDate] = useState<Date | undefined>(new Date());
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !dueDate) return;

    const newTask: Omit<Task, 'id'> = {
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      dueDate,
      status: 'todo',
      tags: tags.length > 0 ? tags : undefined
    };

    onAddTask(newTask);
    
    // Reset form
    setTitle('');
    setDescription('');
    setCategory('school');
    setDueDate(new Date());
    setTags([]);
    setCurrentTag('');
    setIsOpen(false);
  };

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button 
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-float bg-primary hover:bg-primary/90 animate-pulse-love z-50"
            size="icon"
          >
            <Plus className="h-6 w-6" />
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-md mx-auto card-baby border-none shadow-float">
        <DialogHeader>
          <DialogTitle className="font-poppins text-xl text-center flex items-center justify-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Add New Task
            <Heart className="h-5 w-5 text-primary" />
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-sm font-medium">
              Task Title ✨
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What do you need to crush today?"
              className="mt-1"
              required
            />
          </div>

          {/* Category */}
          <div>
            <Label className="text-sm font-medium">Category 📚</Label>
            <Select value={category} onValueChange={(value: Task['category']) => setCategory(value)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${option.color}`} />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Due Date */}
          <div>
            <Label className="text-sm font-medium">Due Date 📅</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full mt-1 justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-sm font-medium">
              Notes (Optional) 📝
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Any extra details or context..."
              className="mt-1 min-h-[80px]"
            />
          </div>

          {/* Tags */}
          <div>
            <Label className="text-sm font-medium">Tags (Optional) 🏷️</Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a tag..."
                className="flex-1"
              />
              <Button type="button" onClick={addTag} variant="outline" size="sm">
                Add
              </Button>
            </div>
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90"
              disabled={!title.trim() || !dueDate}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};