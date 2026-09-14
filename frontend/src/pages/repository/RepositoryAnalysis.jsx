// // frontend/src/pages/repository/RepositoryAnalysis.jsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//   FaPlus, 
//   FaSearch, 
//   FaSpinner,
//   FaGithub,
//   FaFolderOpen
// } from 'react-icons/fa';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import RepositoryStats from '../../components/repository/RepositoryStats';
// import RepositoryCard from '../../components/repository/RepositoryCard';
// import AddRepositoryModal from '../../components/repository/AddRepositoryModal';
// import repositoryService from '../../services/repositoryService';

// const RepositoryAnalysis = () => {
//   const navigate = useNavigate();
//   const [repositories, setRepositories] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [search, setSearch] = useState('');
//   const [addingRepo, setAddingRepo] = useState(false);
//   const [analyzingId, setAnalyzingId] = useState(null);
//   const [fetchError, setFetchError] = useState('');

//   // Fetch repositories on mount
//   useEffect(() => {
//     fetchRepositories();
//   }, []);

//   const fetchRepositories = async () => {
//     setLoading(true);
//     setFetchError('');
//     try {
//       const response = await repositoryService.getRepositories();
//       setRepositories(response.repositories || []);
//     } catch (error) {
//       console.error('Fetch repositories error:', error);
//       // Show the real error instead of silently substituting fake repos —
//       // masking failures with sample data hides real bugs from the user.
//       setRepositories([]);
//       setFetchError(
//         error.response?.data?.message || 'Failed to load repositories. Please try again.'
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddRepository = async (repoUrl) => {
//     setAddingRepo(true);
//     try {
//       const response =
// await repositoryService
// .addRepository(
//     repoUrl
// );

//       await fetchRepositories();
//       return response;
//     } catch (error) {
//       console.error('Add repository error:', error);
//       throw error;
//     } finally {
//       setAddingRepo(false);
//     }
//   };

//   const handleAnalyzeRepository = async (repositoryId) => {
//     setAnalyzingId(repositoryId);
//     try {
//       await repositoryService.analyzeRepository(repositoryId);
//       await fetchRepositories();
//     } catch (error) {
//       console.error('Analyze repository error:', error);
//     } finally {
//       setAnalyzingId(null);
//     }
//   };

//   const handleViewReports = (repositoryId) => {
//     navigate(`/analysis/${repositoryId}`);
// };

//   // Filter repositories based on search
//   const filteredRepositories = repositories.filter(repo => {
//     const searchLower = search.toLowerCase();
//     return (
//       repo.repositoryName?.toLowerCase().includes(searchLower) ||
//       repo.owner?.toLowerCase().includes(searchLower) ||
//       repo.language?.toLowerCase().includes(searchLower)
//     );
//   });

//   // Calculate stats
//  const calculateStats = () => {
//   const total = repositories.length;

//   if (total === 0) {
//     return {
//       total: 0,
//       avgSustainability: '0%',
//       avgCarbon: '0 gCO₂e',
//       analyzed: 0
//     };
//   }

//   const analyzed = repositories.filter(
//     r => r.lastAnalyzed
//   ).length;

//   const avgSustainability = Math.round(
//     repositories.reduce(
//       (sum, r) => sum + (Number(r.sustainabilityScore) || 0),
//       0
//     ) / total
//   );

//   const avgCarbon = Number(
//     (
//       repositories.reduce(
//         (sum, r) => sum + (Number(r.carbonEmission) || 0),
//         0
//       ) / total
//     ).toFixed(2)
//   );

//   return {
//     total,
//     avgSustainability: `${avgSustainability}%`,
//     avgCarbon: `${avgCarbon} gCO₂e`,
//     analyzed
//   };
// };

//   return (
//     <div className="min-h-screen bg-[#030712]">
//       <div className="container mx-auto px-4 py-6 max-w-7xl">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
//           <div>
//             <h1 className="text-3xl font-bold text-white">Repository Analysis</h1>
//             <p className="text-gray-400 mt-1">Manage and analyze your GitHub repositories</p>
//           </div>
//           <Button
//             variant="primary"
//             onClick={() => setShowModal(true)}
//             className="flex items-center gap-2"
//           >
//             <FaPlus /> Add Repository
//           </Button>
//         </div>

//         {/* Stats */}
//         {fetchError && (
//           <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6">
//             {fetchError}
//           </div>
//         )}
//         <RepositoryStats stats={calculateStats()} />

//         {/* Search & Filter */}
//         <div className="flex flex-col sm:flex-row gap-3 mb-6">
//           <div className="relative flex-1">
//             <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
//             <input
//               type="text"
//               placeholder="Search repositories by name, owner, or language..."
//               className="w-full pl-10 pr-4 py-3 bg-[#111827] border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/10 transition-all duration-300"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//           </div>
//         </div>

//         {/* Repository Grid */}
//         {loading ? (
//           <div className="flex flex-col items-center justify-center py-16">
//             <FaSpinner className="text-4xl text-emerald-400 animate-spin" />
//             <p className="text-gray-400 mt-4">Loading repositories...</p>
//           </div>
//         ) : filteredRepositories.length > 0 ? (
//           <div className="
//     flex
//     flex-col
//     gap-6
// ">
//             {filteredRepositories.map((repo) => (
//               <RepositoryCard
//                 key={repo._id}
//                 repository={repo}
//                 onAnalyze={handleAnalyzeRepository}
//                 onReports={handleViewReports}
//                 loading={analyzingId === repo._id}
//               />
//             ))}
//           </div>
//         ) : (
//           <Card className="text-center py-16 border-dashed border-2 border-gray-800">
//             <div className="flex flex-col items-center">
//               <div className="p-4 bg-emerald-500/10 rounded-full mb-4">
//                 <FaFolderOpen className="text-4xl text-emerald-400" />
//               </div>
//               <h3 className="text-xl font-semibold text-white mb-2">
//                 {search ? 'No repositories found' : 'No repositories added yet'}
//               </h3>
//               <p className="text-gray-400 max-w-md">
//                 {search 
//                   ? 'Try adjusting your search terms' 
//                   : 'Add your first GitHub repository to start analyzing its carbon footprint'
//                 }
//               </p>
//               {!search && (
//                 <Button
//                   variant="primary"
//                   onClick={() => setShowModal(true)}
//                   className="mt-4 flex items-center gap-2"
//                 >
//                   <FaPlus /> Add Repository
//                 </Button>
//               )}
//             </div>
//           </Card>
//         )}

//         {/* Add Repository Modal */}
//         <AddRepositoryModal
//           isOpen={showModal}
//           onClose={() => setShowModal(false)}
//           onAdd={handleAddRepository}
//           loading={addingRepo}
//         />
//       </div>
//     </div>
//   );
// };

// export default RepositoryAnalysis;

// frontend/src/pages/repository/RepositoryAnalysis.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaPlus, 
  FaSearch, 
  FaSpinner,
  FaGithub,
  FaFolderOpen
} from 'react-icons/fa';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import RepositoryStats from '../../components/repository/RepositoryStats';
import RepositoryCard from '../../components/repository/RepositoryCard';
import AddRepositoryModal from '../../components/repository/AddRepositoryModal';
import repositoryService from '../../services/repositoryService';
import { ThemeContext } from '../../context/ThemeContext';

