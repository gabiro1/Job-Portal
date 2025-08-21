import React from 'react'
import { BrowserRouter as Router,Routes,Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/landingPage/LandingPage'
import SignUp from './pages/auth/SignUp'
import Login from './pages/auth/Login'
import JobSeekerDashboard from './pages/JobSeeker/JobSeekerDashboard'
import JobDetails from './pages/JobSeeker/JobDetails'
import SavedJob from './pages/JobSeeker/SavedJob'
import UserProfile from './pages/JobSeeker/UserProfile'
import EmployerDashboard from './pages/Employer/EmployerDashboard'
import JobPostingForm from './pages/Employer/JobPostingForm'
import ManageJobs from './pages/Employer/ManageJobs'
import ApplicationViewer from './pages/Employer/ApplicationViewer'
import EmployerProfilePage from './pages/Employer/EmployerProfilePage'
import ProtectedRoute from './Routes/ProtectedRoute'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'

function App() {


  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path='/' element={<LandingPage/>}/>
          <Route path='/signup' element={<SignUp/>}/>
          <Route path='/login' element={<Login/>}/>

          <Route path='/find-jobs' element={<JobSeekerDashboard/>} />
          <Route path='/job/:jobId' element={<JobDetails/>} />
          <Route path='/saved-jobs' element={<SavedJob/>} />
          <Route path='/profile' element={<UserProfile/>} />

          {/* Protected Routes  */}
          <Route element={<ProtectedRoute requiredRole="employer"/>}>
            <Route path='/employer-dashboard' element={<EmployerDashboard/>}/>
            <Route path='/post-job' element={<JobPostingForm/>}/>
            <Route path='/manage-jobs' element={<ManageJobs/>}/>
            <Route path='/applicants' element={<ApplicationViewer/>}/>
            <Route path='/company-profile' element={<EmployerProfilePage/>}/>
            
            
          </Route>


          {/* catch all routes  */}
          <Route path='*' element={<Navigate to="/" replace/>}/>
        </Routes>
      </Router>

      <Toaster
        toastOptions={{
          className:"",
          style:{
            fontSize:"13px",
          }
        }}
      />
    </AuthProvider>
  )
}

export default App
