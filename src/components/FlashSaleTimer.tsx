import React, { useEffect, useState } from "react";

// Generates a random time between 20 min and 3 hours from now
function getRandomFutureTime() {
  const now = new Date();
  const min = 20 * 60 * 1000; // 20 minutes
  const max = 3 * 60 * 60 * 1000; // 3 hours
  const randomMs = Math.floor(Math.random() * (max - min)) + min;
  return new Date(now.getTime() + randomMs);
}

function getTimeLeft(target: Date) {
  const now = new Date();
  const diff = Math.max(0, target.getTime() - now.getTime());
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { hours, minutes, seconds };
}

interface FlashSaleTimerProps {
  onReset?: () => void;
}

const FlashSaleTimer: React.FC<FlashSaleTimerProps> = ({ onReset }) => {
  const [mounted, setMounted] = useState(false);
  const [target, setTarget] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    setMounted(true);
    const newTarget = getRandomFutureTime();
    setTarget(newTarget);
    setTimeLeft(getTimeLeft(newTarget));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mounted || !target) return;
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(target));
    }, 1000);
    return () => clearInterval(interval);
  }, [mounted, target]);

  // When timer hits zero, generate a new random timer and call onReset
  useEffect(() => {
    if (!mounted || !target) return;
    if (timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0) {
      const newTarget = getRandomFutureTime();
      setTarget(newTarget);
      setTimeLeft(getTimeLeft(newTarget));
      if (typeof onReset === 'function') onReset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  if (!mounted) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="flex items-center bg-[#F2F8F3] text-primary font-semibold px-4 py-1 rounded-full shadow-sm text-sm transition-all duration-200" style={{color:'#7BAE7F', boxShadow:'0 2px 8px 0 rgba(123,174,127,0.08)'}}>
        <svg className="w-4 h-4 mr-2 text-primary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="#7BAE7F" strokeWidth="2" fill="none" />
          <path stroke="#7BAE7F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
        </svg>
        <span className="font-mono tracking-wide text-base text-gray-800" style={{letterSpacing: '0.05em'}}>
          {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
        </span>
      </span>
    </div>
  );
};

export default FlashSaleTimer;
