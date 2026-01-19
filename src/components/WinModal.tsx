import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, PartyPopper, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';

interface WinModalProps {
  isOpen: boolean;
  prize: string;
  onClose: () => void;
}

export const WinModal = ({ isOpen, prize, onClose }: WinModalProps) => {
  useEffect(() => {
    if (isOpen) {
      // Fire confetti!
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
          colors: ['#f59e0b', '#fbbf24', '#fcd34d', '#ffffff'],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 },
          colors: ['#f59e0b', '#fbbf24', '#fcd34d', '#ffffff'],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();

      // Big burst in the center
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#fbbf24', '#fcd34d', '#a855f7', '#22c55e'],
      });
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/90 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.6, bounce: 0.4 }}
            className="relative w-full max-w-lg"
          >
            <div className="card-elevated p-8 md:p-12 text-center relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent" />
              
              {/* Animated background circles */}
              <motion.div
                className="absolute -top-20 -left-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                className="absolute -bottom-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl"
                animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />

              {/* Content */}
              <div className="relative z-10">
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute -top-4 -right-4 p-2 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>

                {/* Trophy icon */}
                <motion.div
                  initial={{ rotate: -10, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2, bounce: 0.5 }}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-gold glow-gold-intense mb-6"
                >
                  <Trophy className="w-10 h-10 text-primary-foreground" />
                </motion.div>

                {/* Celebration icons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex justify-center gap-2 mb-4"
                >
                  <PartyPopper className="w-6 h-6 text-primary" />
                  <span className="text-2xl">🎉</span>
                  <PartyPopper className="w-6 h-6 text-primary transform scale-x-[-1]" />
                </motion.div>

                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="font-display text-3xl md:text-4xl font-bold text-gradient-gold text-shadow-glow mb-2"
                >
                  Congratulations!
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-muted-foreground mb-6"
                >
                  You've won an amazing prize!
                </motion.p>

                {/* Prize display */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6, type: 'spring', bounce: 0.4 }}
                  className="bg-muted/50 rounded-2xl p-6 mb-8 border border-primary/30"
                >
                  <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
                    Your Prize
                  </p>
                  <p className="font-display text-3xl md:text-4xl font-bold text-foreground">
                    {prize}
                  </p>
                </motion.div>

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Button
                    onClick={onClose}
                    className="btn-spin text-primary-foreground px-8 py-6 text-lg rounded-xl"
                  >
                    Claim My Prize!
                  </Button>
                  <p className="text-xs text-muted-foreground mt-4">
                    Check your email for redemption instructions
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
