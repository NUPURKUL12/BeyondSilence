import React from 'react';
import { 
  Heart, 
  Maximize2
} from 'lucide-react';
import { UserRole } from '../../types';

interface ProfilePageProps {
  userRole: UserRole;
  onOpenQuickModal: (title: string, text: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  onOpenQuickModal,
}) => {
  const profileData = {
    name: 'Alex Morgan',
    profileId: 'SIGN-USER-89210',
    primaryLanguage: 'American Sign Language (ASL) & Indian Sign Language (ISL)',
    hearingStatus: 'Deaf / Hard of Hearing',
    preferredComm: 'Live Captions Studio + Fullscreen Text Cards + Sign Glosses',
    emergencyContact: 'Sarah Morgan — +1 (555) 876-5432',
  };

  const handleExportCard = () => {
    onOpenQuickModal(
      `COMMUNICATION CARD: ${profileData.name}`,
      `USER: ${profileData.name} (ID: ${profileData.profileId})\nSTATUS: ${profileData.hearingStatus}\nLANGUAGES: ${profileData.primaryLanguage}\nPREFERRED COMM: ${profileData.preferredComm}\nPRIMARY CONTACT: ${profileData.emergencyContact}`
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1565C0] to-[#00897B] text-white flex items-center justify-center font-black text-2xl shadow-md shrink-0 font-heading">
            AM
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-slate-900 font-heading">
                {profileData.name}
              </h2>
              <span className="bg-teal-100 text-teal-800 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full border border-teal-200">
                VERIFIED SIGNER
              </span>
            </div>
            <p className="text-xs font-mono font-bold text-slate-500 mt-0.5">
              ID: {profileData.profileId}
            </p>
          </div>
        </div>

        <button
          onClick={handleExportCard}
          className="px-5 py-2.5 bg-[#1565C0] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Maximize2 className="w-4 h-4" />
          <span>PROJECT COMMUNICATION CARD</span>
        </button>
      </div>

      {/* Grid: Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Communication Preferences */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Heart className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900 font-heading">
              Communication Preferences
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">
                Hearing Status
              </span>
              <p className="font-extrabold text-slate-900 mt-0.5">
                {profileData.hearingStatus}
              </p>
            </div>

            <div>
              <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">
                Primary Sign Language
              </span>
              <p className="font-extrabold text-teal-700 mt-0.5">
                {profileData.primaryLanguage}
              </p>
            </div>

            <div>
              <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">
                Preferred Interaction Method
              </span>
              <p className="font-semibold text-slate-800 mt-0.5 leading-relaxed">
                {profileData.preferredComm}
              </p>
            </div>
          </div>
        </div>

        {/* Primary Contact */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 font-heading">
              Primary Contact & Relay
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 font-bold uppercase tracking-wider block text-[10px]">
                Designated Personal Contact
              </span>
              <p className="font-extrabold text-slate-900 mt-0.5 text-sm">
                {profileData.emergencyContact}
              </p>
              <p className="text-teal-700 font-medium text-[11px] mt-1">
                Authorized for direct SMS and voice relay notifications
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
