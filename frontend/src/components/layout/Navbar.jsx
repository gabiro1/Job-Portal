import React, { useState, useEffect} from 'react'
import { Briefcase, Bookmark } from 'lucide-react'
import {Link, useNavigate} from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import ProfileDropdown from './ProfileDropdown'

const Navbar = () => {

    const {user, logout, isAuthenticated}=useAuth()
    const navigate = useNavigate()
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)

    // close dropdowns when clicking outside
    useEffect(()=>{
        const handleClickOutside = () => {
            if(profileDropdownOpen){
                setProfileDropdownOpen(false)
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);

    }, [profileDropdownOpen])
  return (
    <header className=''>
        <div className=''>
            <div className=''>
                {/* logo  */}
                <Link to='find-jobs' className=''>
                    <div>
                    <Briefcase className=''/>
                </div>
                <span className=''>JobPortal</span>
                </Link>

                {/* Auth buttons  */}
                <div>
                    {user && (
                        <button className='' onClick={()=> navigate("/saved-jobs")}>
                            <Bookmark className=''/>
                        </button>
                    )}
                    {isAuthenticated ?(
                        <ProfileDropdown
                            isOpen={profileDropdownOpen}
                            onToggle={(e)=> { 
                                e.stopPropagation()
                                setProfileDropdownOpen(!profileDropdownOpen)
                            }}
                            avatar={user?.avatar || ""}
                            companyName={user?.name || ""}
                            email={user?.email || ""}
                            onLogout={logout}
                            userRole={user?.role || ""}
                        />
                    ) : (
                        <>
                            <a href="/login" className=''>
                                Login
                            </a>
                            <a href="/signup" className=''>
                                Sign Up
                            </a>
                        </>
                    )}
                </div>
            </div>
        </div>
    </header>
  )
}

export default Navbar