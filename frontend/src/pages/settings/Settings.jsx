// frontend/src/pages/settings/Settings.jsx

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import SettingsSidebar from "../../components/settings/SettingsSidebar";
import ProfileSettings from "../../components/settings/ProfileSettings";
import NotificationSettings from "../../components/settings/NotificationSettings";
import AppearanceSettings from "../../components/settings/AppearanceSettings";
import SecuritySettings from "../../components/settings/SecuritySettings";
import IntegrationSettings from "../../components/settings/IntegrationSettings";
import DangerZone from "../../components/settings/DangerZone";

const Settings = () => {

  const location = useLocation();

  const [activeTab, setActiveTab] =
    useState("profile");

  const [isMobile, setIsMobile] =
    useState(false);

  // ===========================
  // Detect Screen Size
  // ===========================

  useEffect(() => {

    const handleResize = () => {

      setIsMobile(
        window.innerWidth < 768
      );

    };

    handleResize();

    window.addEventListener(
      "resize",
      handleResize
    );

    return () =>

      window.removeEventListener(
        "resize",
        handleResize
      );

  }, []);

  // ===========================
  // URL Hash
  // ===========================

  useEffect(() => {

    const hash =
      location.hash.replace("#", "");

    const validTabs = [

      "profile",

      "notifications",

      "appearance",

      "security",

      "integrations",

      "danger",

    ];

    if (
      validTabs.includes(hash)
    ) {

      setActiveTab(hash);

    }

  }, [location]);

  // ===========================
  // Render Active Tab
  // ===========================

  const renderContent = () => {

    switch (activeTab) {

      case "profile":

        return <ProfileSettings />;

      case "notifications":

        return (
          <NotificationSettings />
        );

      case "appearance":

        return (
          <AppearanceSettings />
        );

      case "security":

        return (
          <SecuritySettings />
        );

      case "integrations":

        return (
          <IntegrationSettings />
        );

      case "danger":

        return <DangerZone />;

      default:

        return <ProfileSettings />;

    }

  };

  return (

    <div className="max-w-7xl mx-auto">

      {/* Header */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-white">

          Settings

        </h1>

        <p className="mt-2 text-gray-400">

          Manage your account, preferences,
          security and integrations.

        </p>

      </div>

      {/* Content */}

      <div className="flex flex-col lg:flex-row gap-6">

        {/* Sidebar */}

        <SettingsSidebar

          activeTab={activeTab}

          setActiveTab={setActiveTab}

          isMobile={isMobile}

        />

        {/* Main Content */}

        <div className="flex-1">

          {renderContent()}

        </div>

      </div>

    </div>

  );

};

export default Settings;