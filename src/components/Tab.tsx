import React from "react";

interface TabProps {
  label: string;
  isActive: boolean;
}

export const Tab: React.FC<TabProps & { children: React.ReactNode }> = ({ label, isActive, children }) => {
  return (
    <div role="tabpanel" className={`${!isActive && 'hidden'}`}>
      {children}
    </div>
  );
};

interface TabGroupProps {
  tabs: { id: string; label: string }[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  children: React.ReactNode;
}

export const TabGroup: React.FC<TabGroupProps> = ({ tabs, activeTab, onTabChange, children }) => {
  const childrenArray = React.Children.toArray(children);
  const activeIndex = tabs.findIndex(tab => tab.id === activeTab);

  return (
    <div className="space-y-6">
      {/* Tab Headers */}
      <div className="relative flex w-full border-b border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`
              flex-1 px-4 py-2
              text-gray-500 hover:text-gray-300
              transition-colors duration-200
              ${activeTab === tab.id ? 'text-white' : ''}
            `}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
        
        {/* Sliding border - positioned absolutely */}
        <div 
          className="absolute bottom-0 h-0.5 bg-white transition-all duration-300 ease-out"
          style={{ 
            left: `${(activeIndex * 100) / tabs.length}%`,
            width: `${100 / tabs.length}%`
          }}
        />
      </div>

      {/* Tab Content */}
      <div className="pt-4">
        {React.Children.map(childrenArray, (child, index) => {
          if (!React.isValidElement(child)) return null;
          return React.cloneElement(child, {
            // @ts-ignore
            isActive: activeTab === tabs[index]?.id
          });
        })}
      </div>
    </div>
  );
};