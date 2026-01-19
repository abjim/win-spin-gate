import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Gift, Star, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SpinWheel } from '@/components/SpinWheel';
import { LeadForm } from '@/components/LeadForm';
import { WinModal } from '@/components/WinModal';
import { AdminLogin } from '@/components/AdminLogin';
import { AdminPanel } from '@/components/AdminPanel';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Lead, WheelSegment, DEFAULT_SEGMENTS } from '@/types/wheel';

const Index = () => {
  // LocalStorage persistence
  const [leads, setLeads] = useLocalStorage<Lead[]>('spinwheel_leads', []);
  const [segments, setSegments] = useLocalStorage<WheelSegment[]>('spinwheel_segments', DEFAULT_SEGMENTS);
  const [hasSpun, setHasSpun] = useLocalStorage<boolean>('spinwheel_has_spun', false);

  // UI State
  const [showForm, setShowForm] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState('');
  const [currentLead, setCurrentLead] = useState<{ name: string; phone: string; email: string } | null>(null);

  // Weighted random selection
  const selectPrize = useCallback((): WheelSegment => {
    const totalWeight = segments.reduce((sum, seg) => sum + seg.probability, 0);
    let random = Math.random() * totalWeight;
    
    for (const segment of segments) {
      random -= segment.probability;
      if (random <= 0) return segment;
    }
    
    return segments[0];
  }, [segments]);

  // Calculate rotation to land on specific segment
  const calculateRotation = useCallback((targetSegment: WheelSegment): number => {
    const segmentIndex = segments.findIndex(s => s.id === targetSegment.id);
    const segmentAngle = 360 / segments.length;
    const targetAngle = segmentIndex * segmentAngle + segmentAngle / 2;
    
    // Add multiple full rotations for effect (5-8 rotations)
    const fullRotations = (Math.floor(Math.random() * 4) + 5) * 360;
    
    // The wheel spins, so we need to calculate where top (pointer) will land
    // Pointer is at top (0°), wheel rotates clockwise
    const finalRotation = fullRotations + (360 - targetAngle);
    
    return finalRotation;
  }, [segments]);

  const handleSpinClick = () => {
    if (hasSpun) return;
    setShowForm(true);
  };

  const handleFormSubmit = (data: { name: string; phone: string; email: string }) => {
    setCurrentLead(data);
    setShowForm(false);
    
    // Select winner and spin
    const winner = selectPrize();
    setWonPrize(winner.name);
    
    const newRotation = rotation + calculateRotation(winner);
    setRotation(newRotation);
    setIsSpinning(true);

    // After spin completes
    setTimeout(() => {
      setIsSpinning(false);
      setHasSpun(true);
      
      // Save lead
      const newLead: Lead = {
        id: String(Date.now()),
        ...data,
        prizeWon: winner.name,
        timestamp: new Date().toISOString(),
      };
      setLeads(prev => [...prev, newLead]);
      
      // Show win modal
      setTimeout(() => {
        setShowWinModal(true);
      }, 500);
    }, 5000);
  };

  const handleAdminSuccess = () => {
    setShowAdminLogin(false);
    setShowAdminPanel(true);
  };

  // Admin panel view
  if (showAdminPanel) {
    return (
      <AdminPanel
        leads={leads}
        segments={segments}
        onUpdateSegments={setSegments}
        onBack={() => setShowAdminPanel(false)}
      />
    );
  }

  // Public view
  return (
    <div className="min-h-screen bg-gradient-dark flex flex-col">
      {/* Header */}
      <header className="p-4 flex justify-end">
        <button
          onClick={() => setShowAdminLogin(true)}
          className="p-2 rounded-full hover:bg-muted/50 transition-colors text-muted-foreground/50 hover:text-muted-foreground"
          aria-label="Admin access"
        >
          <Settings className="w-5 h-5" />
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
        {/* Decorative elements */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mb-4"
        >
          <Star className="w-5 h-5 text-primary" />
          <span className="text-primary text-sm font-medium tracking-wider uppercase">
            Exclusive Event
          </span>
          <Star className="w-5 h-5 text-primary" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-display text-4xl md:text-6xl font-bold text-center mb-2"
        >
          <span className="text-gradient-gold text-shadow-glow">Spin to Win!</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground text-center mb-8 max-w-md"
        >
          {hasSpun 
            ? "You've already spun! Check your email for your prize." 
            : "Try your luck and win amazing prizes! Every spin wins something."}
        </motion.p>

        {/* Spin Wheel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', bounce: 0.3 }}
          className="mb-8"
        >
          <SpinWheel 
            segments={segments} 
            rotation={rotation}
            isSpinning={isSpinning}
          />
        </motion.div>

        {/* Spin Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            onClick={handleSpinClick}
            disabled={isSpinning || hasSpun}
            className="btn-spin text-primary-foreground px-12 py-7 text-xl rounded-2xl"
          >
            {isSpinning ? (
              <>
                <Sparkles className="w-6 h-6 mr-2 animate-spin" />
                Spinning...
              </>
            ) : hasSpun ? (
              <>
                <Gift className="w-6 h-6 mr-2" />
                Already Played
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6 mr-2" />
                SPIN NOW
              </>
            )}
          </Button>
        </motion.div>

        {/* Prize hints */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 flex flex-wrap justify-center gap-2 max-w-md"
        >
          {segments.slice(0, 4).map((segment, i) => (
            <span
              key={segment.id}
              className="px-3 py-1 rounded-full bg-muted/50 text-muted-foreground text-xs"
            >
              {segment.name}
            </span>
          ))}
          {segments.length > 4 && (
            <span className="px-3 py-1 rounded-full bg-muted/50 text-muted-foreground text-xs">
              +{segments.length - 4} more
            </span>
          )}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center">
        <p className="text-muted-foreground/50 text-xs">
          © {new Date().getFullYear()} Spin & Win. All rights reserved.
        </p>
      </footer>

      {/* Modals */}
      <LeadForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleFormSubmit}
      />

      <WinModal
        isOpen={showWinModal}
        prize={wonPrize}
        onClose={() => setShowWinModal(false)}
      />

      <AdminLogin
        isOpen={showAdminLogin}
        onClose={() => setShowAdminLogin(false)}
        onSuccess={handleAdminSuccess}
      />
    </div>
  );
};

export default Index;
