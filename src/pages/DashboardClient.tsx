import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { PlusCircle, Search, Clock, CheckCircle, Wallet, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardClient() {
  const { profile } = useAuthStore();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    const fetchJobs = async () => {
      try {
        const q = query(
          collection(db, 'jobs'),
          where('clientId', '==', profile.uid),
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
  }, [profile]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Client Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your posted jobs and active contracts.</p>
        </div>
        <Link to="/post-job" className="mt-4 md:mt-0 flex items-center px-6 py-3 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors">
          <PlusCircle className="w-5 h-5 mr-2" />
          Post a New Job
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 border border-gray-200 rounded-2xl shadow-sm">
           <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-blue-50 text-brand-600 rounded-xl flex items-center justify-center">
                 <FileText className="w-6 h-6" />
              </div>
           </div>
           <h3 className="text-2xl font-bold text-gray-900">{jobs.length}</h3>
           <p className="text-gray-500 font-medium">Total Jobs Posted</p>
        </div>
        <div className="bg-white p-6 border border-gray-200 rounded-2xl shadow-sm">
           <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                 <CheckCircle className="w-6 h-6" />
              </div>
           </div>
           <h3 className="text-2xl font-bold text-gray-900">
             {jobs.filter(j => j.status === 'completed').length}
           </h3>
           <p className="text-gray-500 font-medium">Completed Projects</p>
        </div>
        <div className="bg-white p-6 border border-gray-200 rounded-2xl shadow-sm">
           <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                 <Wallet className="w-6 h-6" />
              </div>
           </div>
           <h3 className="text-2xl font-bold text-gray-900">${profile?.walletBalance || 0}</h3>
           <p className="text-gray-500 font-medium">Escrow Balance</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-semibold text-gray-900">Your Recent Jobs</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading jobs...</div>
          ) : jobs.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No jobs posted yet</h3>
              <p className="text-gray-500 mb-6">Create your first job posting to attract global talent.</p>
              <Link to="/post-job" className="inline-flex items-center text-brand-600 font-medium hover:text-brand-700">
                Post Job <PlusCircle className="w-4 h-4 ml-1" />
              </Link>
            </div>
          ) : (
            jobs.map(job => (
              <div key={job.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <Link to={`/jobs/${job.id}`} className="block">
                       <h3 className="text-lg font-semibold text-brand-600 hover:text-brand-700 transition-colors mb-1">{job.title}</h3>
                    </Link>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
                       <span className="flex items-center"><Clock className="w-4 h-4 mr-1"/> Posted {new Date(job.createdAt.seconds * 1000).toLocaleDateString()}</span>
                       <span className="capitalize bg-gray-100 px-2 py-1 rounded-md">{job.category}</span>
                       <span className="font-medium text-gray-900">${job.budget}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                    job.status === 'open' ? 'bg-green-100 text-green-700' :
                    job.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {job.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