const RepositoryAnalysis = () => {
  const { formatCarbon } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [addingRepo, setAddingRepo] = useState(false);
  const [analyzingId, setAnalyzingId] = useState(null);
  const [fetchError, setFetchError] = useState('');

  // Fetch repositories on mount
  useEffect(() => {
    fetchRepositories();
  }, []);

  const fetchRepositories = async () => {
    setLoading(true);
    setFetchError('');
    try {
      const response = await repositoryService.getRepositories();
      setRepositories(response.repositories || []);
    } catch (error) {
      console.error('Fetch repositories error:', error);
      // Show the real error instead of silently substituting fake repos —
      // masking failures with sample data hides real bugs from the user.
      setRepositories([]);
      setFetchError(
        error.response?.data?.message || 'Failed to load repositories. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddRepository = async (repoUrl) => {
    setAddingRepo(true);
    try {
      const response =
await repositoryService
.addRepository(
    repoUrl
);

      await fetchRepositories();
      return response;
    } catch (error) {
      console.error('Add repository error:', error);
      throw error;
    } finally {
      setAddingRepo(false);
    }
  };

  const handleAnalyzeRepository = async (repositoryId) => {
    setAnalyzingId(repositoryId);
    try {
      await repositoryService.analyzeRepository(repositoryId);
      await fetchRepositories();
    } catch (error) {
      console.error('Analyze repository error:', error);
    } finally {
      setAnalyzingId(null);
    }
  };

  const handleViewReports = (repositoryId) => {
    navigate(`/analysis/${repositoryId}`);
};

  // Filter repositories based on search
  const filteredRepositories = repositories.filter(repo => {
    const searchLower = search.toLowerCase();
    return (
      repo.repositoryName?.toLowerCase().includes(searchLower) ||
      repo.owner?.toLowerCase().includes(searchLower) ||
      repo.language?.toLowerCase().includes(searchLower)
    );
  });

  // Calculate stats
 const calculateStats = () => {
  const total = repositories.length;

  if (total === 0) {
    return {
      total: 0,
      avgSustainability: '0%',
      avgCarbon: formatCarbon(0),
      analyzed: 0
    };
  }

  const analyzed = repositories.filter(
    r => r.lastAnalyzed
  ).length;

  const avgSustainability = Math.round(
    repositories.reduce(
      (sum, r) => sum + (Number(r.sustainabilityScore) || 0),
      0
    ) / total
  );

  const avgCarbon = Number(
    (
      repositories.reduce(
        (sum, r) => sum + (Number(r.carbonEmission) || 0),
        0
      ) / total
    ).toFixed(2)
  );

  return {
    total,
    avgSustainability: `${avgSustainability}%`,
    avgCarbon: formatCarbon(avgCarbon),
    analyzed
  };
};

  return (
    <div className="min-h-screen bg-[#030712]">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Repository Analysis</h1>
            <p className="text-gray-400 mt-1">Manage and analyze your GitHub repositories</p>
          </div>
          <Button
            variant="primary"
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2"
          >
            <FaPlus /> Add Repository
          </Button>
        </div>

        {/* Stats */}
        {fetchError && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6">
            {fetchError}
          </div>
        )}
        <RepositoryStats stats={calculateStats()} />

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search repositories by name, owner, or language..."
              className="w-full pl-10 pr-4 py-3 bg-[#111827] border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/40 focus:ring-2 focus:ring-emerald-500/10 transition-all duration-300"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Repository Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <FaSpinner className="text-4xl text-emerald-400 animate-spin" />
            <p className="text-gray-400 mt-4">Loading repositories...</p>
          </div>
        ) : filteredRepositories.length > 0 ? (
          <div className="
    flex
    flex-col
    gap-6
">
            {filteredRepositories.map((repo) => (
              <RepositoryCard
                key={repo._id}
                repository={repo}
                onAnalyze={handleAnalyzeRepository}
                onReports={handleViewReports}
                loading={analyzingId === repo._id}
              />
            ))}
          </div>
        ) : (
          <Card className="text-center py-16 border-dashed border-2 border-gray-800">
            <div className="flex flex-col items-center">
              <div className="p-4 bg-emerald-500/10 rounded-full mb-4">
                <FaFolderOpen className="text-4xl text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {search ? 'No repositories found' : 'No repositories added yet'}
              </h3>
              <p className="text-gray-400 max-w-md">
                {search 
                  ? 'Try adjusting your search terms' 
                  : 'Add your first GitHub repository to start analyzing its carbon footprint'
                }
              </p>
              {!search && (
                <Button
                  variant="primary"
                  onClick={() => setShowModal(true)}
                  className="mt-4 flex items-center gap-2"
                >
                  <FaPlus /> Add Repository
                </Button>
              )}
            </div>
          </Card>
        )}

        {/* Add Repository Modal */}
        <AddRepositoryModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onAdd={handleAddRepository}
          loading={addingRepo}
        />
      </div>
    </div>
  );
};

export default RepositoryAnalysis;