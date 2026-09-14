// // import React, {
// //   useContext,
// //   useEffect,
// //   useState
// // } from "react";

// // import { useNavigate } from "react-router-dom";

// // import {
// //   FaCode,
// //   FaLeaf,
// //   FaBolt,
// //   FaCloud,
// //   FaGithub,
// //   FaChartLine,
// //   FaFileAlt,
// //   FaPlus,
// //   FaArrowRight
// // } from "react-icons/fa";

// // import StatsCard from "../../components/cards/StatsCard";
// // import CarbonChart from "../../components/charts/CarbonCharts";
// // import EnergyChart from "../../components/charts/EnergyCharts";
// // import RepoCard from "../../components/cards/RepoCard";
// // import Card from "../../components/common/Card";
// // import Button from "../../components/common/Button";
// // import Loader from "../../components/common/Loader";
// // import Footer from "../../components/layout/Footer";

// // import dashboardService from "../../services/dashboardService";
// // import { AuthContext } from "../../context/AuthContext";


// // const Dashboard = () => {
// //   const { user } = useContext(AuthContext);
// //   const navigate = useNavigate();

// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState("");

// //   const [dashboardData, setDashboardData] = useState({
// //     totalRepositories: 0,
// //     totalAnalyses: 0,
// //     totalReports: 0,
// //     averageCarbon: 0,
// //     averageSustainability: 0,
// //     averageEnergyConsumptionWh: 0,

// //     energyDistribution: {
// //       ci: 0,
// //       storage: 0,
// //       network: 0
// //     },

// //     recentRepositories: []
// //   });


// //   useEffect(() => {
// //     fetchDashboardData();
// //   }, []);


// //   const fetchDashboardData = async () => {
// //     try {
// //       setLoading(true);
// //       setError("");

// //       const data =
// //         await dashboardService.getDashboard();

// //       setDashboardData({
// //         totalRepositories:
// //           Number(data?.totalRepositories) || 0,

// //         totalAnalyses:
// //           Number(data?.totalAnalyses) || 0,

// //         totalReports:
// //           Number(data?.totalReports) || 0,

// //         averageCarbon:
// //           Number(data?.averageCarbon) || 0,

// //         averageSustainability:
// //           Number(
// //             data?.averageSustainability
// //           ) || 0,

// //         averageEnergyConsumptionWh:
// //           Number(
// //             data?.averageEnergyConsumptionWh
// //           ) || 0,

// //         energyDistribution: {
// //           ci:
// //             Number(
// //               data?.energyDistribution?.ci
// //             ) || 0,

// //           storage:
// //             Number(
// //               data?.energyDistribution?.storage
// //             ) || 0,

// //           network:
// //             Number(
// //               data?.energyDistribution?.network
// //             ) || 0
// //         },

// //         recentRepositories:
// //           Array.isArray(
// //             data?.recentRepositories
// //           )
// //             ? data.recentRepositories
// //             : []
// //       });

// //     } catch (err) {
// //       console.error(
// //         "Dashboard fetch error:",
// //         err
// //       );

// //       setError(
// //         err.response?.data?.message ||
// //         "Failed to load dashboard data. Please try again."
// //       );

// //       if (
// //         err.response?.status === 401
// //       ) {
// //         navigate("/login");
// //       }

// //     } finally {
// //       setLoading(false);
// //     }
// //   };


// //   const hasRepositories =
// //     dashboardData.totalRepositories > 0;

// //   const hasAnalysis =
// //     dashboardData.totalAnalyses > 0;

// //   const hasEnergyData =
// //     dashboardData.energyDistribution.ci > 0 ||
// //     dashboardData.energyDistribution.storage > 0 ||
// //     dashboardData.energyDistribution.network > 0;


// //   /*
// //    * Repository names for the CO₂ chart.
// //    *
// //    * Repository data comes directly from backend,
// //    * so use repositoryName and carbonEmission.
// //    */
// //   const carbonChartData = {
// //     labels:
// //       dashboardData.recentRepositories.map(
// //         (repo) =>
// //           repo.repositoryName ||
// //           repo.name ||
// //           "Repository"
// //       ),

// //     datasets: [
// //       {
// //         label: "CO₂ Emission (gCO₂e)",

// //         data:
// //           dashboardData.recentRepositories.map(
// //             (repo) =>
// //               Number(
// //                 repo.carbonEmission
// //               ) || 0
// //           )
// //       }
// //     ]
// //   };


// //   const energyChartData = {
// //     labels: [
// //       "CI/CD",
// //       "Storage",
// //       "Dependencies / Network"
// //     ],

// //     datasets: [
// //       {
// //         data: [
// //           dashboardData.energyDistribution.ci,
// //           dashboardData.energyDistribution.storage,
// //           dashboardData.energyDistribution.network
// //         ]
// //       }
// //     ]
// //   };


// //   const handleAnalyze = (
// //     repositoryName
// //   ) => {
// //     navigate(
// //       `/repository?search=${encodeURIComponent(
// //         repositoryName
// //       )}`
// //     );
// //   };


// //   if (loading) {
// //     return (
// //       <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
// //         <Loader size="lg" />

// //         <p className="text-gray-400 mt-4 text-sm">
// //           Loading your dashboard...
// //         </p>
// //       </div>
// //     );
// //   }


// //   if (error) {
// //     return (
// //       <div className="min-h-[70vh] flex items-center justify-center px-4">
// //         <Card className="w-full max-w-md text-center bg-[#111827] border border-gray-800">
// //           <div className="p-8">

// //             <div className="w-14 h-14 mx-auto rounded-2xl bg-red-500/10 flex items-center justify-center">
// //               <FaCloud className="text-red-400 text-xl" />
// //             </div>

// //             <h2 className="text-white text-lg font-semibold mt-5">
// //               Unable to load dashboard
// //             </h2>

// //             <p className="text-gray-500 text-sm mt-2">
// //               {error}
// //             </p>

// //             <Button
// //               variant="primary"
// //               onClick={fetchDashboardData}
// //               className="mt-5"
// //             >
// //               Try Again
// //             </Button>

// //           </div>
// //         </Card>
// //       </div>
// //     );
// //   }


// //   return (
// //     <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">


// //       {/* =====================================
// //           HEADER
// //       ====================================== */}

// //       <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

// //         <div className="min-w-0">

// //           <p className="text-emerald-400 text-sm font-medium mb-2">
// //             Green Software Dashboard
// //           </p>

// //           <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
// //             Welcome back, {user?.name || "Developer"}! 👋
// //           </h1>

// //           <p className="text-gray-400 mt-2 text-sm sm:text-base max-w-2xl">
// //             Monitor the estimated environmental impact
// //             of your GitHub repositories in one place.
// //           </p>

// //         </div>


// //         <Button
// //           variant="primary"
// //           onClick={() =>
// //             navigate("/repository")
// //           }
// //           className="w-full sm:w-auto flex items-center justify-center gap-2"
// //         >
// //           <FaGithub />
// //           Analyze Repository
// //         </Button>

// //       </div>


// //       {/* =====================================
// //           EMPTY STATE
// //       ====================================== */}

// //       {!hasRepositories && (

// //         <Card className="mb-8 bg-[#111827] border border-emerald-500/20 overflow-hidden">

// //           <div className="p-6 sm:p-8 lg:p-10">

// //             <div className="max-w-3xl mx-auto text-center">

// //               <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
// //                 <FaGithub className="text-emerald-400 text-3xl sm:text-4xl" />
// //               </div>

// //               <h2 className="text-xl sm:text-2xl font-bold text-white mt-5">
// //                 Your sustainability dashboard is ready
// //               </h2>

// //               <p className="text-gray-400 mt-3 text-sm sm:text-base">
// //                 Connect your first GitHub repository to
// //                 start measuring its estimated carbon
// //                 emissions, energy consumption and
// //                 sustainability score.
// //               </p>


// //               <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-7 text-left">

// //                 <div className="p-4 rounded-xl bg-[#0b1220] border border-gray-800">
// //                   <FaCloud className="text-emerald-400 mb-3" />

// //                   <p className="text-white text-sm font-medium">
// //                     CO₂ Emissions
// //                   </p>

// //                   <p className="text-gray-500 text-xs mt-1">
// //                     Estimate repository carbon impact
// //                   </p>
// //                 </div>


