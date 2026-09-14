// frontend/src/components/settings/SettingsSidebar.jsx
import React from 'react';
import { 
  FaUser, 
  FaBell, 
  FaPalette, 
  FaShieldAlt, 
  FaPlug, 
  FaExclamationTriangle 
} from 'react-icons/fa';

const SettingsSidebar = ({ activeTab, setActiveTab, isMobile }) => {
  const tabs = [
    { id: 'profile', label: 'Profile', icon: FaUser },
    { id: 'notifications', label: 'Notifications', icon: FaBell },
    { id: 'appearance', label: 'Appearance', icon: FaPalette },
    { id: 'security', label: 'Security', icon: FaShieldAlt },
    { id: 'integrations', label: 'Integrations', icon: FaPlug },
    { id: 'danger', label: 'Danger Zone', icon: FaExclamationTriangle },
  ];

  if (isMobile) {
    return (
      <div className="overflow-x-auto pb-2 mb-6 scrollbar-hide">
        <div className="flex gap-2 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
             <tab.icon
className={
activeTab===tab.id
?
"text-emerald-400"
:
"text-gray-500"
}
/>
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 flex-shrink-0">
      <div className="bg-[#111827] border border-gray-800 rounded-2xl p-2 sticky top-20">
        <nav className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <tab.icon
className={
activeTab===tab.id
?
"text-emerald-400"
:
"text-gray-500"
}
/>
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default SettingsSidebar;