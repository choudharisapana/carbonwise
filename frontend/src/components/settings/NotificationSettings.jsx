// frontend/src/components/settings/NotificationSettings.jsx

import React, { useState, useEffect } from "react";

import {
  FaGithub,
  FaChartLine,
} from "react-icons/fa";

import Card from "../common/Card";
import Button from "../common/Button";
import settingsService from "../../services/settingsService";


// ==========================================
// ONLY CURRENTLY SUPPORTED NOTIFICATIONS
// ==========================================

const notificationItems = [
  {
    key: "analysisCompleted",
    label: "Analysis Completed",
    description: "Notify when repository analysis finishes.",
    icon: FaChartLine,
  },
  {
    key: "githubSync",
    label: "GitHub Sync",
    description: "Notify when repositories sync successfully.",
    icon: FaGithub,
  },
];


const NotificationSettings = () => {

  // ==========================================
  // STATES
  // ==========================================

  const [loading, setLoading] = useState(false);

  const [initialLoading, setInitialLoading] =
    useState(true);

  const [success, setSuccess] = useState("");

  const [error, setError] = useState("");


  // ==========================================
  // NOTIFICATION PREFERENCES
  // ==========================================

  const [preferences, setPreferences] = useState({
    analysisCompleted: true,
    githubSync: true,
  });


  // ==========================================
  // LOAD SAVED PREFERENCES
  // ==========================================

  useEffect(() => {

    const loadPreferences = async () => {

      try {

        const data =
          await settingsService.getSettings();


        if (data.preferences?.notifications) {

          const savedNotifications =
            data.preferences.notifications;


          // Only use the two notifications
          // currently supported by the application

          setPreferences({
            analysisCompleted:
              savedNotifications.analysisCompleted ??
              true,

            githubSync:
              savedNotifications.githubSync ??
              true,
          });

        }

      } catch (err) {

        console.error(
          "Failed to load notification preferences:",
          err
        );

      } finally {

        setInitialLoading(false);

      }

    };


    loadPreferences();

  }, []);


  // ==========================================
  // TOGGLE NOTIFICATION
  // ==========================================

  const togglePreference = (key) => {

    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));

  };


  // ==========================================
  // SAVE PREFERENCES
  // ==========================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    setSuccess("");

    setError("");


    try {

      await settingsService.updateNotifications(
        preferences
      );


      setSuccess(
        "Notification preferences updated successfully."
      );

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Failed to update notification preferences."
      );

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // INITIAL LOADING
  // ==========================================

  if (initialLoading) {

    return (

      <Card
        className="
          bg-[#111827]
          border
          border-gray-800
          rounded-2xl
          p-5
          sm:p-6
          lg:p-8
        "
      >

        <div
          className="
            flex
            items-center
            justify-center
            py-12
          "
        >

          <div
            className="
              w-8
              h-8
              border-2
              border-emerald-500
              border-t-transparent
              rounded-full
              animate-spin
            "
          />

        </div>

      </Card>

    );

  }


  // ==========================================
  // UI
  // ==========================================

  return (

    <Card
      className="
        bg-[#111827]
        border
        border-gray-800
        rounded-2xl
        p-5
        sm:p-6
        lg:p-8
      "
    >


      {/* ================= HEADER ================= */}

      <div className="mb-6 sm:mb-8">

        <h3
          className="
            text-lg
            sm:text-xl
            font-semibold
            text-white
          "
        >

          Notification Preferences

        </h3>


        <p
          className="
            text-sm
            text-gray-400
            mt-2
          "
        >

          Choose which events should notify you.

        </p>

      </div>


      {/* ================= FORM ================= */}

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >


        {/* ================= NOTIFICATION ITEMS ================= */}

        {notificationItems.map((item) => {

          const Icon = item.icon;


          return (

            <div
              key={item.key}

              className="
                group
                flex
                items-center
                justify-between
                gap-3
                sm:gap-5

                rounded-xl

                border
                border-gray-800

                bg-gray-800/20

                p-4
                sm:p-5

                transition-all
                duration-200

                hover:border-gray-700
                hover:bg-gray-800/30
              "
            >


              {/* LEFT SIDE */}

              <div
                className="
                  flex
                  items-center
                  gap-3
                  sm:gap-4

                  min-w-0
                "
              >


                {/* ICON */}

                <div
                  className="
                    flex-shrink-0

                    w-10
                    h-10

                    sm:w-11
                    sm:h-11

                    rounded-xl

                    bg-emerald-500/10

                    flex
                    items-center
                    justify-center

                    border
                    border-emerald-500/10
                  "
                >

                  <Icon
                    className="
                      text-emerald-400
                      text-base
                      sm:text-lg
                    "
                  />

                </div>


                {/* TEXT */}

                <div className="min-w-0">

                  <h4
                    className="
                      text-white

                      text-sm
                      sm:text-base

                      font-medium

                      truncate
                    "
                  >

                    {item.label}

                  </h4>


                  <p
                    className="
                      text-xs
                      sm:text-sm

                      text-gray-400

                      mt-1

                      leading-relaxed
                    "
                  >

                    {item.description}

                  </p>

                </div>

              </div>


              {/* ================= TOGGLE ================= */}

              <label
                className="
                  relative

                  inline-flex

                  flex-shrink-0

                  items-center

                  cursor-pointer
                "
              >

                <input

                  type="checkbox"

                  className="sr-only peer"

                  checked={
                    preferences[item.key]
                  }

                  onChange={() =>
                    togglePreference(item.key)
                  }

                />


                <div
                  className="
                    relative

                    w-11
                    h-6

                    sm:w-12
                    sm:h-6

                    rounded-full

                    bg-gray-700

                    transition-colors
                    duration-300

                    peer-checked:bg-emerald-500

                    after:content-['']

                    after:absolute

                    after:top-[3px]
                    after:left-[3px]

                    after:h-[18px]
                    after:w-[18px]

                    sm:after:h-[20px]
                    sm:after:w-[20px]

                    after:rounded-full

                    after:bg-white

                    after:shadow-sm

                    after:transition-all
                    after:duration-300

                    peer-checked:after:translate-x-5

                    sm:peer-checked:after:translate-x-6
                  "
                />

              </label>

            </div>

          );

        })}


        {/* ================= SUCCESS ================= */}

        {success && (

          <div
            className="
              rounded-xl

              border
              border-emerald-500/20

              bg-emerald-500/10

              px-4
              py-3

              text-sm
              text-emerald-400
            "
          >

            {success}

          </div>

        )}


        {/* ================= ERROR ================= */}

        {error && (

          <div
            className="
              rounded-xl

              border
              border-red-500/20

              bg-red-500/10

              px-4
              py-3

              text-sm
              text-red-400
            "
          >

            {error}

          </div>

        )}


        {/* ================= SAVE BUTTON ================= */}

        <div className="pt-2">

          <Button

            type="submit"

            variant="primary"

            loading={loading}

            disabled={loading}

          >

            Save Preferences

          </Button>

        </div>


      </form>

    </Card>

  );

};


export default NotificationSettings;