// //                 <div className="p-4 rounded-xl bg-[#0b1220] border border-gray-800">
// //                   <FaBolt className="text-amber-400 mb-3" />

// //                   <p className="text-white text-sm font-medium">
// //                     Energy Usage
// //                   </p>

// //                   <p className="text-gray-500 text-xs mt-1">
// //                     Understand energy consumption
// //                   </p>
// //                 </div>


// //                 <div className="p-4 rounded-xl bg-[#0b1220] border border-gray-800">
// //                   <FaLeaf className="text-cyan-400 mb-3" />

// //                   <p className="text-white text-sm font-medium">
// //                     Sustainability
// //                   </p>

// //                   <p className="text-gray-500 text-xs mt-1">
// //                     Track your sustainability score
// //                   </p>
// //                 </div>

// //               </div>


// //               <Button
// //                 variant="primary"
// //                 onClick={() =>
// //                   navigate("/repository")
// //                 }
// //                 className="mt-7 flex items-center justify-center gap-2 mx-auto"
// //               >
// //                 <FaPlus />
// //                 Add Your First Repository
// //               </Button>

// //             </div>

// //           </div>

// //         </Card>

// //       )}


// //       {/* =====================================
// //           STATS
// //       ====================================== */}

// //       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">

// //         <StatsCard
// //           title="Repositories"
// //           value={
// //             dashboardData.totalRepositories
// //           }
// //           icon={FaCode}
// //           subtitle="Connected repositories"
// //           color="primary"
// //         />


// //         <StatsCard
// //           title="Average CO₂ Emission"
// //           value={`${dashboardData.averageCarbon.toFixed(2)} gCO₂e`}
// //           icon={FaCloud}
// //           subtitle={
// //             hasAnalysis
// //               ? "Estimated per analysis"
// //               : "No analysis yet"
// //           }
// //           color="success"
// //         />


// //         <StatsCard
// //           title="Average Energy"
// //           value={`${dashboardData.averageEnergyConsumptionWh.toFixed(2)} Wh`}
// //           icon={FaBolt}
// //           subtitle={
// //             hasAnalysis
// //               ? "Estimated per analysis"
// //               : "No analysis yet"
// //           }
// //           color="warning"
// //         />


// //         <StatsCard
// //           title="Sustainability"
// //           value={`${dashboardData.averageSustainability}%`}
// //           icon={FaLeaf}
// //           subtitle={
// //             !hasAnalysis
// //               ? "No analysis yet"
// //               : dashboardData.averageSustainability >= 80
// //               ? "Excellent"
// //               : dashboardData.averageSustainability >= 60
// //               ? "Good"
// //               : "Needs improvement"
// //           }
// //           color="info"
// //         />

// //       </div>


// //       {/* =====================================
// //           ANALYSIS OVERVIEW
// //       ====================================== */}

// //       <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">


// //         {/* CO₂ */}

// //         <div className="xl:col-span-2">

// //           <Card className="h-full bg-[#111827] border border-gray-800">

// //             <div className="mb-4">

// //               <h2 className="text-lg sm:text-xl font-semibold text-white">
// //                 CO₂ Emission by Repository
// //               </h2>

// //               <p className="text-xs sm:text-sm text-gray-500 mt-1">
// //                 Compare the estimated carbon impact
// //                 of your repositories.
// //               </p>

// //             </div>


// //             {hasAnalysis ? (

// //               <CarbonChart
// //                 data={carbonChartData}
// //               />

// //             ) : (

// //               <div className="h-[280px] sm:h-[320px] flex items-center justify-center text-center">

// //                 <div className="max-w-sm px-4">

// //                   <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto">
// //                     <FaChartLine className="text-emerald-400 text-xl" />
// //                   </div>

// //                   <p className="text-white font-medium mt-4">
// //                     No CO₂ analysis available yet
// //                   </p>

// //                   <p className="text-gray-500 text-sm mt-2">
// //                     Analyze a repository to compare
// //                     its estimated carbon impact here.
// //                   </p>

// //                 </div>

// //               </div>

// //             )}

// //           </Card>

// //         </div>


// //         {/* ENERGY */}

// //         <div>

// //           <Card className="h-full bg-[#111827] border border-gray-800">

// //             <div className="mb-4">

// //               <h2 className="text-lg sm:text-xl font-semibold text-white">
// //                 Energy Breakdown
// //               </h2>

// //               <p className="text-xs sm:text-sm text-gray-500 mt-1">
// //                 Estimated energy consumption by component.
// //               </p>

// //             </div>


// //             {hasEnergyData ? (

// //               <EnergyChart
// //                 data={energyChartData}
// //               />

// //             ) : (

// //               <div className="h-[280px] sm:h-[320px] flex items-center justify-center text-center">

// //                 <div className="max-w-sm px-4">

// //                   <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto">
// //                     <FaBolt className="text-amber-400 text-xl" />
// //                   </div>

// //                   <p className="text-white font-medium mt-4">
// //                     No energy data yet
// //                   </p>

// //                   <p className="text-gray-500 text-sm mt-2">
// //                     Analyze a repository to see where
// //                     estimated energy consumption comes from.
// //                   </p>

// //                 </div>

// //               </div>

// //             )}

// //           </Card>

// //         </div>

// //       </div>


// //       {/* =====================================
// //           RECENT REPOSITORIES
// //       ====================================== */}

// //       {hasRepositories && (

// //         <div className="mb-8">

// //           <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">

// //             <div>

// //               <p className="text-emerald-400 text-xs font-medium uppercase tracking-wider">
// //                 Portfolio
// //               </p>

// //               <h2 className="text-xl sm:text-2xl font-semibold text-white mt-1">
// //                 Recent Repositories
// //               </h2>

// //               <p className="text-sm text-gray-500 mt-1">
// //                 Your recently connected repositories.
// //               </p>

// //             </div>


// //             <Button
// //               variant="outline"
// //               size="sm"
// //               onClick={() =>
// //                 navigate("/repository")
// //               }
// //               className="w-full sm:w-auto flex items-center justify-center gap-2"
// //             >
// //               View All
// //               <FaArrowRight />
// //             </Button>

// //           </div>


// //           <div className="space-y-4">

// //             {dashboardData.recentRepositories.map(
// //               (repo, index) => (

// //                 <RepoCard
// //                   key={
// //                     repo._id ||
// //                     repo.id ||
// //                     index
// //                   }

// //                   name={
// //                     repo.repositoryName ||
// //                     repo.name ||
// //                     "Unnamed Repository"
// //                   }

// //                   description={
// //                     repo.description ||
// //                     `Repository by ${
// //                       repo.owner ||
// //                       "Unknown owner"
// //                     }`
// //                   }

// //                   stars={
// //                     repo.stars || 0
// //                   }

// //                   forks={
// //                     repo.forks || 0
// //                   }

// //                   issues={
// //                     repo.issues || 0
// //                   }

// //                   updatedAt={
// //                     repo.lastAnalyzed
// //                       ? new Date(
// //                           repo.lastAnalyzed
// //                         ).toLocaleDateString()
// //                       : "Not analyzed"
// //                   }

// //                   language={
// //                     repo.language ||
// //                     "Unknown"
// //                   }

// //                   languageColor="#10B981"

// //                   onAnalyze={() =>
// //                     handleAnalyze(
// //                       repo.repositoryName ||
// //                       repo.name
// //                     )
// //                   }
// //                 />

// //               )
// //             )}

// //           </div>

// //         </div>

// //       )}


// //       {/* =====================================
// //           QUICK ACTIONS
// //       ====================================== */}

// //       <div className="mb-8">

// //         <div className="mb-4">

// //           <p className="text-emerald-400 text-xs font-medium uppercase tracking-wider">
// //             Get Started
// //           </p>

// //           <h2 className="text-xl sm:text-2xl font-semibold text-white mt-1">
// //             Quick Actions
// //           </h2>

// //           <p className="text-sm text-gray-500 mt-1">
// //             Quickly access the main CarbonWise workflows.
// //           </p>

// //         </div>


// //         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


// //           {/* Analysis */}

// //           <Card className="bg-[#111827] border border-gray-800 hover:border-emerald-500/30 transition-all duration-300">

// //             <div className="flex flex-col sm:flex-row sm:items-start gap-4">

