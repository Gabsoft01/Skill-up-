import { Link } from 'react-router-dom';
import { Briefcase } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 pt-16 pb-8 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-white">
                SkillLink Pro
              </span>
            </Link>
            <p className="text-gray-400">
              The premium global marketplace connecting ambitious clients with elite freelance talent.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-4">For Clients</h3>
            <ul className="space-y-3 text-gray-400">
              <li><Link to="/post-job" className="hover:text-white transition-colors">Post a Job</Link></li>
              <li><Link to="/freelancers" className="hover:text-white transition-colors">Browse Talent</Link></li>
              <li><Link to="/trust" className="hover:text-white transition-colors">Trust & Safety</Link></li>
              <li><Link to="/escrow" className="hover:text-white transition-colors">Escrow Protection</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-4">For Freelancers</h3>
            <ul className="space-y-3 text-gray-400">
              <li><Link to="/jobs" className="hover:text-white transition-colors">Find Work</Link></li>
              <li><Link to="/auth" className="hover:text-white transition-colors">Create Profile</Link></li>
              <li><Link to="/academy" className="hover:text-white transition-colors">Learning Academy</Link></li>
              <li><Link to="/fees" className="hover:text-white transition-colors">Fees & Withdrawals</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-3 text-gray-400">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-800 text-center md:flex md:justify-between md:text-left text-gray-500">
          <p>&copy; {new Date().getFullYear()} SkillLink Pro. All rights reserved.</p>
          <div className="mt-4 md:mt-0 space-x-6">
            <span className="hover:text-white cursor-pointer transition-colors">Twitter</span>
            <span className="hover:text-white cursor-pointer transition-colors">LinkedIn</span>
            <span className="hover:text-white cursor-pointer transition-colors">Instagram</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
