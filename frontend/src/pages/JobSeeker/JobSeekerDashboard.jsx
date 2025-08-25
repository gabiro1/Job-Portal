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

        </div>

        {/* Mobile Filter Overlay  */}
        <MobileFilterOverlay/>
      </div>
    </div>
  )
}

export default JobSeekerDashboard