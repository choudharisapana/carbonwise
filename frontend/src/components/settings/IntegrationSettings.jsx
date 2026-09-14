// // frontend/src/components/settings/IntegrationSettings.jsx

// import React, { useEffect, useState } from "react";
// import { useSearchParams } from "react-router-dom";
// import {
//   FaGithub,
//   FaUnlink,
//   FaCheckCircle,
// } from "react-icons/fa";

// import Card from "../common/Card";
// import Button from "../common/Button";

// import githubOAuthService from "../../services/githubOAuthService";

// const IntegrationSettings = () => {

//   const [searchParams, setSearchParams] = useSearchParams();

//   const [loading, setLoading] = useState(false);

//   const [statusLoading, setStatusLoading] = useState(true);

//   const [success, setSuccess] = useState("");

//   const [error, setError] = useState("");

//   const [github, setGithub] = useState({
//     connected: false,
//     githubUsername: "",
//     githubAvatarUrl: "",
//   });


//   // ==========================================
//   // Fetch GitHub Status
//   // ==========================================

//   useEffect(() => {
//     fetchGithubStatus();

//     // After GitHub redirects back with ?github=connected or ?github=error
//     const githubResult = searchParams.get("github");

//     if (githubResult === "connected") {
//       setSuccess("GitHub account connected successfully!");
//       // Clean the URL so refreshing doesn't re-show the message
//       searchParams.delete("github");
//       setSearchParams(searchParams, { replace: true });
//     } else if (githubResult === "error") {
//       const reason = searchParams.get("reason");
//       setError(
//         reason === "token_exchange_failed"
//           ? "GitHub authorization failed. Please try connecting again."
//           : "Something went wrong while connecting GitHub. Please try again."
//       );
//       searchParams.delete("github");
//       searchParams.delete("reason");
//       setSearchParams(searchParams, { replace: true });
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);


//   const fetchGithubStatus = async () => {

//     try {

//       setStatusLoading(true);
//       setError("");

//       const response =
//         await githubOAuthService.getStatus();

//       setGithub({
//         connected: !!response.connected,

//         githubUsername:
//           response.githubUsername || "",

//         githubAvatarUrl:
//           response.githubAvatarUrl || "",
//       });

//     } catch (err) {

//       console.error(
//         "GitHub status error:",
//         err
//       );

//       setError(
//         err.response?.data?.message ||
//         "Unable to load GitHub connection status."
//       );

//     } finally {

//       setStatusLoading(false);

//     }
//   };


//   // ==========================================
//   // Connect GitHub
//   // ==========================================

//   const handleConnect = () => {

//     setError("");
//     setSuccess("");

//     githubOAuthService.connect();

//   };


//   // ==========================================
//   // Disconnect GitHub
//   // ==========================================

//   const handleDisconnect = async () => {

//     const confirmed =
//       window.confirm(
//         "Are you sure you want to disconnect your GitHub account?"
//       );

//     if (!confirmed) {
//       return;
//     }

//     try {

//       setLoading(true);
//       setError("");
//       setSuccess("");

//       await githubOAuthService.disconnect();

//       setGithub({
//         connected: false,
//         githubUsername: "",
//         githubAvatarUrl: "",
//       });

//       setSuccess(
//         "GitHub account disconnected successfully."
//       );

//     } catch (err) {

//       console.error(
//         "GitHub disconnect error:",
//         err
//       );

//       setError(
//         err.response?.data?.message ||
//         "Unable to disconnect GitHub account."
//       );

//     } finally {

//       setLoading(false);

//     }
//   };


//   // ==========================================
//   // Loading State
//   // ==========================================

//   if (statusLoading) {

//     return (

//       <div className="space-y-6">

//         <Card className="bg-[#111827] border border-gray-800 p-6">

//           <div className="flex items-center justify-center py-12">

//             <div className="text-center">

//               <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />

//               <p className="text-sm text-gray-400 mt-4">
//                 Checking GitHub connection...
//               </p>

//             </div>

//           </div>

//         </Card>

//       </div>

//     );
//   }


//   return (

//     <div className="space-y-6">

