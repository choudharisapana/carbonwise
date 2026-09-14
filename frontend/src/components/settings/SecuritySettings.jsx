import React, { useState } from "react";
import {
  FaClock,
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
  FaCheckCircle,
} from "react-icons/fa";

import Card from "../common/Card";
import Button from "../common/Button";

import settingsService from "../../services/settingsService";

const inputClass =
  "w-full px-4 py-3 bg-[#030712] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 pr-12";

const SecuritySettings = () => {

  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState("");

  const [error, setError] = useState("");

  const [showCurrent, setShowCurrent] =
    useState(false);

  const [showNew, setShowNew] =
    useState(false);

  const [showConfirm, setShowConfirm] =
    useState(false);

  const [formData, setFormData] = useState({

    currentPassword: "",

    newPassword: "",

    confirmPassword: "",

  });

  // ===========================
  // Password Strength
  // ===========================

  const getPasswordStrength = (password) => {

    if (!password) {

      return {

        score: 0,

        label: "Enter Password",

        color: "text-gray-400",

      };

    }

    let score = 0;

    if (password.length >= 8)
      score++;

    if (/[a-z]/.test(password) &&
        /[A-Z]/.test(password))
      score++;

    if (/\d/.test(password))
      score++;

    if (/[^a-zA-Z0-9]/.test(password))
      score++;

    const levels = [

      {
        label: "Weak",
        color: "text-red-400",
      },

      {
        label: "Fair",
        color: "text-orange-400",
      },

      {
        label: "Good",
        color: "text-yellow-400",
      },

      {
        label: "Strong",
        color: "text-emerald-400",
      },

    ];

    if (score === 0) {

      return {

        score: 0,

        label: "Weak",

        color: "text-red-400",

      };

    }

    return {

      score,

      ...levels[score - 1],

    };

  };

  const strength =
    getPasswordStrength(
      formData.newPassword
    );

  // ===========================
  // Handle Input
  // ===========================

  const handleChange = (e) => {

    const { name, value } =
      e.target;

    setFormData((prev) => ({

      ...prev,

      [name]: value,

    }));

    setSuccess("");

    setError("");

  };

  // ===========================
  // Submit
  // ===========================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    setSuccess("");

    setError("");

    // Password Match

    if (
      formData.newPassword !==
      formData.confirmPassword
    ) {

      setError(
        "Passwords do not match."
      );

      setLoading(false);

      return;

    }

    // Minimum Length

    if (
      formData.newPassword.length < 8
    ) {

      setError(
        "Password must contain at least 8 characters."
      );

      setLoading(false);

      return;

    }

    // Current = New

    if (
      formData.currentPassword ===
      formData.newPassword
    ) {

      setError(
        "New password must be different from current password."
      );

      setLoading(false);

      return;

    }

    try {

      await settingsService.updatePassword({

        currentPassword:
          formData.currentPassword,

        newPassword:
          formData.newPassword,

      });

      setSuccess(
        "Password updated successfully."
      );

      setFormData({

        currentPassword: "",

        newPassword: "",

        confirmPassword: "",

      });

      setShowCurrent(false);

      setShowNew(false);

      setShowConfirm(false);

    }

    catch (err) {

      setError(

        err.response?.data?.message ||

        "Failed to update password."

      );

    }

    finally {

      setLoading(false);

    }

  };
    return (

    <div className="space-y-6">

      {/* Change Password */}

      <Card className="bg-[#111827] border border-gray-800 p-6">

        <div className="flex items-center gap-3 mb-6">

          <FaShieldAlt className="text-emerald-400" size={20} />

          <div>

            <h3 className="text-lg font-semibold text-white">
              Change Password
            </h3>

            <p className="text-sm text-gray-400 mt-1">
              Update your account password to keep your account secure.
            </p>

          </div>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Current Password */}

          <div>

            <label className="block text-sm font-medium text-gray-300 mb-2">
              Current Password
            </label>

            <div className="relative">

              <input
                type={showCurrent ? "text" : "password"}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter current password"
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowCurrent(!showCurrent)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >

                {showCurrent ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}

              </button>

            </div>

          </div>

          {/* New Password */}

          <div>

            <label className="block text-sm font-medium text-gray-300 mb-2">
              New Password
            </label>

            <div className="relative">

              <input
                type={showNew ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className={inputClass}
                placeholder="Enter new password"
                required
                minLength={8}
              />

              <button
                type="button"
                onClick={() =>
                  setShowNew(!showNew)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >

                {showNew ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}

              </button>

            </div>

            {formData.newPassword && (

              <div className="mt-3">

                <div className="h-2 rounded-full bg-gray-700 overflow-hidden">

                  <div
                    className={`h-full transition-all duration-300 ${
                      strength.score === 1
                        ? "bg-red-500 w-1/4"
                        : strength.score === 2
                        ? "bg-orange-500 w-2/4"
                        : strength.score === 3
                        ? "bg-yellow-500 w-3/4"
                        : strength.score === 4
                        ? "bg-emerald-500 w-full"
                        : "w-0"
                    }`}
                  />

                </div>

                <p
                  className={`text-xs mt-2 ${strength.color}`}
                >
                  Password Strength : {strength.label}
                </p>

              </div>

            )}

          </div>

          {/* Confirm Password */}

          <div>

            <label className="block text-sm font-medium text-gray-300 mb-2">
              Confirm Password
            </label>

            <div className="relative">

              <input
                type={
                  showConfirm
                    ? "text"
                    : "password"
                }
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={inputClass}
                placeholder="Confirm new password"
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirm(!showConfirm)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >

                {showConfirm ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}

              </button>

            </div>

          </div>

          {/* Password Requirements */}

          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">

            <h4 className="text-sm font-semibold text-white mb-3">
              Password Requirements
            </h4>

            <div className="space-y-2 text-sm text-gray-300">

              <div className="flex items-center gap-2">
                <FaCheckCircle
                  className="text-emerald-400"
                  size={12}
                />
                Minimum 8 characters
              </div>

              <div className="flex items-center gap-2">
                <FaCheckCircle
                  className="text-emerald-400"
                  size={12}
                />
                One uppercase letter
              </div>

              <div className="flex items-center gap-2">
                <FaCheckCircle
                  className="text-emerald-400"
                  size={12}
                />
                One number
              </div>

              <div className="flex items-center gap-2">
                <FaCheckCircle
                  className="text-emerald-400"
                  size={12}
                />
                One special character
              </div>

            </div>

          </div>

          {success && (

            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-400">

              {success}

            </div>

          )}

          {error && (

            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">

              {error}

            </div>

          )}

          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={loading}
          >
            Update Password
          </Button>

        </form>

      </Card>

      {/* Security Information */}

      <Card className="bg-[#111827] border border-gray-800 p-6">

        <h3 className="text-lg font-semibold text-white mb-5">
          Security Information
        </h3>

        <div className="space-y-5">

          <div className="flex items-center gap-4">

            <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center">

              <FaClock className="text-emerald-400" />

            </div>

            <div>

              <p className="text-white text-sm font-medium">
                Last Login
              </p>

              <p className="text-xs text-gray-400">
                Coming Soon
              </p>

            </div>

          </div>

          <div className="border-t border-gray-800 pt-5">

            <p className="text-white text-sm font-medium">
              Two-Factor Authentication
            </p>

            <p className="text-xs text-gray-400 mt-1">
              Coming Soon
            </p>

          </div>

          <div className="border-t border-gray-800 pt-5">

            <p className="text-white text-sm font-medium">
              Active Sessions
            </p>

            <p className="text-xs text-gray-400 mt-1">
              Coming Soon
            </p>

          </div>

        </div>

      </Card>

    </div>

  );

};

export default SecuritySettings;