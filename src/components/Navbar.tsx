import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { LogOut, User, Briefcase, PlusCircle, Search } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function Navbar() {
  const { user, profile } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-gray-900">
                SkillLink Pro
              </span>
            </Link>
            
            <div className="hidden md:flex space-x-6">
              <Link to="/jobs" className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">Find Work</Link>
              <Link to="/freelancers" className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">Find Talent</Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {!user ? (
              <>
                <Link to="/auth" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                  Log In
                </Link>
                <Link to="/auth" className="text-sm font-medium bg-brand-600 text-white px-4 py-2 rounded-full hover:bg-brand-700 transition-colors shadow-sm">
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                {profile?.role === 'client' && (
                  <Link to="/post-job" className="hidden sm:flex text-sm font-medium bg-brand-50 text-brand-700 px-4 py-2 rounded-full hover:bg-brand-100 transition-colors items-center space-x-1">
                    <PlusCircle className="w-4 h-4" />
                    <span>Post a Job</span>
                  </Link>
                )}
                
                <Link 
                  to={profile?.role === 'client' ? '/client' : '/freelancer'}
                  className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-brand-600 transition-colors"
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                  <span className="hidden sm:inline-block border-l pl-4 border-gray-200">Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
