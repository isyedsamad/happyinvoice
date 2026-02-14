import { useEffect } from 'react';
import { Sparkles } from "lucide-react";


export default function PlanLimit({ isOpen, onClose, title, message }) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[var(--bgPanel)] rounded-2xl shadow-xl w-full max-w-sm p-6 text-center animate-scaleIn relative overflow-hidden">
        {/* Sparkle Glow Container */}
        {/* <div className="absolute top-5 left-1/2 transform -translate-x-1/2 w-24 h-24 rounded-full bg-[var(--primaryPanel)] opacity-10 blur-2xl animate-sparkle" /> */}

        {/* ICON */}
        <div
          className="w-14 h-14 mx-auto flex items-center justify-center rounded-full z-10 relative shadow-md"
          style={{ backgroundColor: 'var(--primaryPanel)' }}
        >
          {/* Sparkle Upgrade Icon */}
          <Sparkles className="w-7 h-7 text-white" />
        </div>

        {/* TITLE */}
        <h2 className="mt-6 text-xl font-semibold text-[var(--textPrimary)]">{title}</h2>

        {/* MESSAGE */}
        <p className="mt-2 text-[var(--textSecondary)] text-sm leading-relaxed">{message}</p>

        {/* CTA */}
        <button
          className="mt-6 w-full bg-[var(--primaryPanel)] cursor-pointer hover:opacity-90 transition text-[var(--textTrans)] text-sm font-medium py-2.5 rounded-lg"
          onClick={() => {
            onClose();
            window.location.href = '/upgrade';
          }}
        >
          Upgrade Now
        </button>

        {/* CANCEL */}
        <button
          onClick={onClose}
          className="mt-3 text-sm text-gray-500 cursor-pointer hover:underline"
        >
          Maybe Later
        </button>
      </div>

      {/* ANIMATIONS & STYLES */}
      <style jsx>{`
        .animate-scaleIn {
          animation: scaleIn 0.25s ease-out;
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.92);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-sparkle {
          animation: sparkleGlow 2.4s ease-in-out infinite;
        }

        @keyframes sparkleGlow {
          0%, 100% {
            opacity: 0.12;
            transform: scale(1);
          }
          50% {
            opacity: 0.24;
            transform: scale(1.3);
          }
        }
      `}</style>
    </div>
  );
}
