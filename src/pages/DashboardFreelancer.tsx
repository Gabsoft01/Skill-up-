import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { Search, Briefcase, Award, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardFreelancer() {
  const { profile } = useAuthStore();
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    const fetchProposals = async () => {
      try {
        const q = query(
          collection(db, 'proposals'),
          where('freelancerId', '==', profile.uid),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        const proposalsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProposals(proposalsData);
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'proposals');
      } finally {
        setLoading(false);
      }
    };
    fetchProposals();
  }, [profile]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Freelancer Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your active proposals and current contracts.</p>
        </div>
        <Link to="/jobs" className="mt-4 md:mt-0 flex items-center px-6 py-3 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors">
          <Search className="w-5 h-5 mr-2" />
          Browse New Jobs
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 border border-gray-200 rounded-2xl shadow-sm">
           <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-blue-50 text-brand-600 rounded-xl flex items-center justify-center">
                 <Briefcase className="w-6 h-6" />
              </div>
           </div>
           <h3 className="text-2xl font-bold text-gray-900">{proposals.length}</h3>
           <p className="text-gray-500 font-medium">Active Proposals</p>
        </div>
        <div className="bg-white p-6 border border-gray-200 rounded-2xl shadow-sm">
           <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                 <Award className="w-6 h-6" />
              </div>
           </div>
           <h3 className="text-2xl font-bold text-gray-900">
             {proposals.filter(p => p.status === 'accepted').length}
           </h3>
           <p className="text-gray-500 font-medium">Won Projects</p>
        </div>
        <div className="bg-white p-6 border border-gray-200 rounded-2xl shadow-sm">
           <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                 <DollarSign className="w-6 h-6" />
              </div>
           </div>
           <h3 className="text-2xl font-bold text-gray-900">${profile?.walletBalance || 0}</h3>
           <p className="text-gray-500 font-medium">Earnings Available</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-lg font-semibold text-gray-900">Your Recent Proposals</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading proposals...</div>
          ) : proposals.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No proposals yet</h3>
              <p className="text-gray-500 mb-6">Start bidding on active jobs to grow your career.</p>
              <Link to="/jobs" className="inline-flex items-center text-brand-600 font-medium hover:text-brand-700">
                Browse Jobs
              </Link>
            </div>
          ) : (
            proposals.map(proposal => (
              <div key={proposal.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Bid: ${proposal.bidAmount}</h3>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">{proposal.coverLetter}</p>
                    <div className="mt-4">
                      <Link to={`/jobs/${proposal.jobId}`} className="text-sm text-brand-600 hover:text-brand-700 font-medium">
                        View Original Job
                      </Link>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                    proposal.status === 'accepted' ? 'bg-green-100 text-green-700' :
                    proposal.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    proposal.status === 'withdrawn' ? 'bg-gray-100 text-gray-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {proposal.status}
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
