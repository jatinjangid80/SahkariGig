import React from 'react';
import { WorkerDirectory } from './WorkerDirectory';

interface WorkersViewProps {
  selectedCategory?: string;
  selectedCity?: string;
  currentUserId?: string;
  onSelectWorkerForBooking: (worker: any) => void;
  onViewWorkerProfile: (worker: any) => void;
  onVerifyQrCode: (workerId: string) => void;
  onNavigate: (path: string) => void;
}

export const WorkersView: React.FC<WorkersViewProps> = ({
  selectedCategory = 'All',
  selectedCity = 'Jaipur',
  currentUserId,
  onSelectWorkerForBooking,
  onViewWorkerProfile,
  onVerifyQrCode,
  onNavigate
}) => {
  return (
    <div className="py-6 sm:py-8 bg-slate-50 dark:bg-[#0b0f19] min-h-[calc(100vh-4rem)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Live Marketplace Directory */}
        <WorkerDirectory
          selectedCategory={selectedCategory}
          selectedCity={selectedCity}
          currentUserId={currentUserId}
          onSelectWorkerForBooking={onSelectWorkerForBooking}
          onViewWorkerProfile={onViewWorkerProfile}
          onVerifyQrCode={onVerifyQrCode}
        />
      </div>
    </div>
  );
};

