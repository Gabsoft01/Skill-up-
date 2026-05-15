import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, getDoc, collection, setDoc, serverTimestamp } from 'firebase/firestore';
import { Briefcase, ArrowLeft, Loader2, IndianRupee, Clock, User, LogIn, DollarSign } from 'lucide-react';
import { createNotification } from '../lib/notifications';

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profile, user } = useAuthStore();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bidding, setBidding] = useState(false);
  const [bidAmount, setBidAmount] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        if (!id) return;
        const docRef = doc(db, 'jobs', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setJob({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `jobs/${id}`);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const submitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !job || !user) return;
    setIsSubmitting(true);

    try {
      const propRef = doc(collection(db, 'proposals'));
      await setDoc(propRef, {
        jobId: job.id,
        clientId: job.clientId,
        freelancerId: user.uid,
        bidAmount: Number(bidAmount),
        coverLetter,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Create notification for the client using helper
      await createNotification({
        userId: job.clientId,
        title: 'New Proposal',
        message: `${profile.displayName || 'A freelancer'} submitted a proposal for "${job.title}" with a bid of $${bidAmount}.`,
        type: 'proposal',
        relatedId: propRef.id,
        link: '/client', // or route to proposals later
      });

      navigate('/freelancer');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'proposals');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col">
        <h2 className="text-2xl font-bold mb-4">Job not found</h2>
        <button onClick={() => navigate(-1)} className="text-brand-600 hover:underline">Go Back</button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button onClick={() => navigate(-1)} className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </button>
          
          <div className="flex flex-col md:flex-row md:items-start justify-between">
             <div className="max-w-3xl">
                <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">{job.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                   <span className="flex items-center"><Clock className="w-4 h-4 mr-1"/> Posted {new Date(job.createdAt.seconds * 1000).toLocaleDateString()}</span>
                   <span className="bg-brand-50 text-brand-700 px-3 py-1 rounded-full font-medium">{job.category}</span>
                   <span className={`px-3 py-1 rounded-full font-semibold uppercase tracking-wider ${job.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                     {job.status.replace('_', ' ')}
                   </span>
                </div>
             </div>
             <div className="mt-6 md:mt-0 bg-blue-50 border border-brand-100 p-6 rounded-2xl md:w-72 md:flex-shrink-0 text-center">
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">Project Budget</p>
                <div className="text-4xl font-bold text-brand-900 flex justify-center items-center">
                   <DollarSign className="w-8 h-8" />{job.budget}
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-8">
            <section className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
               <h2 className="text-xl font-bold text-gray-900 mb-4">Project Description</h2>
               <div className="prose prose-brand max-w-none text-gray-700 whitespace-pre-wrap">
                  {job.description}
               </div>
            </section>
         </div>

         <div className="space-y-6">
            {!profile && job.status === 'open' && (
               <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-center">
                 <h3 className="text-lg font-bold mb-2">Interested in this job?</h3>
                 <p className="text-gray-500 text-sm mb-4">Create an account or log in to submit a proposal.</p>
                 <button onClick={() => navigate('/auth')} className="w-full flex items-center justify-center p-3 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 transition">
                   <LogIn className="w-5 h-5 mr-2" /> Log In
                 </button>
               </div>
            )}

            {profile?.role === 'freelancer' && job.status === 'open' && !bidding && (
               <button onClick={() => setBidding(true)} className="w-full p-4 bg-brand-600 text-white rounded-2xl font-bold text-lg hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/25">
                 Submit a Proposal
               </button>
            )}

            {profile?.role === 'freelancer' && job.status === 'open' && bidding && (
               <div className="bg-white p-6 rounded-2xl border border-brand-200 shadow-md">
                 <h3 className="text-lg font-bold text-gray-900 mb-4">Your Proposal</h3>
                 <form onSubmit={submitProposal} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Bid Amount ($)</label>
                      <input 
                        type="number" required min="1" max={job.budget * 2}
                        value={bidAmount} onChange={(e) => setBidAmount(e.target.value)}
                        className="w-full p-3 border rounded-xl focus:ring-brand-500" 
                        placeholder="e.g. 500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Cover Letter</label>
                      <textarea
                        required rows={5}
                        value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)}
                        className="w-full p-3 border rounded-xl focus:ring-brand-500"
                        placeholder="Tell the client why you're perfect for this task..."
                      />
                    </div>
                    <div className="flex justify-end space-x-3 pt-2">
                      <button type="button" onClick={() => setBidding(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg font-medium transition">
                        Cancel
                      </button>
                      <button type="submit" disabled={isSubmitting} className="flex items-center px-4 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 disabled:opacity-50 transition">
                        {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Submit"}
                      </button>
                    </div>
                 </form>
               </div>
            )}

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
               <h3 className="text-lg font-bold text-gray-900 mb-4">About the Client</h3>
               <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                     <User className="w-6 h-6 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Verified Client</p>
                    <p className="text-sm text-gray-500">Member since {new Date(job.createdAt.seconds * 1000).getFullYear()}</p>
                  </div>
               </div>
               <div className="pt-4 border-t border-gray-100 pb-2">
                 <div className="flex justify-between text-sm mb-2">
                   <span className="text-gray-500">Payment Method</span>
                   <span className="font-medium text-green-600 flex items-center">Verified <CheckCircleIcon className="w-4 h-4 ml-1" /></span>
                 </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

function CheckCircleIcon(props: any) {
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}
