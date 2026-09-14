// frontend/src/components/repository/RepositoryStats.jsx

import React from 'react';
import {
    FaFolder,
    FaLeaf,
    FaChartLine,
    FaCheckCircle
} from 'react-icons/fa';

const RepositoryStats = ({ stats }) => {

    const statItems = [

        {
            title: 'TOTAL REPOSITORIES',
            value: stats?.total || 0,
            icon: FaFolder,
            color: 'emerald',
            progress: 100
        },

        {
            title: 'AVG SUSTAINABILITY',
            value: stats?.avgSustainability || '0%',
            icon: FaLeaf,
            color: 'cyan',
            progress:
                parseInt(
                    stats?.avgSustainability || 0
                )
        },

       {
    title: 'AVG CARBON',
    value: stats?.avgCarbon || '0 gCO₂e',
    icon: FaChartLine,
    color: 'amber',
    progress: null
},

        {
            title: 'ANALYZED REPOS',
            value: stats?.analyzed || 0,
            icon: FaCheckCircle,
            color: 'green',
            progress:
                stats?.total
                    ? Math.round(
                          (
                              stats.analyzed /
                              stats.total
                          ) * 100
                      )
                    : 0
        }
    ];

    const getColors = (color) => {

        switch (color) {

            case 'emerald':
                return {
                    icon:
                        'text-emerald-400',
                    bg:
                        'bg-emerald-500/10',
                    border:
                        'border-emerald-500/20',
                    progress:
                        'bg-emerald-400'
                };

            case 'cyan':
                return {
                    icon:
                        'text-cyan-400',
                    bg:
                        'bg-cyan-500/10',
                    border:
                        'border-cyan-500/20',
                    progress:
                        'bg-cyan-400'
                };

            case 'amber':
                return {
                    icon:
                        'text-amber-400',
                    bg:
                        'bg-amber-500/10',
                    border:
                        'border-amber-500/20',
                    progress:
                        'bg-amber-400'
                };

            default:
                return {
                    icon:
                        'text-green-400',
                    bg:
                        'bg-green-500/10',
                    border:
                        'border-green-500/20',
                    progress:
                        'bg-green-400'
                };
        }
    };

    return (

        <div className="
            grid
            grid-cols-1
            sm:grid-cols-2
            xl:grid-cols-4
            gap-5
            mb-8
        ">

            {statItems.map(
                (item,index)=>{

                    const colors =
                        getColors(
                            item.color
                        );

                    return (

                        <div
                            key={index}
                            className={`
                                bg-[#111827]
                                border
                                ${colors.border}
                                rounded-2xl
                                p-5
                                hover:scale-[1.02]
                                transition-all
                                duration-300
                                shadow-lg
                            `}
                        >

                            {/* Header */}

                            <div className="
                                flex
                                justify-between
                                items-start
                            ">

                                <div>

                                    <p className="
                                        text-xs
                                        uppercase
                                        tracking-widest
                                        text-gray-500
                                        mb-2
                                    ">
                                        {item.title}
                                    </p>

                                    <h2 className="
                                        text-3xl
                                        font-bold
                                        text-white
                                    ">
                                        {item.value}
                                    </h2>

                                </div>

                                <div className={`
                                    p-3
                                    rounded-xl
                                    ${colors.bg}
                                    border
                                    ${colors.border}
                                `}>

                                    <item.icon
                                        className={`
                                            text-xl
                                            ${colors.icon}
                                        `}
                                    />

                                </div>

                            </div>


                            {/* Progress */}

{/* Progress */}

{item.progress !== null && (
    <div className="mt-5">
        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
                className={`
                    h-full
                    ${colors.progress}
                    transition-all
                    duration-700
                `}
                style={{
                    width: `${item.progress}%`
                }}
            />
        </div>
    </div>
)}

                            </div>

                        
                    );
                }
            )}

        </div>
    );
};

export default RepositoryStats;