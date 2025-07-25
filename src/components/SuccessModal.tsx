import { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Heart, Sparkles, Star } from 'lucide-react';
import type { Task } from './TaskCard';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

const sweetMessages = [
  "You're killing it, baby! 🫶",
  "One step closer to being SA's smartest baddie 💅",
  "Look at you being all productive and hot 😍",
  "I'd give you a gold star, but you already shine ✨",
  "Boss babe energy is OFF THE CHARTS! 📈",
  "That's my girl! Absolutely crushing it 💪",
  "You're like the Sundowns of productivity - always winning! 🏆",
  "Another W for my favorite genius 🧠💕",
  "I'm so proud I could cry happy tears 🥹",
  "You deserve all the boba tea after this! 🧋",
  "Productive AND gorgeous? What can't you do? 😘",
  "Watching you succeed makes my heart do backflips 💝",
  "You're unstoppable when you put your mind to it! 🚀",
  "That's my smart cookie! 🍪💕",
  "You just made future you SO grateful 🙏✨"
];

const getRandomMessage = () => {
  return sweetMessages[Math.floor(Math.random() * sweetMessages.length)];
};

const confettiEmojis = ['🎉', '✨', '💖', '🌟', '💕', '🥳', '👑', '💎'];

export const SuccessModal = ({ isOpen, onClose, task }: SuccessModalProps) => {
  const [message, setMessage] = useState('');
  const [confetti, setConfetti] = useState<Array<{ id: number; emoji: string; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    if (isOpen && task) {
      setMessage(getRandomMessage());
      
      // Generate confetti
      const newConfetti = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        emoji: confettiEmojis[Math.floor(Math.random() * confettiEmojis.length)],
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 0.5
      }));
      setConfetti(newConfetti);
    }
  }, [isOpen, task]);

  if (!task) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-gradient-love border-none shadow-float overflow-hidden">
        {/* Confetti Background */}
        <div className="absolute inset-0 pointer-events-none">
          {confetti.map((item) => (
            <div
              key={item.id}
              className="absolute text-2xl animate-confetti"
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                animationDelay: `${item.delay}s`
              }}
            >
              {item.emoji}
            </div>
          ))}
        </div>

        <div className="relative text-center p-8">
          {/* Success Icon */}
          <div className="mx-auto w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6 animate-bounce-soft">
            <Heart className="h-10 w-10 text-white fill-white" />
          </div>

          {/* Task Completion */}
          <div className="mb-6">
            <h2 className="font-poppins font-bold text-2xl text-white mb-2">
              Task Complete! 🎉
            </h2>
            <p className="text-white/90 font-medium">
              "{task.title}"
            </p>
          </div>

          {/* Sweet Message */}
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Star className="h-5 w-5 text-yellow-300 fill-yellow-300" />
              <span className="text-white font-caveat text-lg">From your biggest fan</span>
              <Star className="h-5 w-5 text-yellow-300 fill-yellow-300" />
            </div>
            <p className="text-white font-caveat text-xl leading-relaxed">
              {message}
            </p>
          </div>

          {/* Action Button */}
          <Button
            onClick={onClose}
            variant="secondary"
            className="bg-white text-primary font-semibold hover:bg-white/90 shadow-lg transition-all duration-300 hover:scale-105"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Keep Going, Baby!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};