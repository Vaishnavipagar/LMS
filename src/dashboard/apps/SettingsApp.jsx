import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaCog, FaBell, FaPalette, FaUser, FaShieldAlt, FaInfoCircle, FaChevronLeft } from "react-icons/fa";

const SETTINGS_SECTIONS = [
  { id: "profile", title: "Profile", icon: FaUser, description: "Manage your profile settings" },
  { id: "notifications", title: "Notifications", icon: FaBell, description: "Configure notifications" },
  { id: "appearance", title: "Appearance", icon: FaPalette, description: "Customize look and feel" },
  { id: "privacy", title: "Privacy", icon: FaShieldAlt, description: "Privacy and security settings" },
  { id: "about", title: "About", icon: FaInfoCircle, description: "App information" },
];

export default function SettingsApp() {
  const [activeSection, setActiveSection] = useState(null);
  const [settings, setSettings] = useState({
    darkMode: false,
    notifications: true,
    emailAlerts: true,
    soundEffects: true,
  });
  const isMobile = window.innerWidth < 640;

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Mobile: show section list or section content
  if (isMobile && activeSection) {
    return (
      <div className="h-full flex flex-col">
        <button
          onClick={() => setActiveSection(null)}
          className="flex items-center gap-2 text-blue-500 mb-4 text-sm"
        >
          <FaChevronLeft size={12} />
          Back to Settings
        </button>
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <FaCog className="text-slate-500" />
          {SETTINGS_SECTIONS.find(s => s.id === activeSection)?.title}
        </h2>
        <div className="flex-1 overflow-auto">
          {renderSectionContent(activeSection, settings, toggleSetting)}
        </div>
      </div>
    );
  }

  // Mobile: section list
  if (isMobile) {
    return (
      <div className="h-full overflow-auto">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <FaCog className="text-slate-500" />
          Settings
        </h2>
        <div className="space-y-2">
          {SETTINGS_SECTIONS.map((section) => {
            const Icon = section.icon;
            return (
              <motion.button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className="w-full flex items-center gap-3 p-4 bg-slate-50 rounded-xl text-left"
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Icon size={18} className="text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{section.title}</div>
                  <div className="text-xs text-slate-500">{section.description}</div>
                </div>
                <FaChevronLeft size={12} className="text-slate-400 rotate-180" />
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  // Desktop: sidebar layout
  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-48 border-r border-slate-200 p-2">
        {SETTINGS_SECTIONS.map((section) => {
          const Icon = section.icon;
          return (
            <motion.button
              key={section.id}
              onClick={() => setActiveSection(section.id || "profile")}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm transition-colors ${
                (activeSection || "profile") === section.id
                  ? "bg-blue-100 text-blue-700"
                  : "hover:bg-slate-100 text-slate-600"
              }`}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon size={16} />
              <span>{section.title}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-auto">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <FaCog className="text-slate-500" />
          {SETTINGS_SECTIONS.find(s => s.id === (activeSection || "profile"))?.title}
        </h2>
        {renderSectionContent(activeSection || "profile", settings, toggleSetting)}
      </div>
    </div>
  );
}

function renderSectionContent(sectionId, settings, toggleSetting) {
  switch (sectionId) {
    case "profile":
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold">
              S
            </div>
            <div>
              <div className="font-semibold text-sm sm:text-base">Student Name</div>
              <div className="text-xs sm:text-sm text-slate-500">student@linuxschool.com</div>
            </div>
          </div>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
            Edit Profile
          </button>
        </div>
      );
    case "notifications":
      return (
        <div className="space-y-3">
          <SettingToggle
            label="Push Notifications"
            description="Receive push notifications"
            enabled={settings.notifications}
            onToggle={() => toggleSetting("notifications")}
          />
          <SettingToggle
            label="Email Alerts"
            description="Receive email notifications"
            enabled={settings.emailAlerts}
            onToggle={() => toggleSetting("emailAlerts")}
          />
          <SettingToggle
            label="Sound Effects"
            description="Play sounds for notifications"
            enabled={settings.soundEffects}
            onToggle={() => toggleSetting("soundEffects")}
          />
        </div>
      );
    case "appearance":
      return (
        <div className="space-y-3">
          <SettingToggle
            label="Dark Mode"
            description="Use dark theme"
            enabled={settings.darkMode}
            onToggle={() => toggleSetting("darkMode")}
          />
          <div className="p-3 sm:p-4 bg-slate-50 rounded-xl">
            <div className="font-medium mb-2 text-sm">Accent Color</div>
            <div className="flex gap-2">
              {["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"].map(color => (
                <button
                  key={color}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
      );
    case "privacy":
      return (
        <div className="space-y-3">
          <div className="p-3 sm:p-4 bg-slate-50 rounded-xl">
            <div className="font-medium mb-2 text-sm">Data & Privacy</div>
            <p className="text-xs sm:text-sm text-slate-500 mb-3">
              Your data is securely stored and never shared with third parties.
            </p>
            <button className="text-xs sm:text-sm text-blue-500 hover:underline">
              Download my data
            </button>
          </div>
        </div>
      );
    case "about":
      return (
        <div className="space-y-3">
          <div className="p-3 sm:p-4 bg-slate-50 rounded-xl">
            <div className="font-medium text-sm">The Linux School Dashboard</div>
            <div className="text-xs sm:text-sm text-slate-500 mt-1">Version 1.0.0</div>
            <div className="text-xs sm:text-sm text-slate-500 mt-2">
              A modern learning management system.
            </div>
          </div>
        </div>
      );
    default:
      return null;
  }
}

function SettingToggle({ label, description, enabled, onToggle }) {
  return (
    <div className="flex items-center justify-between p-3 sm:p-4 bg-slate-50 rounded-xl gap-3">
      <div className="min-w-0 flex-1">
        <div className="font-medium text-sm">{label}</div>
        <div className="text-xs text-slate-500 truncate">{description}</div>
      </div>
      <motion.button
        onClick={onToggle}
        className={`w-11 h-6 sm:w-12 sm:h-7 rounded-full p-1 transition-colors flex-shrink-0 ${
          enabled ? "bg-blue-500" : "bg-slate-300"
        }`}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full shadow-md"
          animate={{ x: enabled ? 18 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </motion.button>
    </div>
  );
}
