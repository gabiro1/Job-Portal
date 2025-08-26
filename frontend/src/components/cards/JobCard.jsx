import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Bookmark, Building, Building2, Calendar, MapPin } from "lucide-react";
import moment from "moment";
import StatusBadge from "../StatusBadge";

const JobCard = ({ job, onClick, ontoggleSave, onApply, saved, hideApply }) => {
  const { user } = useAuth();

  // Format salary nicely
  const formatSalary = (min, max) => {
    const formatNumber = (num) =>
      num >= 1000 ? `$${(num / 1000).toFixed(0)}k` : `$${num}`;
    return max && max !== min
      ? `${formatNumber(min)} - ${formatNumber(max)}/m`
      : `${formatNumber(min)}/m`;
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl border-gray-200 p-6 shadow-sm hover:shadow-xl hover:shadow-gray-200 transition-all duration-200 group relative overflow-hidden cursor-pointer"
    >
      {/* Header: Company Logo + Title */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          {job?.company?.companyLogo ? (
            <img
              src={job.company.companyLogo}
              alt="Company Logo"
              className="w-14 h-14 object-cover rounded-2xl border-4 border-white/20 shadow-lg"
            />
          ) : (
            <div className="w-14 h-14 bg-gray-50 border-2 border-gray-200 rounded-2xl flex items-center justify-center">
              <Building2 className="w-8 h-8 text-gray-400" />
            </div>
          )}
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-base group-hover:text-blue-600 transition-colors leading-snug">
              {job?.title}
            </h3>
            <p className="text-gray-600 text-sm flex items-center gap-2 mt-1">
              <Building className="w-3.5 h-3.5" />
              {job?.company?.companyName}
            </p>
          </div>
        </div>

        {/* Save Bookmark */}
        {user && (
          <button
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              ontoggleSave();
            }}
          >
            <Bookmark
              className={`w-5 h-5 hover:text-blue-600 ${
                job?.isSaved || saved ? "text-blue-600" : "text-gray-400"
              }`}
            />
          </button>
        )}
      </div>

      {/* Job Info Tags */}
      <div className="mb-5">
        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 bg-gray-50 text-gray-700 px-3 py-1 rounded-full font-medium">
            <MapPin className="w-3 h-3" />
            {job?.location}
          </span>
          <span
            className={`px-3 py-1 rounded-full font-medium ${
              job?.type === "Full-Time"
                ? "bg-green-100 text-green-800"
                : job?.type === "Part-Time"
                ? "bg-yellow-100 text-yellow-800"
                : job?.type === "Internship"
                ? "bg-pink-100 text-pink-800"
                : job?.type === "Contract"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {job?.type}
          </span>
          <span className="flex items-center gap-1.5 bg-gray-50 text-gray-700 px-3 py-1 rounded-full font-medium">
            {job?.category}
          </span>
        </div>
      </div>

      {/* Posted Date */}
      <div className="flex items-center justify-between text-xs font-medium text-gray-50 mb-5 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {job?.createdAt ? moment(job.createdAt).format("Do MM YYYY") : "N/A"}
          </span>
        </div>
      </div>

      {/* Salary + Apply / Status */}
      <div className="flex items-center justify-between">
        <div className="text-blue-600 font-semibold text-lg">
          {formatSalary(job?.salaryMin, job?.salaryMax)}
        </div>

        {/* Always show Status if exists */}
        {job?.applicationStatus ? (
          <StatusBadge status={job.applicationStatus} />
        ) : (
          !hideApply && (
            <button
              className="bg-gradient-to-r from-blue-50 text-sm text-blue-700 hover:text-white px-6 py-2.5 rounded-xl hover:from-blue-500 hover:to-blue-600 transition-all duration-300 font-semibold transform hover:-translate-y-0.5"
              onClick={(e) => {
                e.stopPropagation();
                onApply && onApply();
              }}
            >
              Apply Now
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default JobCard;
