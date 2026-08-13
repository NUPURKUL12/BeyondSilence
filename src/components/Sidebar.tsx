import React from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Video, 
  BookOpen, 
  BarChart3, 
  User, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  Languages,
  Bot
} from 'lucide-react';
import { UserRole } from '../types';

export type NavTab = 
  | 'dashboard' 
  | 'quick_phrases' 
  | 'live_comm' 
  | 'learn_isl' 
  | 'analytics' 
  | 'profile' 
  | 'settings'
  | 'chatbot';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  userRole: UserRole;
  soundAlertCount: number;
}

interface NavItem {
  id: NavTab;
  label: string;
  icon: React.ElementType;
  badge?: string | null;
  badgeColor?: string;
}

interface NavGroup {
  category: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  userRole,
  soundAlertCount,
}) => {
  const navGroups: NavGroup[] = [
    {
      category: 'MAIN MENU',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: LayoutDashboard,
        },
        {
          id: 'live_comm',
          label: 'Live Translator',
          icon: Video,
          badge: 'AI Studio',
          badgeColor: 'bg-[#1565C0] text-white',
        },
        {
          id: 'chatbot',
          label: 'Gemini Chatbot',
          icon: Bot,
          badge: 'New',
          badgeColor: 'bg-emerald-600 text-white',
        },
        {
          id: 'quick_phrases',
          label: 'Quick Phrases',
          icon: MessageSquare,
        },
      ],
    },
    {
      category: 'REFERENCE & TOOLS',
      items: [
        {
          id: 'learn_isl',
          label: 'Sign Dictionary',
          icon: BookOpen,
        },
        {
          id: 'analytics',
          label: 'Translation Logs',
          icon: BarChart3,
        },
        {
          id: 'profile',
          label: 'Signer Profile',
          icon: User,
        },
        {
          id: 'settings',
          label: 'Settings',
          icon: Settings,
        },
      ],
    },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen bg-white border-r border-slate-200 shadow-xs transition-all duration-300 ease-in-out flex flex-col justify-between ${
        isCollapsed ? 'w-[64px]' : 'w-[240px]'
      }`}
    >
      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-5 w-6 h-6 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-800 shadow-xs flex items-center justify-center z-50 transition-transform hover:scale-110 cursor-pointer"
        title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
      >
        {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Top Section */}
      <div className="flex-1 min-h-0 flex flex-col overflow-y-auto no-scrollbar">
        {/* Header / Brand */}
        <div className={`h-16 border-b border-slate-100 shrink-0 flex items-center ${isCollapsed ? 'justify-center px-2' : 'justify-start px-4 gap-2.5'}`}>
          <div
            onClick={() => isCollapsed && setIsCollapsed(false)}
            className={`w-9 h-9 rounded-xl bg-gradient-to-br from-[#1565C0] to-[#00897B] flex items-center justify-center text-white font-extrabold shadow-xs shrink-0 ${isCollapsed ? 'cursor-pointer hover:opacity-90' : ''}`}
            title={isCollapsed ? 'Expand Sidebar' : 'BeyondSilence'}
          >
            <Languages className="w-5 h-5 text-white" />
          </div>

          {!isCollapsed && (
            <div className="flex flex-col whitespace-nowrap overflow-hidden">
              <span className="font-extrabold text-slate-900 tracking-tight text-sm font-heading leading-tight">
                BeyondSilence
              </span>
              <span className="text-[10px] font-bold text-blue-600 tracking-wider uppercase">
                Sign Language AI
              </span>
            </div>
          )}
        </div>

        {/* Navigation Categories */}
        <nav className="p-2.5 space-y-4 my-2">
          {navGroups.map((group, groupIdx) => (
            <div key={group.category} className="space-y-1">
              {!isCollapsed ? (
                <div className="px-3 pt-2 pb-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase select-none">
                  {group.category}
                </div>
              ) : groupIdx > 0 ? (
                <div className="my-2 border-t border-slate-100 mx-2" />
              ) : null}

              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between py-1 px-1 rounded-xl text-xs font-semibold transition-all relative group cursor-pointer ${
                      isActive
                        ? 'bg-blue-50/80 text-blue-700 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-blue-600 rounded-r-full" />
                    )}

                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 flex items-center justify-center shrink-0">
                        <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-800'}`} />
                      </div>

                      {!isCollapsed && (
                        <span className="truncate text-xs font-semibold tracking-tight">
                          {item.label}
                        </span>
                      )}
                    </div>

                    {!isCollapsed && item.badge && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}

                    {isCollapsed && (
                      <div className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                        {item.label}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom User Role Badge */}
      <div className="p-2.5 border-t border-slate-100 bg-slate-50/50 shrink-0">
        <div className={`flex items-center gap-2.5 ${isCollapsed ? 'justify-center' : 'px-2 py-1'}`}>
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
            {userRole === 'signer' ? 'SL' : 'LR'}
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-slate-800 truncate font-heading">
                Alex Morgan
              </span>
              <span className="text-[10px] text-blue-700 font-bold uppercase">
                {userRole === 'signer' ? 'Signer Mode' : 'Learner Mode'}
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