// //               <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-emerald-500/10 flex items-center justify-center">
// //                 <FaLeaf className="text-emerald-400 text-xl" />
// //               </div>


// //               <div className="flex-1">

// //                 <h3 className="text-white font-semibold">
// //                   Carbon Analysis
// //                 </h3>

// //                 <p className="text-sm text-gray-500 mt-1 mb-4">
// //                   Measure the estimated environmental
// //                   impact of your GitHub repositories.
// //                 </p>

// //                 <Button
// //                   variant="primary"
// //                   size="sm"
// //                   onClick={() =>
// //                     navigate("/repository")
// //                   }
// //                   className="flex items-center gap-2"
// //                 >
// //                   Start Analysis
// //                   <FaArrowRight />
// //                 </Button>

// //               </div>

// //             </div>

// //           </Card>


// //           {/* Reports */}

// //           <Card className="bg-[#111827] border border-gray-800 hover:border-purple-500/30 transition-all duration-300">

// //             <div className="flex flex-col sm:flex-row sm:items-start gap-4">

// //               <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-purple-500/10 flex items-center justify-center">
// //                 <FaFileAlt className="text-purple-400 text-xl" />
// //               </div>


// //               <div className="flex-1">

// //                 <h3 className="text-white font-semibold">
// //                   Sustainability Reports
// //                 </h3>

// //                 <p className="text-sm text-gray-500 mt-1 mb-4">
// //                   View and download your generated
// //                   sustainability reports.
// //                 </p>

// //                 <Button
// //                   variant="secondary"
// //                   size="sm"
// //                   onClick={() =>
// //                     navigate("/reports")
// //                   }
// //                   className="flex items-center gap-2"
// //                 >
// //                   View Reports
// //                   <FaArrowRight />
// //                 </Button>

// //               </div>

// //             </div>

// //           </Card>

// //         </div>

// //       </div>


// //       <Footer />

// //     </div>
// //   );
// // };


// // export default Dashboard;

// import React, {
//   useContext,
//   useEffect,
//   useState
// } from "react";

// import { useNavigate } from "react-router-dom";

// import {
//   FaCode,
//   FaLeaf,
//   FaBolt,
//   FaCloud,
//   FaGithub,
//   FaChartLine,
//   FaFileAlt,
//   FaPlus,
//   FaArrowRight
// } from "react-icons/fa";

// import StatsCard from "../../components/Cards/StatsCard";
// import CarbonChart from "../../components/charts/CarbonCharts";
// import EnergyChart from "../../components/charts/EnergyCharts";
// import RepoCard from "../../components/cards/RepoCard";
// import Card from "../../components/common/Card";
// import Button from "../../components/common/Button";
// import Loader from "../../components/common/Loader";
// import Footer from "../../components/layout/Footer";

// import dashboardService from "../../services/dashboardService";
// import { AuthContext } from "../../context/AuthContext";
// import { ThemeContext } from "../../context/ThemeContext";


