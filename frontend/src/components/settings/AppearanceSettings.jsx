import React, { useState, useEffect, useContext } from "react";
import {
  FaMoon,
  FaSun,
  FaDownload,
} from "react-icons/fa";

import Card from "../common/Card";
import Button from "../common/Button";

import settingsService from "../../services/settingsService";
import { ThemeContext } from "../../context/ThemeContext";

const themeOptions = [
  {
    value: "dark",
    label: "Dark",
    icon: FaMoon,
  },
  {
    value: "light",
    label: "Light (Coming Soon)",
    icon: FaSun,
    disabled: true,
  },
];

const carbonUnits = [
  {
    value: "gCO₂",
    label: "gCO₂",
  },
  {
    value: "kgCO₂",
    label: "kgCO₂",
  },
];

const exportFormats = [
  {
    value: "PDF",
    label: "PDF",
  },
  {
    value: "CSV",
    label: "CSV",
  },
];

const AppearanceSettings = () => {

  const { setPreferencesLocal } = useContext(ThemeContext);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [success, setSuccess] = useState("");

  const [error, setError] = useState("");

  const [preferences, setPreferences] = useState({
    theme: "dark",
    carbonUnit: "gCO₂",
    defaultExport: "PDF",
  });

  // Load the user's actual saved appearance settings instead of always
  // showing defaults
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const data = await settingsService.getSettings();
        if (data.preferences?.appearance) {
          setPreferences(data.preferences.appearance);
        }
      } catch (err) {
        console.error('Failed to load appearance settings:', err);
      } finally {
        setInitialLoading(false);
      }
    };
    loadPreferences();
  }, []);

  const handleChange = (key, value) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));

    setSuccess("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setSuccess("");
    setError("");

    try {

      await settingsService.updateAppearance(preferences);

      // Keep the rest of the app (Navbar, Sidebar) in sync immediately —
      // the backend was already updated above, so this just updates local
      // state/localStorage without firing a second API call.
      setPreferencesLocal(preferences);

      setSuccess("Appearance settings updated successfully.");

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Failed to update appearance settings."
      );

    } finally {

      setLoading(false);

    }
  };

  if (initialLoading) {
    return (
      <Card className="bg-[#111827] border border-gray-800 p-6">
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </Card>
    );
  }

  return (

    <Card className="bg-[#111827] border border-gray-800 p-6">

      <h3 className="text-lg font-semibold text-white">
        Appearance Settings
      </h3>

      <p className="text-sm text-gray-400 mt-2 mb-6">
        Customize how CarbonWise looks and behaves.
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-8"
      >

        {/* Theme */}

        <div>

          <h4 className="text-sm font-medium text-gray-300 mb-4">
            Theme
          </h4>

          <div className="grid grid-cols-2 gap-4">

            {themeOptions.map((option) => {

              const Icon = option.icon;

              return (

                <button
                  key={option.value}
                  type="button"
                  disabled={option.disabled}
                  onClick={() =>
                    !option.disabled &&
                    handleChange("theme", option.value)
                  }
                  className={`rounded-xl border-2 p-4 transition ${
                    preferences.theme === option.value
                      ? "border-emerald-500 bg-emerald-500/10"
                      : "border-gray-700 bg-gray-800/30 hover:border-gray-600"
                  } ${
                    option.disabled
                      ? "cursor-not-allowed opacity-50"
                      : ""
                  }`}
                >

                  <div className="flex items-center gap-3">

                    <Icon
                      size={18}
                      className={
                        preferences.theme === option.value
                          ? "text-emerald-400"
                          : "text-gray-400"
                      }
                    />

                    <span
                      className={
                        preferences.theme === option.value
                          ? "text-white font-medium"
                          : "text-gray-400"
                      }
                    >
                      {option.label}
                    </span>

                  </div>

                </button>

              );

            })}

          </div>

        </div>

        {/* Carbon Unit */}

        <div>

          <h4 className="text-sm font-medium text-gray-300 mb-4">
            Carbon Unit
          </h4>

          <div className="grid grid-cols-2 gap-4">

            {carbonUnits.map((option) => (

              <button
                key={option.value}
                type="button"
                onClick={() =>
                  handleChange(
                    "carbonUnit",
                    option.value
                  )
                }
                className={`rounded-xl border-2 p-4 transition ${
                  preferences.carbonUnit === option.value
                    ? "border-emerald-500 bg-emerald-500/10 text-white"
                    : "border-gray-700 bg-gray-800/30 text-gray-400 hover:border-gray-600"
                }`}
              >
                {option.label}
              </button>

            ))}

          </div>

        </div>

        {/* Export Format */}

        <div>

          <h4 className="text-sm font-medium text-gray-300 mb-4">
            Default Export Format
          </h4>

          <div className="grid grid-cols-2 gap-4">

            {exportFormats.map((option) => (

              <button
                key={option.value}
                type="button"
                onClick={() =>
                  handleChange(
                    "defaultExport",
                    option.value
                  )
                }
                className={`flex items-center justify-center gap-2 rounded-xl border-2 p-4 transition ${
                  preferences.defaultExport === option.value
                    ? "border-emerald-500 bg-emerald-500/10 text-white"
                    : "border-gray-700 bg-gray-800/30 text-gray-400 hover:border-gray-600"
                }`}
              >

                <FaDownload size={14} />

                {option.label}

              </button>

            ))}

          </div>

        </div>

        {success && (

          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">

            {success}

          </div>

        )}

        {error && (

          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">

            {error}

          </div>

        )}

        <Button
          type="submit"
          variant="primary"
          loading={loading}
          disabled={loading}
        >
          Save Settings
        </Button>

      </form>

    </Card>

  );

};

export default AppearanceSettings;