import React, { useEffect, useState } from "react";
import {
  Plus,
  Briefcase,
  Users,
  Building2,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import DashboardLayout from "../../components/layout/DashboardLayout";
import LoadingSpinner from "../../components/LoadingSpinner";
import JobDashboardCard from "../../components/cards/JobDashboardCard";

const Card = ({ className, children, title, subtitle, headerAction }) => {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}
    >
      {(title || headerAction) && (
        <div className="flex items-center justify-between p-6 pb-4">
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1"> {subtitle}</p>
            )}
          </div>
          {headerAction}
        </div>
      )}

      <div className={title ? "px-6 pb-6" : "p-6"}>{children}</div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color }) => {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-emerald-500 to-emerald-600",
    purple: "from-purple-500 to-purple-600",
    orange: "from-orange-500 to-orange-600",
  };

  return (
    <Card
      className={`bg-gradient-to-br ${colorClasses[color]} text-white border-0`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/80 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          {trend && (
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="font-medium">{trendValue}</span>
            </div>
          )}
        </div>

        <div className="bg-white/10 p-3 rounded-xl">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </Card>
  );
};

const EmployerDashboard = () => {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [testData, setTestData] = useState(null);

  const getDashboardOverview = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(API_PATHS.DASHBOARD.OVERVIEW);
      console.log("API Response:", response.data); // Debug log to see structure
      console.log("recentJobs data:", response.data?.data?.recentJobs); // Check recentJobs specifically
      console.log("recentJobs length:", response.data?.data?.recentJobs?.length); // Check length
      if (response.status === 200) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const testJobsInDatabase = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.DASHBOARD.TEST_JOBS);
      console.log("Test Jobs Response:", response.data);
      setTestData(response.data);
    } catch (error) {
      console.error("Test jobs error:", error);
    }
  };

  useEffect(() => {
    getDashboardOverview();
    return () => {};
  }, []);

  // Debug log to see current state
  console.log("Current dashboardData:", dashboardData);
  console.log("Current recentJobs:", dashboardData?.data?.recentJobs);
  console.log("recentJobs exists:", !!dashboardData?.data?.recentJobs);
  console.log("recentJobs length:", dashboardData?.data?.recentJobs?.length);

  return (
    <DashboardLayout activeMenu="employer-dashboard">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="max-wp7xl mx-auto space-y-8 mb-96">
          {/* Debug Test Button */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">Jobs in Database</h3>
            <button 
              onClick={testJobsInDatabase}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-sm"
            >
              Jobs in Database
            </button>
            {testData && (
              <div className="mt-4 text-sm">
                <p><strong>Total Jobs in DB:</strong> {testData.totalJobsInDatabase}</p>
                <p><strong>Your Jobs:</strong> {testData.userJobs}</p>
                <p><strong>Current User:</strong> {testData.currentUser?.name} ({testData.currentUser?.role})</p>
                {testData.userJobsData.length > 0 && (
                  <div className="mt-2">
                    <p><strong>Your Jobs:</strong></p>
                    <ul className="list-disc list-inside">
                      {testData.userJobsData.map((job, index) => (
                        <li key={index}>{job.title} - {job.location}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* dashboard stats  */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              title="Active Jobs"
              value={dashboardData?.count?.totalActiveJobs || 0}
              icon={Briefcase}
              trend={true}
              trendValue={`${dashboardData?.count?.trends?.activeJobs || 0}%`}
              color="blue"
            />
            <StatCard
              title="Active Applicants"
              value={dashboardData?.count?.totalApplications || 0}
              icon={Users}
              trend={true}
              trendValue={`${
                dashboardData?.count?.trends?.totalApplicants || 0
              }%`}
              color="green"
            />

            <StatCard
              title="Hired"
              value={dashboardData?.count?.totalHired || 0}
              icon={CheckCircle2}
              trend={true}
              trendValue={`${dashboardData?.count?.trends?.totalHired || 0}%`}
              color="purple"
            />
          </div>

          {/* Recent activity  */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            <Card
              title="Recent Job Posted"
              subtitle="Your latest job postings"
              headerAction={
                <button
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  onClick={() => navigate("/manage-jobs")}
                >
                  View all
                </button>
              }
            >
              <div className="space-y-3">
                {dashboardData?.data?.recentJobs && dashboardData.data.recentJobs.length > 0 ? (
                  dashboardData.data.recentJobs.slice(0, 3).map((job, index) => (
                    <JobDashboardCard key={job._id || index} job={job} />
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No recent jobs found</p>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default EmployerDashboard;