//       {/* ======================================
//           GitHub Integration
//       ======================================= */}

//       <Card className="bg-[#111827] border border-gray-800 p-6">

//         <div className="flex items-center gap-3 mb-6">

//           <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center">

//             <FaGithub
//               className="text-white"
//               size={22}
//             />

//           </div>

//           <div>

//             <h3 className="text-lg font-semibold text-white">
//               GitHub Integration
//             </h3>

//             <p className="text-sm text-gray-400 mt-1">
//               Connect your GitHub account to analyze public
//               and private repositories.
//             </p>

//           </div>

//         </div>


//         {/* GitHub Account Card */}

//         <div className="rounded-xl border border-gray-800 bg-gray-800/20 p-5">

//           <div className="flex flex-col sm:flex-row gap-5">

//             {/* Avatar */}

//             <div className="flex-shrink-0">

//               {github.githubAvatarUrl ? (

//                 <img
//                   src={github.githubAvatarUrl}
//                   alt={
//                     github.githubUsername
//                       ? `${github.githubUsername} GitHub avatar`
//                       : "GitHub avatar"
//                   }
//                   className="w-20 h-20 rounded-full border border-gray-700 object-cover"
//                 />

//               ) : (

//                 <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700">

//                   <FaGithub
//                     size={34}
//                     className="text-gray-400"
//                   />

//                 </div>

//               )}

//             </div>


//             {/* Details */}

//             <div className="flex-1">

//               <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

//                 <div>

//                   <div className="flex flex-wrap items-center gap-2">

//                     <h4 className="text-white font-semibold">
//                       GitHub Account
//                     </h4>

//                     {github.connected ? (

//                       <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">

//                         <FaCheckCircle size={10} />

//                         Connected

//                       </span>

//                     ) : (

//                       <span className="inline-flex rounded-full bg-gray-700 px-3 py-1 text-xs text-gray-400">

//                         Not Connected

//                       </span>

//                     )}

//                   </div>


//                   <p className="text-gray-400 mt-2">

//                     {github.connected
//                       ? `@${github.githubUsername}`
//                       : "No GitHub account connected."}

//                   </p>


//                   {github.connected && (

//                     <p className="text-xs text-gray-500 mt-2">

//                       Your GitHub account is connected
//                       and ready for repository analysis.

//                     </p>

//                   )}

//                 </div>


//                 {/* Connect Button */}

//                 {!github.connected && (

//                   <Button
//                     variant="primary"
//                     onClick={handleConnect}
//                   >

//                     <FaGithub className="mr-2" />

//                     Connect GitHub

//                   </Button>

//                 )}

//               </div>


//               {/* Connected Actions */}

//               {github.connected && (

//                 <div className="flex flex-wrap gap-3 mt-6">

//                   <Button
//                     variant="secondary"
//                     onClick={handleDisconnect}
//                     loading={loading}
//                     disabled={loading}
//                     className="text-red-400 hover:text-red-300"
//                   >

//                     <FaUnlink className="mr-2" />

//                     Disconnect

//                   </Button>

//                 </div>

//               )}

//             </div>

//           </div>

//         </div>


//         {/* Success */}

//         {success && (

//           <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">

//             {success}

//           </div>

//         )}


//         {/* Error */}

//         {error && (

//           <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">

//             {error}

//           </div>

//         )}

//       </Card>


//       {/* ======================================
//           Upcoming Integrations
//       ======================================= */}

//       <Card className="bg-[#111827] border border-gray-800 p-6">

//         <h3 className="text-lg font-semibold text-white mb-5">

//           Upcoming Integrations

//         </h3>


//         <div className="space-y-3">

//           {/* GitLab */}

//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border border-gray-800 rounded-xl p-4">

//             <div>

//               <p className="text-white font-medium">
//                 GitLab
//               </p>

//               <p className="text-xs text-gray-400 mt-1">
//                 Analyze repositories hosted on GitLab.
//               </p>

//             </div>

//             <span className="self-start sm:self-auto text-xs text-yellow-400 bg-yellow-500/10 px-3 py-1 rounded-full">

