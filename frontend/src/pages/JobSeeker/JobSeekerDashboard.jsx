import React, { useState, useEffect } from 'react'
import { Search, Filter, Grid, List, X } from 'lucide-react'
import LoadingSpinner from '../../components/LoadingSpinner'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPath'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import FilterContent from './components/FilterContent'
import SearchHeader from './components/SearchHeader'
import MobileFilterOverlay from './components/MobileFilterOverlay'
import Navbar from '../../components/layout/Navbar'
import JobCard from '../../components/cards/JobCard'


const JobSeekerDashboard = () => {

  const {user} = useAuth()

  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState('grid')
  const [showMobileFilters, setShowMobileFilters]  = useState(false)
  
  const navigate = useNavigate()

  // Filter states 
  const [filters, setFilters] = useState({
    keyword:"",
    location:"",
    category:"",
    type:"",
    minSalary:"",
    maxSalary:""
  })

  // Sidebar collapse states 
  const [expandedSections, setExpandedSections] = useState({
    jobType: true,
    salary:true,
    categories:true,

  });

  // function to fetch jobs from API 
  const fetchJobs = async ( filterParams = {}) =>{
    try{
      setLoading(true)
      setError(null)

      // Build Query parameters 
      const params = new URLSearchParams();

      if(filterParams.keyword) params.append('keyword', filterParams.keyword)
      if(filterParams.location) params.append('location', filterParams.location)
      if(filterParams.minSalary) params.append('minSalary', filterParams.minSalary)
      if(filterParams.maxSalary) params.append('maxSalary', filterParams.maxSalary)
      if(filterParams.category) params.append('category', filterParams.category)
      if(filterParams.type) params.append('type', filterParams.type)

        const response = await axiosInstance.get(
          `${API_PATHS.JOBS.GET_ALL_JOBS}?${params.toString()}`
        );

        const jobsData = Array.isArray(response.data)
        ? response.data
        : response.data.jobs || [];
        setJobs(jobsData);
        
    }catch (error){
      console.error("Error fetching jobs:",error)
      setError("Failed to fetch jobs. Please try again later.")
    }finally{
      setLoading(false);
    }
  };

  // Fetch jobs when fiters change (bounced) 
  useEffect(()=>{
    const timeoutId = setTimeout(()=>{
      const apiFilters = {
        keyword: filters.keyword,
        location: filters.location,
        minSalary: filters.minSalary,
        maxSalary: filters.maxSalary,
        category: filters.category,
        type: filters.type,
        experience:filters.experience,
        remoteOnly:filters.remoteOnly,
      }

      // only call API if there are meaningful filters 
      const hasFilters = Object.values(apiFilters).some(
        (value) =>
          value !== "" && 
          value !== false && 
          value !== null && 
          value !== undefined
      );

      if(hasFilters){
        fetchJobs(apiFilters);
      }else{
        fetchJobs(); 
      }
    }, 500) // 500ms debounce

    return () => clearTimeout(timeoutId)

  }, [filters, user])

  const handleFiltersChange = (key, value)=>{
    setFilters((prev)=>(
      {
        ...prev,
        [key]:value,
      }
    ));
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  }

  const clearAllFilters = () =>{
    setFilters({
      keyword:"",
      location:"",
      category:"",
      type:"",
      minSalary:"",
      maxSalary:""
    });
  }

  const MobileFilterOverlay = () =>(
    <div className={`fixed inset-0 z-50 lg:hidden ${showMobileFilters ? "" : "hidden"}`}>
      <div className='fixed inset-0 bg-black/50' onClick={() => setShowMobileFilters(false)} />
      <div className='fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl'>
        <div className='flex items-center justify-between p-6 border-b border-gray-200 '>
          <h3 className='font-bold text-gray-900 text-lg'>Filters</h3>
          <button className='hover:bg-gray-100 p-2 rounded-xl transition-colors' onClick={() => setShowMobileFilters(false)}>
            <X className='w-5 h-5'/>
          </button>
        </div>
      </div>

      <div className='p-6 overflow-y-auto rounded-xl transition-colors'>
        <FilterContent
          toggleSection ={toggleSection}
          clearAllFilters={clearAllFilters}
          setExpandedSections={expandedSections}
          filters={filters}
          handleFiltersChange={handleFiltersChange}
        />
      </div>
    </div>
  )

  const toggleSaveJob = async (jobId, isSaved) =>{
    try {
      if(isSaved){
        await axiosInstance.delete(API_PATHS.JOBS.UNSAVE_JOB(jobId));
        toast.success("Job removed successfully");
      }else{
        await axiosInstance.post(API_PATHS.JOBS.SAVE_JOB(jobId));
        toast.success("Job saved successfully");
      }
      
    } catch (error) {
      console.log("Error:",error)
      toast.error("Something went wrong. Try again later.")
    }
  }

  const applyToJob = async (jobId) =>{
    try {
      if(jobId){
        await axiosInstance.post(API_PATHS.APPLICATION.APPLY_TO_JOB(jobId));
        toast.success("Applied to job successfully!");
      }
      
    } catch (error) {
      console.log("Error:",error)
      const errorMsg = error?.response?.data?.message
      toast.error(errorMsg || "Something went wrong. Try again later.")
    
    }
  }


  if(jobs.lenght === 0 && !loading){
    return <LoadingSpinner/>;
  }

  return (
    <div className='bg-gradient-to-br from-blue-50 via-white to-purple-50'>
      <Navbar/>
      <div className='min-h-screen mt-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:py-8 '>
          {/* Search Header  */}
          <SearchHeader
            filters={filters}
            handleFiltersChange={handleFiltersChange}
          />

          <div className='flex gap-6 lg:gap-8'>
            {/* Desktop sidebar filter  */}
            <div className='hidden lg:block w-80 flex-shrink-0'>
              <div className='hg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 sticky top-20'>
                <h3 className='font-bold text-gray-900 text-xl mb-6'>Filter Jobs</h3>
                <FilterContent
                  toggleSection ={toggleSection}
                  clearAllFilters={clearAllFilters}
                  expandedSections={expandedSections}
                  filters={filters}
                  handleFiltersChange={handleFiltersChange}
                />
              </div>
            </div>

            {/* Main Content  */}
            <div className='flex-1 min-w-0'>
              {/* Results header  */}
              <div className='flex flex-col lg:flex-row lg:items-center justify-between mb-6 lg:mb-8 gap-4'>
                <div >
                  <p className='text-gray-600 text-sm lg:text-base'>
                    Showing{" "}
                    <span className='font-bold text-gray-900'>
                      {jobs.length}
                    </span>
                    jobs
                  </p>
                </div>

                <div className='flex items-center justify-between lg:justify-end gap-4'>
                  <button className='lg:hidden items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200 font-medium text-gray-700 hover:bg-gray-50 transition-colors ' onClick={()=> setShowMobileFilters(true)}>
                    <Filter className='w-4 h-4'/>
                    Filters
                  </button>
                  <div className='flex items-center gap-3 lg:gap-4'>
                    <div className='flex items-center border border-gray-200 rounded-xl p-1 bg-white'>
                      <button 
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === "grid" 
                        ? " bg-blue-600 text-white shadow-sm"
                        :" text-gray-600 hover:text-gray-900 hover:bg-gray-100" 
                      }`}>
                        <Grid className='w-4 h-4'/>
                        
                      </button>
                      <button 
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === "list" 
                        ? " bg-blue-600 text-white shadow-sm"
                        :" text-gray-600 hover:text-gray-900 hover:bg-gray-100" 
                      }`}>
                        <List className='w-4 h-4'/>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Grid  */}
              {jobs.length === 0 ? (
                <div className='text-center py-16 lg:py20 bg-white/60 backdrop-blur-xl rounded-2xl border border-white/20 shadow-lg '>
                  <div className='text-gray-400 mb-6'>
                    <Search className='w016 h-16 mx-auto'/>
                  </div>
                  <h3 className='text-xl lg:text-2xl font-bold text-gray-900 mb-3'>
                    No jobs Found
                  </h3>
                  <p className='text-gray-600 mb-6'>
                    Try adjusting your search criteria of filters
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className='bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors '
                  > 
                    Clear All Filters
                  </button>
                </div>
              ):(
                <div className={
                  viewMode === "grid"
                  ? " grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4 lg:gap-4"
                  : " space-y-4 lg:space-y-6"
                }>
                  {jobs.map((job) => (
                    <JobCard
                      key={job._id}
                      job={job}
                      ontoggleSave={toggleSaveJob(job._id, job.isSaved)}
                      onApply={applyToJob(job._id)}
                      onClick={()=> navigate(`/jobs/${job._id}`)}
                    />

                  ))}

                </div>
              )}
            </div>

          </div>

        </div>

        {/* Mobile Filter Overlay  */}
        <MobileFilterOverlay/>
      </div>
    </div>
  )
}

export default JobSeekerDashboard