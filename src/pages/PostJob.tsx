import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Loader2, Briefcase, FileText, Tag, DollarSign } from 'lucide-react';
import { motion } from 'motion/react';

const CATEGORIES = [
  'Web Design', 'UI/UX Design', 'Frontend Development', 'Backend Development',
  'Full Stack Development', 'Mobile App Development', 'SEO Writing', 'Copywriting',
  'Graphic Design', 'Video Editing', 'Data Analysis', 'Virtual Assistance'
];

export default function PostJob() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    budget: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      const jobRef = doc(collection(db, 'jobs'));
      await setDoc(jobRef, {
        clientId: user.uid,
        title: formData.title,
        category: formData.category,
        description: formData.description,
        budget: Number(formData.budget),
        status: 'open',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      navigate('/client');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'jobs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gray-50 min-h-screen">
       <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900">Post a New Job</h1>
          <p className="text-gray-500 mt-2">Connect with top talent by providing clear project details.</p>
       </div>

       <motion.form 
         initial={{ opacity: 0, y: 10 }}
         animate={{ opacity: 1, y: 0 }}
         onSubmit={handleSubmit} 
         className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 space-y-6"
       >
         <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Project Title</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Briefcase className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                required
                maxLength={200}
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-brand-500 focus:border-brand-500"
                placeholder="e.g. Build a modern e-commerce website"
              />
            </div>
         </div>

         <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Category</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Tag className="h-5 w-5 text-gray-400" />
              </div>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-brand-500 focus:border-brand-500 appearance-none bg-white"
              >
                <option value="" disabled>Select a category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
         </div>

         <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Project Description</label>
            <div className="relative">
              <div className="absolute top-3 left-3 pointer-events-none">
                <FileText className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                required
                rows={6}
                maxLength={10000}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-brand-500 focus:border-brand-500"
                placeholder="Describe your project, timeline, and exact requirements..."
              />
            </div>
         </div>

         <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Budget (USD)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                required
                min="10"
                value={formData.budget}
                onChange={(e) => setFormData({...formData, budget: e.target.value})}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-brand-500 focus:border-brand-500"
                placeholder="e.g. 500"
              />
            </div>
         </div>

         <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
               type="button"
               onClick={() => navigate(-1)}
               className="px-6 py-3 text-gray-500 hover:text-gray-700 font-medium mr-4 transition-colors"
            >
               Cancel
            </button>
            <button
               type="submit"
               disabled={loading}
               className="flex items-center px-8 py-3 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 disabled:opacity-50 transition-colors"
            >
               {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
               Post Job Now
            </button>
         </div>
       </motion.form>
    </div>
  );
}