//               Coming Soon

//             </span>

//           </div>


//           {/* Bitbucket */}

//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border border-gray-800 rounded-xl p-4">

//             <div>

//               <p className="text-white font-medium">
//                 Bitbucket
//               </p>

//               <p className="text-xs text-gray-400 mt-1">
//                 Connect Bitbucket repositories.
//               </p>

//             </div>

//             <span className="self-start sm:self-auto text-xs text-yellow-400 bg-yellow-500/10 px-3 py-1 rounded-full">

//               Coming Soon

//             </span>

//           </div>

//         </div>

//       </Card>

//     </div>

//   );

// };

// export default IntegrationSettings;

// frontend/src/components/settings/IntegrationSettings.jsx

import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  FaGithub,
  FaUnlink,
  FaCheckCircle,
} from "react-icons/fa";

import Card from "../common/Card";
import Button from "../common/Button";

import githubOAuthService from "../../services/githubOAuthService";

const IntegrationSettings = () => {

  const [searchParams, setSearchParams] = useSearchParams();

  const [loading, setLoading] = useState(false);

  const [statusLoading, setStatusLoading] = useState(true);

  const [success, setSuccess] = useState("");

  const [error, setError] = useState("");

  const [github, setGithub] = useState({
    connected: false,
    githubUsername: "",
    githubAvatarUrl: "",
  });


  // ==========================================
  // Fetch GitHub Status
  // ==========================================

  useEffect(() => {
    fetchGithubStatus();

    // After GitHub redirects back with ?github=connected or ?github=error
    const githubResult = searchParams.get("github");

    if (githubResult === "connected") {
      setSuccess("GitHub account connected successfully!");
      // Clean the URL so refreshing doesn't re-show the message
      searchParams.delete("github");
      setSearchParams(searchParams, { replace: true });
    } else if (githubResult === "error") {
      const reason = searchParams.get("reason");
      setError(
        reason === "token_exchange_failed"
          ? "GitHub authorization failed. Please try connecting again."
          : "Something went wrong while connecting GitHub. Please try again."
      );
      searchParams.delete("github");
      searchParams.delete("reason");
      setSearchParams(searchParams, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const fetchGithubStatus = async () => {

    try {

      setStatusLoading(true);
      setError("");

      const response =
        await githubOAuthService.getStatus();

      setGithub({
        connected: !!response.connected,

        githubUsername:
          response.githubUsername || "",

        githubAvatarUrl:
          response.githubAvatarUrl || "",
      });

    } catch (err) {

      console.error(
        "GitHub status error:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to load GitHub connection status."
      );

    } finally {

      setStatusLoading(false);

    }
  };


  // ==========================================
  // Connect GitHub
  // ==========================================

  const handleConnect = () => {

    setError("");
    setSuccess("");

    githubOAuthService.connect();

  };


  // ==========================================
  // Disconnect GitHub
  // ==========================================

  const handleDisconnect = async () => {

    const confirmed =
      window.confirm(
        "Are you sure you want to disconnect your GitHub account?"
      );

    if (!confirmed) {
      return;
    }

    try {

      setLoading(true);
      setError("");
      setSuccess("");

      await githubOAuthService.disconnect();

      setGithub({
        connected: false,
        githubUsername: "",
        githubAvatarUrl: "",
      });

      setSuccess(
        "GitHub account disconnected successfully."
      );

    } catch (err) {

      console.error(
        "GitHub disconnect error:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to disconnect GitHub account."
      );

    } finally {

      setLoading(false);

    }
  };


  // ==========================================
  // Loading State
  // ==========================================

  if (statusLoading) {

    return (

      <div className="space-y-6">

        <Card className="bg-[#111827] border border-gray-800 p-6">

          <div className="flex items-center justify-center py-12">

            <div className="text-center">

              <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />

              <p className="text-sm text-gray-400 mt-4">
                Checking GitHub connection...
              </p>

            </div>

          </div>

        </Card>

      </div>

    );
  }


  return (

    <div className="space-y-6">

      {/* ======================================
          GitHub Integration
      ======================================= */}

      <Card className="bg-[#111827] border border-gray-800 p-6">

        <div className="flex items-center gap-3 mb-6">

          <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center">

            <FaGithub
              className="text-white"
              size={22}
            />

          </div>

          <div>

            <h3 className="text-lg font-semibold text-white">
              GitHub Integration
            </h3>

            <p className="text-sm text-gray-400 mt-1">
              Connect your GitHub account to analyze public
              and private repositories.
            </p>

          </div>

        </div>


        {/* GitHub Account Card */}

        <div className="rounded-xl border border-gray-800 bg-gray-800/20 p-5">

          <div className="flex flex-col sm:flex-row gap-5">

            {/* Avatar */}

            <div className="flex-shrink-0">

              {github.githubAvatarUrl ? (

                <img
                  src={github.githubAvatarUrl}
                  alt={
                    github.githubUsername
                      ? `${github.githubUsername} GitHub avatar`
                      : "GitHub avatar"
                  }
                  className="w-20 h-20 rounded-full border border-gray-700 object-cover"
                />

              ) : (

                <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700">

                  <FaGithub
                    size={34}
                    className="text-gray-400"
                  />

                </div>

              )}

            </div>


            {/* Details */}

            <div className="flex-1">

              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

                <div>

                  <div className="flex flex-wrap items-center gap-2">

                    <h4 className="text-white font-semibold">
                      GitHub Account
                    </h4>

                    {github.connected ? (

                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">

                        <FaCheckCircle size={10} />

                        Connected

                      </span>

                    ) : (

                      <span className="inline-flex rounded-full bg-gray-700 px-3 py-1 text-xs text-gray-400">

                        Not Connected

                      </span>

                    )}

                  </div>


                  <p className="text-gray-400 mt-2">

                    {github.connected
                      ? `@${github.githubUsername}`
                      : "No GitHub account connected."}

                  </p>


                  {github.connected && (

                    <p className="text-xs text-gray-500 mt-2">

                      Your GitHub account is connected
                      and ready for repository analysis.

                    </p>

                  )}

                </div>


                {/* Connect Button */}

                {!github.connected && (

                  <Button
                    variant="primary"
                    onClick={handleConnect}
                  >

                    <FaGithub className="mr-2" />

                    Connect GitHub

                  </Button>

                )}

              </div>


              {/* Connected Actions */}

              {github.connected && (

                <div className="flex flex-wrap gap-3 mt-6">

                  <Button
                    variant="secondary"
                    onClick={handleDisconnect}
                    loading={loading}
                    disabled={loading}
                    className="text-red-400 hover:text-red-300"
                  >

                    <FaUnlink className="mr-2" />

                    Disconnect

                  </Button>

                </div>

              )}

            </div>

          </div>

        </div>


        {/* Success */}

        {success && (

          <div className="mt-5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">

            {success}

          </div>

        )}


        {/* Error */}

        {error && (

          <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">

            {error}

          </div>

        )}

      </Card>


      {/* ======================================
          Upcoming Integrations
      ======================================= */}

      <Card className="bg-[#111827] border border-gray-800 p-6">

        <h3 className="text-lg font-semibold text-white mb-5">

          Upcoming Integrations

        </h3>


        <div className="space-y-3">

          {/* GitLab */}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border border-gray-800 rounded-xl p-4">

            <div>

              <p className="text-white font-medium">
                GitLab
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Analyze repositories hosted on GitLab.
              </p>

            </div>

            <span className="self-start sm:self-auto text-xs text-yellow-400 bg-yellow-500/10 px-3 py-1 rounded-full">

              Coming Soon

            </span>

          </div>


          {/* Bitbucket */}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border border-gray-800 rounded-xl p-4">

            <div>

              <p className="text-white font-medium">
                Bitbucket
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Connect Bitbucket repositories.
              </p>

            </div>

            <span className="self-start sm:self-auto text-xs text-yellow-400 bg-yellow-500/10 px-3 py-1 rounded-full">

              Coming Soon

            </span>

          </div>

        </div>

      </Card>

    </div>

  );

};

export default IntegrationSettings;