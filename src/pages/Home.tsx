import { Link, useNavigate } from 'react-router-dom';
import { Search, ShieldCheck, Globe, Zap, ArrowRight, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

export default function Home() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/jobs?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-white pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[#eff6ff]/30 pointer-events-none" />
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-brand-100 rounded-full blur-3xl opacity-50 mix-blend-multiply pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-display font-bold text-gray-900 tracking-tight leading-tight mb-6"
            >
              The World's Premium <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-blue-400">
                Freelance Marketplace
              </span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto"
            >
              Connect with verified global professionals. Experience secure escrow payments, fast delivery, and world-class talent right at your fingertips.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12"
            >
              <Link to="/auth?role=client" className="w-full sm:w-auto px-8 py-4 bg-brand-600 text-white rounded-full font-medium text-lg hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/25 flex items-center justify-center">
                Hire a Freelancer
              </Link>
              <Link to="/auth?role=freelancer" className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 border border-gray-200 rounded-full font-medium text-lg hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center">
                Find Work
              </Link>
            </motion.div>

            {/* Search Bar */}
            <motion.form 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onSubmit={handleSearch}
              className="max-w-2xl mx-auto bg-white p-2 rounded-full shadow-lg border border-gray-100 flex items-center"
            >
              <div className="pl-4 text-gray-400">
                <Search className="w-5 h-5" />
              </div>
              <input 
                type="text" 
                placeholder="Find services e.g. 'Web Design', 'SEO Writing'..." 
                className="flex-grow py-3 px-4 outline-none text-gray-700 bg-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="bg-gray-900 text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors">
                Search
              </button>
            </motion.form>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-100">
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-1">5M+</div>
              <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">Jobs Completed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-1">100K+</div>
              <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">Verified Talent</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-1">$50M+</div>
              <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">Paid Out</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900 mb-1">4.9/5</div>
              <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">Why choose SkillLink Pro?</h2>
            <p className="text-gray-600 text-lg">We've built a platform that prioritzes trust, speed, and quality above everything else.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-blue-50 text-brand-600 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure Escrow Wallet</h3>
              <p className="text-gray-600 leading-relaxed">
                Funds are held securely by the platform until the client approves the work. 100% payment protection.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-6">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Global & Local Talent</h3>
              <p className="text-gray-600 leading-relaxed">
                Hire from anywhere in the world, with special tools tailored for seamless Nigerian & international user experiences.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Fast & Transparent</h3>
              <p className="text-gray-600 leading-relaxed">
                No hidden fees. Real-time chat, file sharing, and project tracking to ensure rapid delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-500 rounded-full blur-[100px] opacity-20" />
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-display font-bold mb-6">Ready to get started?</h2>
          <p className="text-xl text-gray-400 mb-10">Join thousands of businesses and freelancers building the future of work.</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
               <Link to="/auth" className="px-8 py-4 bg-brand-600 text-white rounded-full font-medium text-lg hover:bg-brand-500 transition-colors flex items-center justify-center">
                  Create an Account <ArrowRight className="ml-2 w-5 h-5" />
               </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
