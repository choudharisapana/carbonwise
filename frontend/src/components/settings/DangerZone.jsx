// frontend/src/components/settings/DangerZone.jsx

import React, { useState } from "react";
import {
  FaExclamationTriangle,
  FaTrash,
  FaSignOutAlt,
} from "react-icons/fa";

import Card from "../common/Card";
import Button from "../common/Button";

const DangerZone = () => {

  const [deleteLoading, setDeleteLoading] =
    useState(false);

  const [logoutLoading, setLogoutLoading] =
    useState(false);

  const [success, setSuccess] =
    useState("");

  const [error, setError] =
    useState("");

  // ===========================
  // Delete Account
  // ===========================

  const handleDeleteAccount = async () => {

    const confirmDelete = window.confirm(
      "This will permanently delete your CarbonWise account and all associated data. This action cannot be undone.\n\nDo you want to continue?"
    );

    if (!confirmDelete) return;

    setDeleteLoading(true);
    setSuccess("");
    setError("");

    try {

      // TODO:
      // await settingsService.deleteAccount();

      setSuccess(
        "Delete account feature will be available soon."
      );

    } catch (err) {

      setError(
        "Unable to delete account."
      );

    } finally {

      setDeleteLoading(false);

    }

  };

  // ===========================
  // Logout All Devices
  // ===========================

  const handleLogoutAll = async () => {

    const confirmLogout = window.confirm(
      "Logout from all active devices?"
    );

    if (!confirmLogout) return;

    setLogoutLoading(true);
    setSuccess("");
    setError("");

    try {

      // TODO:
      // await settingsService.logoutAllDevices();

      setSuccess(
        "Logout from all devices feature will be available soon."
      );

    } catch (err) {

      setError(
        "Unable to logout from all devices."
      );

    } finally {

      setLogoutLoading(false);

    }

  };

  return (

    <Card className="bg-[#111827] border border-red-500/20 p-6">

      <div className="flex items-center gap-3 mb-3">

        <FaExclamationTriangle
          className="text-red-400"
          size={22}
        />

        <h3 className="text-lg font-semibold text-red-400">

          Danger Zone

        </h3>

      </div>

      <p className="text-sm text-gray-400 mb-8">

        These actions are permanent and cannot be undone.
        Please proceed carefully.

      </p>

      {/* Delete Account */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-xl border border-red-500/20 bg-red-500/5 p-5">

        <div>

          <h4 className="text-white font-medium">

            Delete Account

          </h4>

          <p className="text-sm text-gray-400 mt-1">

            Permanently remove your account,
            repositories, reports, analyses and all
            associated data.

          </p>

        </div>

        <Button
          variant="danger"
          loading={deleteLoading}
          disabled={deleteLoading}
          onClick={handleDeleteAccount}
          className="flex items-center gap-2"
        >

          <FaTrash />

          Delete Account

        </Button>

      </div>

      {/* Logout All */}

      <div className="mt-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-xl border border-orange-500/20 bg-orange-500/5 p-5">

        <div>

          <h4 className="text-white font-medium">

            Logout From All Devices

          </h4>

          <p className="text-sm text-gray-400 mt-1">

            End all active sessions except your
            current session.

          </p>

        </div>

        <Button
          variant="secondary"
          loading={logoutLoading}
          disabled={logoutLoading}
          onClick={handleLogoutAll}
          className="flex items-center gap-2 text-orange-400 hover:text-orange-300"
        >

          <FaSignOutAlt />

          Logout All

        </Button>

      </div>

      {success && (

        <div className="mt-6 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-400">

          {success}

        </div>

      )}

      {error && (

        <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">

          {error}

        </div>

      )}

    </Card>

  );

};

export default DangerZone;