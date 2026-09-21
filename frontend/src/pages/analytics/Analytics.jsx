import React, { useEffect, useState, useContext } from "react";

import {
  FaChartLine,
  FaLeaf,
  FaClipboardList,
  FaBolt,
  FaCloud,
  FaExclamationTriangle,
} from "react-icons/fa";

import StatsCard from "../../components/Cards/StatsCard";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";

import CarbonChart from "../../components/charts/CarbonCharts";
import EnergyChart from "../../components/charts/EnergyCharts";

import analyticsService from "../../services/analyticsService";
import { ThemeContext } from "../../context/ThemeContext";


const Analytics = () => {
  const { formatCarbon } = useContext(ThemeContext);

  const [analytics, setAnalytics] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // =====================================================
  // Fetch Analytics
  // =====================================================

  useEffect(() => {

    const fetchAnalytics = async () => {

      try {

        const data =
          await analyticsService.getAnalytics();

        setAnalytics(
          data.analytics
        );

      } catch (err) {

        console.error(
          "Analytics Error:",
          err
        );

        setError(
          err.response?.data?.message ||
          "Failed to load analytics"
        );

      } finally {

        setLoading(false);

      }
    };

    fetchAnalytics();

  }, []);


  // =====================================================
  // Loading
  // =====================================================

  if (loading) {

    return (

      <div className="
        flex
        flex-col
        items-center
        justify-center
        min-h-[60vh]
      ">

        <Loader size="lg" />

        <p className="
          text-dark-400
          mt-4
          text-sm
        ">
          Loading analytics...
        </p>

      </div>

    );
  }


  // =====================================================
  // Error
  // =====================================================

  if (error) {

    return (

      <div className="p-6">

        <div className="
          bg-red-500/10
          border
          border-red-500/20
          text-red-400
          px-4
          py-3
          rounded-xl
        ">

          {error}

        </div>

      </div>

    );
  }


  // =====================================================
  // Empty State
  // =====================================================

  const hasData =
    analytics &&
    analytics.repositoriesAnalyzed > 0;


  if (!hasData) {

    return (

      <div className="
        p-4
        md:p-6
        space-y-6
      ">

        <div>

          <h1 className="
            text-2xl
            md:text-3xl
            font-bold
            text-white
          ">
            Analytics
          </h1>

          <p className="
            text-dark-400
            mt-1
          ">
            Understand the carbon, energy, and
            sustainability impact of your repositories.
          </p>

        </div>


        <Card>

          <div className="
            text-center
            py-16
          ">

            <FaChartLine className="
              text-5xl
              text-dark-600
              mx-auto
              mb-5
            " />

            <h3 className="
              text-lg
              font-semibold
              text-white
              mb-2
            ">
              No analytics available
            </h3>

            <p className="
              text-dark-400
              text-sm
              max-w-md
              mx-auto
            ">
              Analyze a repository first.
              Your CO₂ emissions, energy consumption,
              and sustainability insights will appear here.
            </p>

          </div>

        </Card>

      </div>

    );
  }


  // =====================================================
  // Repository Data
  // =====================================================

  const repositories =
    analytics.repositoryAnalytics || [];


  // =====================================================
  // CO₂ Chart Data
  // =====================================================

  const carbonChartData = {

    labels:
      repositories.map(
        (repo) => repo.repositoryName
      ),

    datasets: [

      {

        label: "CO₂ Emission (g)",

        data:
          repositories.map(
            (repo) => repo.co2Emission
          ),

        backgroundColor:
          "rgba(59, 130, 246, 0.75)",

        borderColor:
          "#3B82F6",

        borderWidth: 1,

        borderRadius: 8,

        hoverBackgroundColor:
          "#60A5FA",

      },

    ],
  };


  // =====================================================
  // Energy Chart Data
  // =====================================================

  const energy =
    analytics.energyBreakdown || {};

  const energyChartData = {

    labels: [

      "CI/CD Compute",

      "Repository Storage",

      "Dependencies / Network",

    ],

    datasets: [

      {

        data: [

          energy.ciEnergyKWh || 0,

          energy.storageEnergyKWh || 0,

          energy.networkEnergyKWh || 0,

        ],

        backgroundColor: [

          "#10B981",

          "#8B5CF6",

          "#F59E0B",

        ],

        borderColor:
          "#0F172A",

        borderWidth: 3,

      },

    ],
  };


  return (

    <div className="
      p-4
      md:p-6
      space-y-6
      w-full
      max-w-[1600px]
      mx-auto
    ">


      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div>

        <h1 className="
          text-2xl
          md:text-3xl
          font-bold
          text-white
        ">
          Analytics
        </h1>

        <p className="
          text-dark-400
          mt-1
          text-sm
          md:text-base
        ">
          Understand the carbon, energy, and
          sustainability impact of your repositories.
        </p>

      </div>


      {/* =================================================
          SUMMARY CARDS
      ================================================= */}

      <div className="
        grid
        grid-cols-1
        sm:grid-cols-2
        xl:grid-cols-4
        gap-4
      ">

        <StatsCard
          title="Repositories Analyzed"
          value={
            analytics.repositoriesAnalyzed
          }
          icon={FaClipboardList}
          color="info"
          subtitle="Unique repositories"
        />


        <StatsCard
          title="Total CO₂ Emission"
          value={formatCarbon(analytics.totalCo2Emission)}
          icon={FaCloud}
          color="warning"
          subtitle="Estimated carbon emissions"
        />


        <StatsCard
          title="Total Energy"
          value={`${analytics.totalEnergyConsumption} kWh`}
          icon={FaBolt}
          color="info"
          subtitle="Estimated energy consumption"
        />


        <StatsCard
          title="Avg. Sustainability"
          value={`${analytics.sustainabilityAverage}/100`}
          icon={FaLeaf}
          color="success"
          subtitle="Across analyzed repositories"
        />

      </div>


      {/* =================================================
          MAIN CHARTS
      ================================================= */}

      <div className="
        grid
        grid-cols-1
        xl:grid-cols-2
        gap-5
      ">

        <CarbonChart
          data={carbonChartData}
          title="CO₂ Emission by Repository"
        />


        <EnergyChart
          data={energyChartData}
          title="Energy Breakdown"
        />

      </div>


      {/* =================================================
          INSIGHTS
      ================================================= */}

      <div className="
        grid
        grid-cols-1
        lg:grid-cols-2
        gap-5
      ">


        {/* Highest Carbon Impact */}

        <Card>

          <div className="
            flex
            items-start
            gap-4
          ">

            <div className="
              w-11
              h-11
              rounded-xl
              bg-orange-500/10
              flex
              items-center
              justify-center
              shrink-0
            ">

              <FaExclamationTriangle className="
                text-orange-400
              " />

            </div>


            <div className="
              min-w-0
            ">

              <p className="
                text-xs
                text-dark-400
                uppercase
                tracking-wide
              ">
                Highest Carbon Impact
              </p>


              <h3 className="
                text-lg
                font-semibold
                text-white
                mt-1
                truncate
              ">

                {
                  analytics.highestImpact
                    ?.repositoryName ||
                  "—"
                }

              </h3>


              <p className="
                text-orange-400
                font-semibold
                mt-1
              ">

                {
                  analytics.highestImpact
                    ?.co2Emission ?? 0
                }{" "}
                g CO₂

              </p>


              <p className="
                text-xs
                text-dark-400
                mt-2
              ">

                Main contributor:{" "}

                <span className="
                  text-dark-200
                ">

                  {
                    analytics.highestImpact
                      ?.mainContributor ||
                    "Not available"
                  }

                </span>

              </p>

            </div>

          </div>

        </Card>


        {/* Most Sustainable */}

        <Card>

          <div className="
            flex
            items-start
            gap-4
          ">

            <div className="
              w-11
              h-11
              rounded-xl
              bg-emerald-500/10
              flex
              items-center
              justify-center
              shrink-0
            ">

              <FaLeaf className="
                text-emerald-400
              " />

            </div>


            <div className="
              min-w-0
            ">

              <p className="
                text-xs
                text-dark-400
                uppercase
                tracking-wide
              ">
                Most Sustainable Repository
              </p>


              <h3 className="
                text-lg
                font-semibold
                text-white
                mt-1
                truncate
              ">

                {
                  analytics.mostSustainable
                    ?.repositoryName ||
                  "—"
                }

              </h3>


              <p className="
                text-emerald-400
                font-semibold
                mt-1
              ">

                {
                  analytics.mostSustainable
                    ?.sustainabilityScore ?? 0
                }/100

              </p>


              <p className="
                text-xs
                text-dark-400
                mt-2
              ">
                Highest sustainability score among
                analyzed repositories.
              </p>

            </div>

          </div>

        </Card>

      </div>


      {/* =================================================
          METHODOLOGY NOTE
      ================================================= */}

      <div className="
        border
        border-dark-700
        bg-dark-900/40
        rounded-xl
        px-4
        py-3
      ">

        <p className="
          text-xs
          md:text-sm
          text-dark-300
        ">

          <span className="
            text-white
            font-semibold
          ">
            Note:
          </span>{" "}

          CO₂ and energy values are estimated from
          repository analysis data including CI/CD
          activity, repository storage, and
          dependency/network information.

        </p>

      </div>

    </div>

  );
};


export default Analytics;