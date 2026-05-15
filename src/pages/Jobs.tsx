import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, orderBy, getDocs, where } from 'firebase/firestore';
import { Search, Clock, DollarSign, Briefcase, Filter } from 'lucide-react';

export default function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialQuery);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const q = query(
          collection(db, 'jobs'),
          where('status', '==', 'open'),
          // Cannot do full-text search easily in Firestore, so we'll filter client-side for simplicity. 
          // Ordering by createdAt is fine.
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        const jobsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setJobs(jobsData);
      } catch (error) {
         handleFirestoreError(error, OperationType.LIST, 'jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(searchTerm ? { q: searchTerm } : {});
  };

  const filteredJobs = jobs.filter(job => 
    !searchParams.get('q') || 
    job.title.toLowerCase().includes(searchParams.get('q')!.toLowerCase()) ||
    job.description.toLowerCase().includes(searchParams.get('q')!.toLowerCase()) ||
    job.category.toLowerCase().includes(searchParams.get('q')!.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-brand-900 pt-16 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
         <div className="max-w-4xl mx-auto text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">Find Your Next Big Project</h1>
            <p className="text-brand-100 text-lg mb-10">Browse thousands of jobs posted by clients around the world.</p>
            
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row shadow-2xl rounded-2xl overflow-hidden bg-white p-2">
               <div className="flex-grow flex items-center pl-4 bg-transparent border-b sm:border-b-0 sm:border-r border-gray-100">
                  <Search className="w-6 h-6 text-gray-400 mr-3" />
                  <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by keyword, category, or skill..." 
                    className="w-full py-4 bg-transparent outline-none text-gray-900 text-lg"
                  />
               </div>
               <button type="submit" className="mt-2 sm:mt-0 sm:w-auto px-8 py-4 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 transition">
                  Search Jobs
               </button>
            </form>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-10 relative z-20">
         <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/4 hidden lg:block">
               <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm sticky top-24">
                  <div className="flex items-center justify-between mb-6">
                     <h3 className="text-lg font-bold">Filters</h3>
                     <Filter className="w-5 h-5 text-gray-400" />
                  </div>
                  
                  <div className="mb-6">
                     <h4 className="font-semibold text-gray-900 mb-3">Categories</h4>
                     <div className="space-y-2">
                       {['Web Design', 'Development', 'Writing', 'Marketing', 'Data Analysis'].map(cat => (
                         <div key={cat} className="flex items-center">
                           <input type="checkbox" id={cat} className="rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
                           <label htmlFor={cat} className="ml-2 text-sm text-gray-600">{cat}</label>
                         </div>
                       ))}
                     </div>
                  </div>

                  <div>
                     <h4 className="font-semibold text-gray-900 mb-3">Budget Range</h4>
                     <div className="space-y-2">
                       {['Less than $100', '$100 - $500', '$500 - $1000', '$1000+'].map(range => (
                         <div key={range} className="flex items-center">
                           <input type="radio" name="budget" id={range} className="text-brand-600 focus:ring-brand-500" />
                           <label htmlFor={range} className="ml-2 text-sm text-gray-600">{range}</label>
                         </div>
                       ))}
                     </div>
                  </div>
               </div>
            </div>

            <div className="lg:w-3/4">
               {loading ? (
                  <div className="flex flex-col space-y-4">
                     {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm animate-pulse h-40"></div>
                     ))}
                  </div>
               ) : filteredJobs.length === 0 ? (
                  <div className="bg-white p-12 text-center rounded-2xl border border-gray-200 shadow-sm">
                     <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                     <h3 className="text-xl font-bold text-gray-900 mb-2">No jobs found</h3>
                     <p className="text-gray-500">We couldn't find any open jobs matching your search criteria. Try adjusting your keywords.</p>
                  </div>
               ) : (
                  <div className="flex flex-col space-y-4">
                     {filteredJobs.map(job => (
                        <Link key={job.id} to={`/jobs/${job.id}`} className="block group">
                           <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow hover:border-brand-300 relative overflow-hidden">
                              <div className="absolute top-0 left-0 w-1 h-full bg-transparent group-hover:bg-brand-500 transition-colors"></div>
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                                 <div>
                                    <h2 className="text-xl font-bold text-gray-900 group-hover:text-brand-700 transition-colors mb-2">{job.title}</h2>
                                    <p className="text-sm font-medium text-brand-600 bg-brand-50 inline-block px-3 py-1 rounded-full">{job.category}</p>
                                 </div>
                                 <div className="mt-4 sm:mt-0 flex items-center text-lg font-bold text-gray-900 bg-gray-50 px-4 py-2 rounded-xl">
                                    <DollarSign className="w-5 h-5 text-gray-500" />
                                    {job.budget}
                                 </div>
                              </div>
                              <p className="text-gray-600 mb-6 line-clamp-2">
                                 {job.description}
                              </p>
                              <div className="flex items-center text-sm text-gray-500 space-x-6">
                                 <div className="flex items-center">
                                    <Clock className="w-4 h-4 mr-2" />
                                    Posted {new Date(job.createdAt.seconds * 1000).toLocaleDateString()}
                                 </div>
                                 <div className="hidden sm:block">Proposals: Less than 5</div>
                              </div>
                           </div>
                        </Link>
                     ))}
                  </div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