// const Dashboard = () => {
//   const { user } = useContext(AuthContext);
//   const { formatCarbon } = useContext(ThemeContext);
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [dashboardData, setDashboardData] = useState({
//     totalRepositories: 0,
//     totalAnalyses: 0,
//     totalReports: 0,
//     averageCarbon: 0,
//     averageSustainability: 0,
//     averageEnergyConsumptionWh: 0,

//     energyDistribution: {
//       ci: 0,
//       storage: 0,
//       network: 0
//     },

//     recentRepositories: []
//   });


//   useEffect(() => {
//     fetchDashboardData();
//   }, []);


//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const data =
//         await dashboardService.getDashboard();

//       setDashboardData({
//         totalRepositories:
//           Number(data?.totalRepositories) || 0,

//         totalAnalyses:
//           Number(data?.totalAnalyses) || 0,

//         totalReports:
//           Number(data?.totalReports) || 0,

//         averageCarbon:
//           Number(data?.averageCarbon) || 0,

//         averageSustainability:
//           Number(
//             data?.averageSustainability
//           ) || 0,

//         averageEnergyConsumptionWh:
//           Number(
//             data?.averageEnergyConsumptionWh
//           ) || 0,

//         energyDistribution: {
//           ci:
//             Number(
//               data?.energyDistribution?.ci
//             ) || 0,

//           storage:
//             Number(
//               data?.energyDistribution?.storage
//             ) || 0,

//           network:
//             Number(
//               data?.energyDistribution?.network
//             ) || 0
//         },

//         recentRepositories:
//           Array.isArray(
//             data?.recentRepositories
//           )
//             ? data.recentRepositories
//             : []
//       });

//     } catch (err) {
//       console.error(
//         "Dashboard fetch error:",
//         err
//       );

//       setError(
//         err.response?.data?.message ||
//         "Failed to load dashboard data. Please try again."
//       );

//       if (
//         err.response?.status === 401
//       ) {
//         navigate("/login");
//       }

//     } finally {
//       setLoading(false);
//     }
//   };


//   const hasRepositories =
//     dashboardData.totalRepositories > 0;

//   const hasAnalysis =
//     dashboardData.totalAnalyses > 0;

//   const hasEnergyData =
//     dashboardData.energyDistribution.ci > 0 ||
//     dashboardData.energyDistribution.storage > 0 ||
//     dashboardData.energyDistribution.network > 0;


//   /*
//    * Repository names for the CO₂ chart.
//    *
//    * Repository data comes directly from backend,
//    * so use repositoryName and carbonEmission.
//    */
//   const carbonChartData = {
//     labels:
//       dashboardData.recentRepositories.map(
//         (repo) =>
//           repo.repositoryName ||
//           repo.name ||
//           "Repository"
//       ),

//     datasets: [
//       {
//         label: "CO₂ Emission (gCO₂e)",

//         data:
//           dashboardData.recentRepositories.map(
//             (repo) =>
//               Number(
//                 repo.carbonEmission
//               ) || 0
//           )
//       }
//     ]
//   };


//   const energyChartData = {
//     labels: [
//       "CI/CD",
//       "Storage",
//       "Dependencies / Network"
//     ],

//     datasets: [
//       {
//         data: [
//           dashboardData.energyDistribution.ci,
//           dashboardData.energyDistribution.storage,
//           dashboardData.energyDistribution.network
//         ]
//       }
//     ]
//   };


//   const handleAnalyze = (
//     repositoryName
//   ) => {
//     navigate(
//       `/repository?search=${encodeURIComponent(
//         repositoryName
//       )}`
//     );
//   };


//   if (loading) {
//     return (
//       <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
//         <Loader size="lg" />

//         <p className="text-gray-400 mt-4 text-sm">
//           Loading your dashboard...
//         </p>
//       </div>
//     );
//   }


//   if (error) {
//     return (
//       <div className="min-h-[70vh] flex items-center justify-center px-4">
//         <Card className="w-full max-w-md text-center bg-[#111827] border border-gray-800">
//           <div className="p-8">

//             <div className="w-14 h-14 mx-auto rounded-2xl bg-red-500/10 flex items-center justify-center">
//               <FaCloud className="text-red-400 text-xl" />
//             </div>

//             <h2 className="text-white text-lg font-semibold mt-5">
//               Unable to load dashboard
//             </h2>

//             <p className="text-gray-500 text-sm mt-2">
//               {error}
//             </p>

//             <Button
//               variant="primary"
//               onClick={fetchDashboardData}
//               className="mt-5"
//             >
//               Try Again
//             </Button>

//           </div>
//         </Card>
//       </div>
//     );
//   }


//   return (
//     <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">


//       {/* =====================================
//           HEADER
//       ====================================== */}

//       <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

//         <div className="min-w-0">

//           <p className="text-emerald-400 text-sm font-medium mb-2">
//             Green Software Dashboard
//           </p>

//           <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
//             Welcome back, {user?.name || "Developer"}! 👋
//           </h1>

//           <p className="text-gray-400 mt-2 text-sm sm:text-base max-w-2xl">
//             Monitor the estimated environmental impact
//             of your GitHub repositories in one place.
//           </p>

//         </div>


//         <Button
//           variant="primary"
//           onClick={() =>
//             navigate("/repository")
//           }
//           className="w-full sm:w-auto flex items-center justify-center gap-2"
//         >
//           <FaGithub />
//           Analyze Repository
//         </Button>

//       </div>


//       {/* =====================================
//           EMPTY STATE
//       ====================================== */}

//       {!hasRepositories && (

//         <Card className="mb-8 bg-[#111827] border border-emerald-500/20 overflow-hidden">

//           <div className="p-6 sm:p-8 lg:p-10">

//             <div className="max-w-3xl mx-auto text-center">

//               <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
//                 <FaGithub className="text-emerald-400 text-3xl sm:text-4xl" />
//               </div>

//               <h2 className="text-xl sm:text-2xl font-bold text-white mt-5">
//                 Your sustainability dashboard is ready
//               </h2>

//               <p className="text-gray-400 mt-3 text-sm sm:text-base">
//                 Connect your first GitHub repository to
//                 start measuring its estimated carbon
//                 emissions, energy consumption and
//                 sustainability score.
//               </p>


//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-7 text-left">

//                 <div className="p-4 rounded-xl bg-[#0b1220] border border-gray-800">
//                   <FaCloud className="text-emerald-400 mb-3" />

//                   <p className="text-white text-sm font-medium">
//                     CO₂ Emissions
//                   </p>

//                   <p className="text-gray-500 text-xs mt-1">
//                     Estimate repository carbon impact
//                   </p>
//                 </div>


//                 <div className="p-4 rounded-xl bg-[#0b1220] border border-gray-800">
//                   <FaBolt className="text-amber-400 mb-3" />

//                   <p className="text-white text-sm font-medium">
//                     Energy Usage
//                   </p>

//                   <p className="text-gray-500 text-xs mt-1">
//                     Understand energy consumption
//                   </p>
//                 </div>


//                 <div className="p-4 rounded-xl bg-[#0b1220] border border-gray-800">
//                   <FaLeaf className="text-cyan-400 mb-3" />

//                   <p className="text-white text-sm font-medium">
//                     Sustainability
//                   </p>

//                   <p className="text-gray-500 text-xs mt-1">
//                     Track your sustainability score
//                   </p>
//                 </div>

//               </div>


//               <Button
//                 variant="primary"
//                 onClick={() =>
//                   navigate("/repository")
//                 }
//                 className="mt-7 flex items-center justify-center gap-2 mx-auto"
//               >
//                 <FaPlus />
//                 Add Your First Repository
//               </Button>

//             </div>

//           </div>

//         </Card>

//       )}


//       {/* =====================================
//           STATS
//       ====================================== */}

//       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">

//         <StatsCard
//           title="Repositories"
//           value={
//             dashboardData.totalRepositories
//           }
//           icon={FaCode}
//           subtitle="Connected repositories"
//           color="primary"
//         />


//         <StatsCard
//           title="Average CO₂ Emission"
//           value={formatCarbon(dashboardData.averageCarbon)}
//           icon={FaCloud}
//           subtitle={
//             hasAnalysis
//               ? "Estimated per analysis"
//               : "No analysis yet"
//           }
//           color="success"
//         />


//         <StatsCard
//           title="Average Energy"
//           value={`${dashboardData.averageEnergyConsumptionWh.toFixed(2)} Wh`}
//           icon={FaBolt}
//           subtitle={
//             hasAnalysis
//               ? "Estimated per analysis"
//               : "No analysis yet"
//           }
//           color="warning"
//         />


//         <StatsCard
//           title="Sustainability"
//           value={`${dashboardData.averageSustainability}%`}
//           icon={FaLeaf}
//           subtitle={
//             !hasAnalysis
//               ? "No analysis yet"
//               : dashboardData.averageSustainability >= 80
//               ? "Excellent"
//               : dashboardData.averageSustainability >= 60
//               ? "Good"
//               : "Needs improvement"
//           }
//           color="info"
//         />

//       </div>


//       {/* =====================================
//           ANALYSIS OVERVIEW
//       ====================================== */}

//       <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">


//         {/* CO₂ */}

//         <div className="xl:col-span-2">

//           <Card className="h-full bg-[#111827] border border-gray-800">

//             <div className="mb-4">

//               <h2 className="text-lg sm:text-xl font-semibold text-white">
//                 CO₂ Emission by Repository
//               </h2>

//               <p className="text-xs sm:text-sm text-gray-500 mt-1">
//                 Compare the estimated carbon impact
//                 of your repositories.
//               </p>

//             </div>


//             {hasAnalysis ? (

//               <CarbonChart
//                 data={carbonChartData}
//               />

//             ) : (

//               <div className="h-[280px] sm:h-[320px] flex items-center justify-center text-center">

//                 <div className="max-w-sm px-4">

//                   <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto">
//                     <FaChartLine className="text-emerald-400 text-xl" />
//                   </div>

//                   <p className="text-white font-medium mt-4">
//                     No CO₂ analysis available yet
//                   </p>

//                   <p className="text-gray-500 text-sm mt-2">
//                     Analyze a repository to compare
//                     its estimated carbon impact here.
//                   </p>

//                 </div>

//               </div>

//             )}

//           </Card>

//         </div>


//         {/* ENERGY */}

//         <div>

//           <Card className="h-full bg-[#111827] border border-gray-800">

//             <div className="mb-4">

//               <h2 className="text-lg sm:text-xl font-semibold text-white">
//                 Energy Breakdown
//               </h2>

//               <p className="text-xs sm:text-sm text-gray-500 mt-1">
//                 Estimated energy consumption by component.
//               </p>

//             </div>


//             {hasEnergyData ? (

//               <EnergyChart
//                 data={energyChartData}
//               />

//             ) : (

//               <div className="h-[280px] sm:h-[320px] flex items-center justify-center text-center">

//                 <div className="max-w-sm px-4">

//                   <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto">
//                     <FaBolt className="text-amber-400 text-xl" />
//                   </div>

//                   <p className="text-white font-medium mt-4">
//                     No energy data yet
//                   </p>

//                   <p className="text-gray-500 text-sm mt-2">
//                     Analyze a repository to see where
//                     estimated energy consumption comes from.
//                   </p>

//                 </div>

//               </div>

//             )}

//           </Card>

//         </div>

//       </div>


//       {/* =====================================
//           RECENT REPOSITORIES
//       ====================================== */}

//       {hasRepositories && (

//         <div className="mb-8">

//           <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">

//             <div>

//               <p className="text-emerald-400 text-xs font-medium uppercase tracking-wider">
//                 Portfolio
//               </p>

//               <h2 className="text-xl sm:text-2xl font-semibold text-white mt-1">
//                 Recent Repositories
//               </h2>

//               <p className="text-sm text-gray-500 mt-1">
//                 Your recently connected repositories.
//               </p>

//             </div>


//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() =>
//                 navigate("/repository")
//               }
//               className="w-full sm:w-auto flex items-center justify-center gap-2"
//             >
//               View All
//               <FaArrowRight />
//             </Button>

//           </div>


//           <div className="space-y-4">

//             {dashboardData.recentRepositories.map(
//               (repo, index) => (

//                 <RepoCard
//                   key={
//                     repo._id ||
//                     repo.id ||
//                     index
//                   }

//                   name={
//                     repo.repositoryName ||
//                     repo.name ||
//                     "Unnamed Repository"
//                   }

//                   description={
//                     repo.description ||
//                     `Repository by ${
//                       repo.owner ||
//                       "Unknown owner"
//                     }`
//                   }

//                   stars={
//                     repo.stars || 0
//                   }

//                   forks={
//                     repo.forks || 0
//                   }

//                   issues={
//                     repo.issues || 0
//                   }

//                   updatedAt={
//                     repo.lastAnalyzed
//                       ? new Date(
//                           repo.lastAnalyzed
//                         ).toLocaleDateString()
//                       : "Not analyzed"
//                   }

//                   language={
//                     repo.language ||
//                     "Unknown"
//                   }

//                   languageColor="#10B981"

//                   onAnalyze={() =>
//                     handleAnalyze(
//                       repo.repositoryName ||
//                       repo.name
//                     )
//                   }
//                 />

//               )
//             )}

//           </div>

//         </div>

//       )}


//       {/* =====================================
//           QUICK ACTIONS
//       ====================================== */}

//       <div className="mb-8">

//         <div className="mb-4">

//           <p className="text-emerald-400 text-xs font-medium uppercase tracking-wider">
//             Get Started
//           </p>

//           <h2 className="text-xl sm:text-2xl font-semibold text-white mt-1">
//             Quick Actions
//           </h2>

//           <p className="text-sm text-gray-500 mt-1">
//             Quickly access the main CarbonWise workflows.
//           </p>

//         </div>


//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


//           {/* Analysis */}

//           <Card className="bg-[#111827] border border-gray-800 hover:border-emerald-500/30 transition-all duration-300">

//             <div className="flex flex-col sm:flex-row sm:items-start gap-4">

//               <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-emerald-500/10 flex items-center justify-center">
//                 <FaLeaf className="text-emerald-400 text-xl" />
//               </div>


//               <div className="flex-1">

//                 <h3 className="text-white font-semibold">
//                   Carbon Analysis
//                 </h3>

//                 <p className="text-sm text-gray-500 mt-1 mb-4">
//                   Measure the estimated environmental
//                   impact of your GitHub repositories.
//                 </p>

//                 <Button
//                   variant="primary"
//                   size="sm"
//                   onClick={() =>
//                     navigate("/repository")
//                   }
//                   className="flex items-center gap-2"
//                 >
//                   Start Analysis
//                   <FaArrowRight />
//                 </Button>

//               </div>

//             </div>

//           </Card>


//           {/* Reports */}

//           <Card className="bg-[#111827] border border-gray-800 hover:border-purple-500/30 transition-all duration-300">

//             <div className="flex flex-col sm:flex-row sm:items-start gap-4">

//               <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-purple-500/10 flex items-center justify-center">
//                 <FaFileAlt className="text-purple-400 text-xl" />
//               </div>


//               <div className="flex-1">

//                 <h3 className="text-white font-semibold">
//                   Sustainability Reports
//                 </h3>

//                 <p className="text-sm text-gray-500 mt-1 mb-4">
//                   View and download your generated
//                   sustainability reports.
//                 </p>

//                 <Button
//                   variant="secondary"
//                   size="sm"
//                   onClick={() =>
//                     navigate("/reports")
//                   }
//                   className="flex items-center gap-2"
//                 >
//                   View Reports
//                   <FaArrowRight />
//                 </Button>

//               </div>

//             </div>

//           </Card>

//         </div>

//       </div>


//       <Footer />

//     </div>
//   );
// };


// export default Dashboard;
// import React, {
//   useContext,
//   useEffect,
//   useState
// } from "react";

// import { useNavigate } from "react-router-dom";

// import {
//   FaCode,
//   FaLeaf,
//   FaBolt,
//   FaCloud,
//   FaGithub,
//   FaChartLine,
//   FaFileAlt,
//   FaPlus,
//   FaArrowRight
// } from "react-icons/fa";

// import StatsCard from "../../components/cards/StatsCard";
// import CarbonChart from "../../components/charts/CarbonCharts";
// import EnergyChart from "../../components/charts/EnergyCharts";
// import RepoCard from "../../components/cards/RepoCard";
// import Card from "../../components/common/Card";
// import Button from "../../components/common/Button";
// import Loader from "../../components/common/Loader";
// import Footer from "../../components/layout/Footer";

// import dashboardService from "../../services/dashboardService";
// import { AuthContext } from "../../context/AuthContext";


// const Dashboard = () => {
//   const { user } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [dashboardData, setDashboardData] = useState({
//     totalRepositories: 0,
//     totalAnalyses: 0,
//     totalReports: 0,
//     averageCarbon: 0,
//     averageSustainability: 0,
//     averageEnergyConsumptionWh: 0,

//     energyDistribution: {
//       ci: 0,
//       storage: 0,
//       network: 0
//     },

//     recentRepositories: []
//   });


//   useEffect(() => {
//     fetchDashboardData();
//   }, []);


//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const data =
//         await dashboardService.getDashboard();

//       setDashboardData({
//         totalRepositories:
//           Number(data?.totalRepositories) || 0,

//         totalAnalyses:
//           Number(data?.totalAnalyses) || 0,

//         totalReports:
//           Number(data?.totalReports) || 0,

//         averageCarbon:
//           Number(data?.averageCarbon) || 0,

//         averageSustainability:
//           Number(
//             data?.averageSustainability
//           ) || 0,

//         averageEnergyConsumptionWh:
//           Number(
//             data?.averageEnergyConsumptionWh
//           ) || 0,

//         energyDistribution: {
//           ci:
//             Number(
//               data?.energyDistribution?.ci
//             ) || 0,

//           storage:
//             Number(
//               data?.energyDistribution?.storage
//             ) || 0,

//           network:
//             Number(
//               data?.energyDistribution?.network
//             ) || 0
//         },

//         recentRepositories:
//           Array.isArray(
//             data?.recentRepositories
//           )
//             ? data.recentRepositories
//             : []
//       });

//     } catch (err) {
//       console.error(
//         "Dashboard fetch error:",
//         err
//       );

//       setError(
//         err.response?.data?.message ||
//         "Failed to load dashboard data. Please try again."
//       );

//       if (
//         err.response?.status === 401
//       ) {
//         navigate("/login");
//       }

//     } finally {
//       setLoading(false);
//     }
//   };


//   const hasRepositories =
//     dashboardData.totalRepositories > 0;

//   const hasAnalysis =
//     dashboardData.totalAnalyses > 0;

//   const hasEnergyData =
//     dashboardData.energyDistribution.ci > 0 ||
//     dashboardData.energyDistribution.storage > 0 ||
//     dashboardData.energyDistribution.network > 0;


//   /*
//    * Repository names for the CO₂ chart.
//    *
//    * Repository data comes directly from backend,
//    * so use repositoryName and carbonEmission.
//    */
//   const carbonChartData = {
//     labels:
//       dashboardData.recentRepositories.map(
//         (repo) =>
//           repo.repositoryName ||
//           repo.name ||
//           "Repository"
//       ),

//     datasets: [
//       {
//         label: "CO₂ Emission (gCO₂e)",

//         data:
//           dashboardData.recentRepositories.map(
//             (repo) =>
//               Number(
//                 repo.carbonEmission
//               ) || 0
//           )
//       }
//     ]
//   };


//   const energyChartData = {
//     labels: [
//       "CI/CD",
//       "Storage",
//       "Dependencies / Network"
//     ],

//     datasets: [
//       {
//         data: [
//           dashboardData.energyDistribution.ci,
//           dashboardData.energyDistribution.storage,
//           dashboardData.energyDistribution.network
//         ]
//       }
//     ]
//   };


//   const handleAnalyze = (
//     repositoryName
//   ) => {
//     navigate(
//       `/repository?search=${encodeURIComponent(
//         repositoryName
//       )}`
//     );
//   };


//   if (loading) {
//     return (
//       <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
//         <Loader size="lg" />

//         <p className="text-gray-400 mt-4 text-sm">
//           Loading your dashboard...
//         </p>
//       </div>
//     );
//   }


//   if (error) {
//     return (
//       <div className="min-h-[70vh] flex items-center justify-center px-4">
//         <Card className="w-full max-w-md text-center bg-[#111827] border border-gray-800">
//           <div className="p-8">

//             <div className="w-14 h-14 mx-auto rounded-2xl bg-red-500/10 flex items-center justify-center">
//               <FaCloud className="text-red-400 text-xl" />
//             </div>

//             <h2 className="text-white text-lg font-semibold mt-5">
//               Unable to load dashboard
//             </h2>

//             <p className="text-gray-500 text-sm mt-2">
//               {error}
//             </p>

//             <Button
//               variant="primary"
//               onClick={fetchDashboardData}
//               className="mt-5"
//             >
//               Try Again
//             </Button>

//           </div>
//         </Card>
//       </div>
//     );
//   }


//   return (
//     <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">


//       {/* =====================================
//           HEADER
//       ====================================== */}

//       <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

//         <div className="min-w-0">

//           <p className="text-emerald-400 text-sm font-medium mb-2">
//             Green Software Dashboard
//           </p>

//           <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
//             Welcome back, {user?.name || "Developer"}! 👋
//           </h1>

//           <p className="text-gray-400 mt-2 text-sm sm:text-base max-w-2xl">
//             Monitor the estimated environmental impact
//             of your GitHub repositories in one place.
//           </p>

//         </div>


//         <Button
//           variant="primary"
//           onClick={() =>
//             navigate("/repository")
//           }
//           className="w-full sm:w-auto flex items-center justify-center gap-2"
//         >
//           <FaGithub />
//           Analyze Repository
//         </Button>

//       </div>


//       {/* =====================================
//           EMPTY STATE
//       ====================================== */}

//       {!hasRepositories && (

//         <Card className="mb-8 bg-[#111827] border border-emerald-500/20 overflow-hidden">

//           <div className="p-6 sm:p-8 lg:p-10">

//             <div className="max-w-3xl mx-auto text-center">

//               <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
//                 <FaGithub className="text-emerald-400 text-3xl sm:text-4xl" />
//               </div>

//               <h2 className="text-xl sm:text-2xl font-bold text-white mt-5">
//                 Your sustainability dashboard is ready
//               </h2>

//               <p className="text-gray-400 mt-3 text-sm sm:text-base">
//                 Connect your first GitHub repository to
//                 start measuring its estimated carbon
//                 emissions, energy consumption and
//                 sustainability score.
//               </p>


//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-7 text-left">

//                 <div className="p-4 rounded-xl bg-[#0b1220] border border-gray-800">
//                   <FaCloud className="text-emerald-400 mb-3" />

//                   <p className="text-white text-sm font-medium">
//                     CO₂ Emissions
//                   </p>

//                   <p className="text-gray-500 text-xs mt-1">
//                     Estimate repository carbon impact
//                   </p>
//                 </div>


//                 <div className="p-4 rounded-xl bg-[#0b1220] border border-gray-800">
//                   <FaBolt className="text-amber-400 mb-3" />

//                   <p className="text-white text-sm font-medium">
//                     Energy Usage
//                   </p>

//                   <p className="text-gray-500 text-xs mt-1">
//                     Understand energy consumption
//                   </p>
//                 </div>


//                 <div className="p-4 rounded-xl bg-[#0b1220] border border-gray-800">
//                   <FaLeaf className="text-cyan-400 mb-3" />

//                   <p className="text-white text-sm font-medium">
//                     Sustainability
//                   </p>

//                   <p className="text-gray-500 text-xs mt-1">
//                     Track your sustainability score
//                   </p>
//                 </div>

//               </div>


//               <Button
//                 variant="primary"
//                 onClick={() =>
//                   navigate("/repository")
//                 }
//                 className="mt-7 flex items-center justify-center gap-2 mx-auto"
//               >
//                 <FaPlus />
//                 Add Your First Repository
//               </Button>

//             </div>

//           </div>

//         </Card>

//       )}


//       {/* =====================================
//           STATS
//       ====================================== */}

//       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">

//         <StatsCard
//           title="Repositories"
//           value={
//             dashboardData.totalRepositories
//           }
//           icon={FaCode}
//           subtitle="Connected repositories"
//           color="primary"
//         />


//         <StatsCard
//           title="Average CO₂ Emission"
//           value={`${dashboardData.averageCarbon.toFixed(2)} gCO₂e`}
//           icon={FaCloud}
//           subtitle={
//             hasAnalysis
//               ? "Estimated per analysis"
//               : "No analysis yet"
//           }
//           color="success"
//         />


//         <StatsCard
//           title="Average Energy"
//           value={`${dashboardData.averageEnergyConsumptionWh.toFixed(2)} Wh`}
//           icon={FaBolt}
//           subtitle={
//             hasAnalysis
//               ? "Estimated per analysis"
//               : "No analysis yet"
//           }
//           color="warning"
//         />


//         <StatsCard
//           title="Sustainability"
//           value={`${dashboardData.averageSustainability}%`}
//           icon={FaLeaf}
//           subtitle={
//             !hasAnalysis
//               ? "No analysis yet"
//               : dashboardData.averageSustainability >= 80
//               ? "Excellent"
//               : dashboardData.averageSustainability >= 60
//               ? "Good"
//               : "Needs improvement"
//           }
//           color="info"
//         />

//       </div>


//       {/* =====================================
//           ANALYSIS OVERVIEW
//       ====================================== */}

//       <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">


//         {/* CO₂ */}

//         <div className="xl:col-span-2">

//           <Card className="h-full bg-[#111827] border border-gray-800">

//             <div className="mb-4">

//               <h2 className="text-lg sm:text-xl font-semibold text-white">
//                 CO₂ Emission by Repository
//               </h2>

//               <p className="text-xs sm:text-sm text-gray-500 mt-1">
//                 Compare the estimated carbon impact
//                 of your repositories.
//               </p>

//             </div>


//             {hasAnalysis ? (

//               <CarbonChart
//                 data={carbonChartData}
//               />

//             ) : (

//               <div className="h-[280px] sm:h-[320px] flex items-center justify-center text-center">

//                 <div className="max-w-sm px-4">

//                   <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto">
//                     <FaChartLine className="text-emerald-400 text-xl" />
//                   </div>

//                   <p className="text-white font-medium mt-4">
//                     No CO₂ analysis available yet
//                   </p>

//                   <p className="text-gray-500 text-sm mt-2">
//                     Analyze a repository to compare
//                     its estimated carbon impact here.
//                   </p>

//                 </div>

//               </div>

//             )}

//           </Card>

//         </div>


//         {/* ENERGY */}

//         <div>

//           <Card className="h-full bg-[#111827] border border-gray-800">

//             <div className="mb-4">

//               <h2 className="text-lg sm:text-xl font-semibold text-white">
//                 Energy Breakdown
//               </h2>

//               <p className="text-xs sm:text-sm text-gray-500 mt-1">
//                 Estimated energy consumption by component.
//               </p>

//             </div>


//             {hasEnergyData ? (

//               <EnergyChart
//                 data={energyChartData}
//               />

//             ) : (

//               <div className="h-[280px] sm:h-[320px] flex items-center justify-center text-center">

//                 <div className="max-w-sm px-4">

//                   <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto">
//                     <FaBolt className="text-amber-400 text-xl" />
//                   </div>

//                   <p className="text-white font-medium mt-4">
//                     No energy data yet
//                   </p>

//                   <p className="text-gray-500 text-sm mt-2">
//                     Analyze a repository to see where
//                     estimated energy consumption comes from.
//                   </p>

//                 </div>

//               </div>

//             )}

//           </Card>

//         </div>

//       </div>


//       {/* =====================================
//           RECENT REPOSITORIES
//       ====================================== */}

//       {hasRepositories && (

//         <div className="mb-8">

//           <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">

//             <div>

//               <p className="text-emerald-400 text-xs font-medium uppercase tracking-wider">
//                 Portfolio
//               </p>

//               <h2 className="text-xl sm:text-2xl font-semibold text-white mt-1">
//                 Recent Repositories
//               </h2>

//               <p className="text-sm text-gray-500 mt-1">
//                 Your recently connected repositories.
//               </p>

//             </div>


//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() =>
//                 navigate("/repository")
//               }
//               className="w-full sm:w-auto flex items-center justify-center gap-2"
//             >
//               View All
//               <FaArrowRight />
//             </Button>

//           </div>


//           <div className="space-y-4">

//             {dashboardData.recentRepositories.map(
//               (repo, index) => (

//                 <RepoCard
//                   key={
//                     repo._id ||
//                     repo.id ||
//                     index
//                   }

//                   name={
//                     repo.repositoryName ||
//                     repo.name ||
//                     "Unnamed Repository"
//                   }

//                   description={
//                     repo.description ||
//                     `Repository by ${
//                       repo.owner ||
//                       "Unknown owner"
//                     }`
//                   }

//                   stars={
//                     repo.stars || 0
//                   }

//                   forks={
//                     repo.forks || 0
//                   }

//                   issues={
//                     repo.issues || 0
//                   }

//                   updatedAt={
//                     repo.lastAnalyzed
//                       ? new Date(
//                           repo.lastAnalyzed
//                         ).toLocaleDateString()
//                       : "Not analyzed"
//                   }

//                   language={
//                     repo.language ||
//                     "Unknown"
//                   }

//                   languageColor="#10B981"

//                   onAnalyze={() =>
//                     handleAnalyze(
//                       repo.repositoryName ||
//                       repo.name
//                     )
//                   }
//                 />

//               )
//             )}

//           </div>

//         </div>

//       )}


//       {/* =====================================
//           QUICK ACTIONS
//       ====================================== */}

//       <div className="mb-8">

//         <div className="mb-4">

//           <p className="text-emerald-400 text-xs font-medium uppercase tracking-wider">
//             Get Started
//           </p>

//           <h2 className="text-xl sm:text-2xl font-semibold text-white mt-1">
//             Quick Actions
//           </h2>

//           <p className="text-sm text-gray-500 mt-1">
//             Quickly access the main CarbonWise workflows.
//           </p>

//         </div>


//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


//           {/* Analysis */}

//           <Card className="bg-[#111827] border border-gray-800 hover:border-emerald-500/30 transition-all duration-300">

//             <div className="flex flex-col sm:flex-row sm:items-start gap-4">

//               <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-emerald-500/10 flex items-center justify-center">
//                 <FaLeaf className="text-emerald-400 text-xl" />
//               </div>


//               <div className="flex-1">

//                 <h3 className="text-white font-semibold">
//                   Carbon Analysis
//                 </h3>

//                 <p className="text-sm text-gray-500 mt-1 mb-4">
//                   Measure the estimated environmental
//                   impact of your GitHub repositories.
//                 </p>

//                 <Button
//                   variant="primary"
//                   size="sm"
//                   onClick={() =>
//                     navigate("/repository")
//                   }
//                   className="flex items-center gap-2"
//                 >
//                   Start Analysis
//                   <FaArrowRight />
//                 </Button>

//               </div>

//             </div>

//           </Card>


//           {/* Reports */}

//           <Card className="bg-[#111827] border border-gray-800 hover:border-purple-500/30 transition-all duration-300">

//             <div className="flex flex-col sm:flex-row sm:items-start gap-4">

//               <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-purple-500/10 flex items-center justify-center">
//                 <FaFileAlt className="text-purple-400 text-xl" />
//               </div>


//               <div className="flex-1">

//                 <h3 className="text-white font-semibold">
//                   Sustainability Reports
//                 </h3>

//                 <p className="text-sm text-gray-500 mt-1 mb-4">
//                   View and download your generated
//                   sustainability reports.
//                 </p>

//                 <Button
//                   variant="secondary"
//                   size="sm"
//                   onClick={() =>
//                     navigate("/reports")
//                   }
//                   className="flex items-center gap-2"
//                 >
//                   View Reports
//                   <FaArrowRight />
//                 </Button>

//               </div>

//             </div>

//           </Card>

//         </div>

//       </div>


//       <Footer />

//     </div>
//   );
// };


// export default Dashboard;

import React, {
  useContext,
  useEffect,
  useState
} from "react";

import { useNavigate } from "react-router-dom";

import {
  FaCode,
  FaLeaf,
  FaBolt,
  FaCloud,
  FaGithub,
  FaChartLine,
  FaFileAlt,
  FaPlus,
  FaArrowRight
} from "react-icons/fa";

import StatsCard from "../../components/Cards/StatsCard";
import CarbonChart from "../../components/charts/CarbonCharts";
import EnergyChart from "../../components/charts/EnergyCharts";
import RepoCard from "../../components/cards/RepoCard";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
// Footer now rendered once by Layout.jsx, not per-page

import dashboardService from "../../services/dashboardService";
import { AuthContext } from "../../context/AuthContext";
import { ThemeContext } from "../../context/ThemeContext";


const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { formatCarbon } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [dashboardData, setDashboardData] = useState({
    totalRepositories: 0,
    totalAnalyses: 0,
    totalReports: 0,
    averageCarbon: 0,
    averageSustainability: 0,
    averageEnergyConsumptionWh: 0,

    energyDistribution: {
      ci: 0,
      storage: 0,
      network: 0
    },

    recentRepositories: []
  });


  useEffect(() => {
    fetchDashboardData();
  }, []);


  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await dashboardService.getDashboard();

      setDashboardData({
        totalRepositories:
          Number(data?.totalRepositories) || 0,

        totalAnalyses:
          Number(data?.totalAnalyses) || 0,

        totalReports:
          Number(data?.totalReports) || 0,

        averageCarbon:
          Number(data?.averageCarbon) || 0,

        averageSustainability:
          Number(
            data?.averageSustainability
          ) || 0,

        averageEnergyConsumptionWh:
          Number(
            data?.averageEnergyConsumptionWh
          ) || 0,

        energyDistribution: {
          ci:
            Number(
              data?.energyDistribution?.ci
            ) || 0,

          storage:
            Number(
              data?.energyDistribution?.storage
            ) || 0,

          network:
            Number(
              data?.energyDistribution?.network
            ) || 0
        },

        recentRepositories:
          Array.isArray(
            data?.recentRepositories
          )
            ? data.recentRepositories
            : []
      });

    } catch (err) {
      console.error(
        "Dashboard fetch error:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Failed to load dashboard data. Please try again."
      );

      if (
        err.response?.status === 401
      ) {
        navigate("/login");
      }

    } finally {
      setLoading(false);
    }
  };


  const hasRepositories =
    dashboardData.totalRepositories > 0;

  const hasAnalysis =
    dashboardData.totalAnalyses > 0;

  const hasEnergyData =
    dashboardData.energyDistribution.ci > 0 ||
    dashboardData.energyDistribution.storage > 0 ||
    dashboardData.energyDistribution.network > 0;


  /*
   * Repository names for the CO₂ chart.
   *
   * Repository data comes directly from backend,
   * so use repositoryName and carbonEmission.
   */
  const carbonChartData = {
    labels:
      dashboardData.recentRepositories.map(
        (repo) =>
          repo.repositoryName ||
          repo.name ||
          "Repository"
      ),

    datasets: [
      {
        label: "CO₂ Emission (gCO₂e)",

        data:
          dashboardData.recentRepositories.map(
            (repo) =>
              Number(
                repo.carbonEmission
              ) || 0
          )
      }
    ]
  };


  const energyChartData = {
    labels: [
      "CI/CD",
      "Storage",
      "Dependencies / Network"
    ],

    datasets: [
      {
        data: [
          dashboardData.energyDistribution.ci,
          dashboardData.energyDistribution.storage,
          dashboardData.energyDistribution.network
        ]
      }
    ]
  };


  const handleAnalyze = (
    repositoryName
  ) => {
    navigate(
      `/repository?search=${encodeURIComponent(
        repositoryName
      )}`
    );
  };


  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <Loader size="lg" />

        <p className="text-gray-400 mt-4 text-sm">
          Loading your dashboard...
        </p>
      </div>
    );
  }


  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <Card className="w-full max-w-md text-center bg-[#111827] border border-gray-800">
          <div className="p-8">

            <div className="w-14 h-14 mx-auto rounded-2xl bg-red-500/10 flex items-center justify-center">
              <FaCloud className="text-red-400 text-xl" />
            </div>

            <h2 className="text-white text-lg font-semibold mt-5">
              Unable to load dashboard
            </h2>

            <p className="text-gray-500 text-sm mt-2">
              {error}
            </p>

            <Button
              variant="primary"
              onClick={fetchDashboardData}
              className="mt-5"
            >
              Try Again
            </Button>

          </div>
        </Card>
      </div>
    );
  }


  return (
    <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">


      {/* =====================================
          HEADER
      ====================================== */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

        <div className="min-w-0">

          <p className="text-emerald-400 text-sm font-medium mb-2">
            Green Software Dashboard
          </p>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
            Welcome back, {user?.name || "Developer"}! 👋
          </h1>

          <p className="text-gray-400 mt-2 text-sm sm:text-base max-w-2xl">
            Monitor the estimated environmental impact
            of your GitHub repositories in one place.
          </p>

        </div>


        <Button
          variant="primary"
          onClick={() =>
            navigate("/repository")
          }
          className="w-full sm:w-auto flex items-center justify-center gap-2"
        >
          <FaGithub />
          Analyze Repository
        </Button>

      </div>


      {/* =====================================
          EMPTY STATE
      ====================================== */}

      {!hasRepositories && (

        <Card className="mb-8 bg-[#111827] border border-emerald-500/20 overflow-hidden">

          <div className="p-6 sm:p-8 lg:p-10">

            <div className="max-w-3xl mx-auto text-center">

              <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <FaGithub className="text-emerald-400 text-3xl sm:text-4xl" />
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white mt-5">
                Your sustainability dashboard is ready
              </h2>

              <p className="text-gray-400 mt-3 text-sm sm:text-base">
                Connect your first GitHub repository to
                start measuring its estimated carbon
                emissions, energy consumption and
                sustainability score.
              </p>


              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-7 text-left">

                <div className="p-4 rounded-xl bg-[#0b1220] border border-gray-800">
                  <FaCloud className="text-emerald-400 mb-3" />

                  <p className="text-white text-sm font-medium">
                    CO₂ Emissions
                  </p>

                  <p className="text-gray-500 text-xs mt-1">
                    Estimate repository carbon impact
                  </p>
                </div>


                <div className="p-4 rounded-xl bg-[#0b1220] border border-gray-800">
                  <FaBolt className="text-amber-400 mb-3" />

                  <p className="text-white text-sm font-medium">
                    Energy Usage
                  </p>

                  <p className="text-gray-500 text-xs mt-1">
                    Understand energy consumption
                  </p>
                </div>


                <div className="p-4 rounded-xl bg-[#0b1220] border border-gray-800">
                  <FaLeaf className="text-cyan-400 mb-3" />

                  <p className="text-white text-sm font-medium">
                    Sustainability
                  </p>

                  <p className="text-gray-500 text-xs mt-1">
                    Track your sustainability score
                  </p>
                </div>

              </div>


              <Button
                variant="primary"
                onClick={() =>
                  navigate("/repository")
                }
                className="mt-7 flex items-center justify-center gap-2 mx-auto"
              >
                <FaPlus />
                Add Your First Repository
              </Button>

            </div>

          </div>

        </Card>

      )}


      {/* =====================================
          STATS
      ====================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">

        <StatsCard
          title="Repositories"
          value={
            dashboardData.totalRepositories
          }
          icon={FaCode}
          subtitle="Connected repositories"
          color="primary"
        />


        <StatsCard
          title="Average CO₂ Emission"
          value={formatCarbon(dashboardData.averageCarbon)}
          icon={FaCloud}
          subtitle={
            hasAnalysis
              ? "Estimated per analysis"
              : "No analysis yet"
          }
          color="success"
        />


        <StatsCard
          title="Average Energy"
          value={`${dashboardData.averageEnergyConsumptionWh.toFixed(2)} Wh`}
          icon={FaBolt}
          subtitle={
            hasAnalysis
              ? "Estimated per analysis"
              : "No analysis yet"
          }
          color="warning"
        />


        <StatsCard
          title="Sustainability"
          value={`${dashboardData.averageSustainability}%`}
          icon={FaLeaf}
          subtitle={
            !hasAnalysis
              ? "No analysis yet"
              : dashboardData.averageSustainability >= 80
              ? "Excellent"
              : dashboardData.averageSustainability >= 60
              ? "Good"
              : "Needs improvement"
          }
          color="info"
        />

      </div>


      {/* =====================================
          ANALYSIS OVERVIEW
      ====================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">


        {/* CO₂ */}

        <div className="xl:col-span-2">

          <Card className="h-full bg-[#111827] border border-gray-800">

            <div className="mb-4">

              <h2 className="text-lg sm:text-xl font-semibold text-white">
                CO₂ Emission by Repository
              </h2>

              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Compare the estimated carbon impact
                of your repositories.
              </p>

            </div>


            {hasAnalysis ? (

              <CarbonChart
                data={carbonChartData}
              />

            ) : (

              <div className="h-[280px] sm:h-[320px] flex items-center justify-center text-center">

                <div className="max-w-sm px-4">

                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto">
                    <FaChartLine className="text-emerald-400 text-xl" />
                  </div>

                  <p className="text-white font-medium mt-4">
                    No CO₂ analysis available yet
                  </p>

                  <p className="text-gray-500 text-sm mt-2">
                    Analyze a repository to compare
                    its estimated carbon impact here.
                  </p>

                </div>

              </div>

            )}

          </Card>

        </div>


        {/* ENERGY */}

        <div>

          <Card className="h-full bg-[#111827] border border-gray-800">

            <div className="mb-4">

              <h2 className="text-lg sm:text-xl font-semibold text-white">
                Energy Breakdown
              </h2>

              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Estimated energy consumption by component.
              </p>

            </div>


            {hasEnergyData ? (

              <EnergyChart
                data={energyChartData}
              />

            ) : (

              <div className="h-[280px] sm:h-[320px] flex items-center justify-center text-center">

                <div className="max-w-sm px-4">

                  <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto">
                    <FaBolt className="text-amber-400 text-xl" />
                  </div>

                  <p className="text-white font-medium mt-4">
                    No energy data yet
                  </p>

                  <p className="text-gray-500 text-sm mt-2">
                    Analyze a repository to see where
                    estimated energy consumption comes from.
                  </p>

                </div>

              </div>

            )}

          </Card>

        </div>

      </div>


      {/* =====================================
          RECENT REPOSITORIES
      ====================================== */}

      {hasRepositories && (

        <div className="mb-8">

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">

            <div>

              <p className="text-emerald-400 text-xs font-medium uppercase tracking-wider">
                Portfolio
              </p>

              <h2 className="text-xl sm:text-2xl font-semibold text-white mt-1">
                Recent Repositories
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Your recently connected repositories.
              </p>

            </div>


            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                navigate("/repository")
              }
              className="w-full sm:w-auto flex items-center justify-center gap-2"
            >
              View All
              <FaArrowRight />
            </Button>

          </div>


          <div className="space-y-4">

            {dashboardData.recentRepositories.map(
              (repo, index) => (

                <RepoCard
                  key={
                    repo._id ||
                    repo.id ||
                    index
                  }

                  name={
                    repo.repositoryName ||
                    repo.name ||
                    "Unnamed Repository"
                  }

                  description={
                    repo.description ||
                    `Repository by ${
                      repo.owner ||
                      "Unknown owner"
                    }`
                  }

                  stars={
                    repo.stars || 0
                  }

                  forks={
                    repo.forks || 0
                  }

                  issues={
                    repo.issues || 0
                  }

                  updatedAt={
                    repo.lastAnalyzed
                      ? new Date(
                          repo.lastAnalyzed
                        ).toLocaleDateString()
                      : "Not analyzed"
                  }

                  language={
                    repo.language ||
                    "Unknown"
                  }

                  languageColor="#10B981"

                  onAnalyze={() =>
                    handleAnalyze(
                      repo.repositoryName ||
                      repo.name
                    )
                  }
                />

              )
            )}

          </div>

        </div>

      )}


      {/* =====================================
          QUICK ACTIONS
      ====================================== */}

      <div className="mb-8">

        <div className="mb-4">

          <p className="text-emerald-400 text-xs font-medium uppercase tracking-wider">
            Get Started
          </p>

          <h2 className="text-xl sm:text-2xl font-semibold text-white mt-1">
            Quick Actions
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Quickly access the main CarbonWise workflows.
          </p>

        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


          {/* Analysis */}

          <Card className="bg-[#111827] border border-gray-800 hover:border-emerald-500/30 transition-all duration-300">

            <div className="flex flex-col sm:flex-row sm:items-start gap-4">

              <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <FaLeaf className="text-emerald-400 text-xl" />
              </div>


              <div className="flex-1">

                <h3 className="text-white font-semibold">
                  Carbon Analysis
                </h3>

                <p className="text-sm text-gray-500 mt-1 mb-4">
                  Measure the estimated environmental
                  impact of your GitHub repositories.
                </p>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() =>
                    navigate("/repository")
                  }
                  className="flex items-center gap-2"
                >
                  Start Analysis
                  <FaArrowRight />
                </Button>

              </div>

            </div>

          </Card>


          {/* Reports */}

          <Card className="bg-[#111827] border border-gray-800 hover:border-purple-500/30 transition-all duration-300">

            <div className="flex flex-col sm:flex-row sm:items-start gap-4">

              <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <FaFileAlt className="text-purple-400 text-xl" />
              </div>


              <div className="flex-1">

                <h3 className="text-white font-semibold">
                  Sustainability Reports
                </h3>

                <p className="text-sm text-gray-500 mt-1 mb-4">
                  View and download your generated
                  sustainability reports.
                </p>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    navigate("/reports")
                  }
                  className="flex items-center gap-2"
                >
                  View Reports
                  <FaArrowRight />
                </Button>

              </div>

            </div>

          </Card>

        </div>

      </div>

    </div>
  );
};


export default Dashboard;