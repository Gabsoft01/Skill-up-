import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { UserCircle, Briefcase, ChevronRight, Loader2, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function Onboarding() {
  const { user, profile, setProfile } = useAuthStore();
  const navigate = useNavigate();
  const [role, setRole] = useState<'client' | 'freelancer' | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  // If profile exists, redirect out
  if (profile) {
    if (profile.role === 'client') navigate('/client');
    else navigate('/freelancer');
    return null;
  }

  const handleComplete = async () => {
    if (!user || !role) return;
    setLoading(true);
    try {
      const newProfile = {
        uid: user.uid,
        email: user.email!,
        role: role,
        displayName: user.displayName || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        walletBalance: 0
      };
      await setDoc(doc(db, 'users', user.uid), newProfile);
      setProfile(newProfile as any); // Optimistic update
      navigate(role === 'client' ? '/client' : '/freelancer');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `users/${user.uid}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
         <div className="text-center mb-8">
            <h2 className="text-3xl font-display font-bold text-gray-900">
               Welcome to SkillLink Pro
            </h2>
            <p className="mt-2 text-gray-600">Let's personalize your experience</p>
         </div>

         <div className="bg-white py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-gray-100">
            {step === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h3 className="text-xl font-semibold mb-6">How do you want to use the platform?</h3>
                <div className="space-y-4">
                  <button 
                    onClick={() => setRole('client')}
                    className={`w-full flex items-center p-4 border rounded-xl transition-all ${role === 'client' ? 'border-brand-600 ring-1 ring-brand-600 bg-brand-50' : 'border-gray-200 hover:border-brand-300'}`}
                  >
                    <div className={`p-3 rounded-lg mr-4 ${role === 'client' ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                      <UserCircle className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-medium text-gray-900">I'm a Client, hiring for a project</h4>
                      <p className="text-sm text-gray-500">Find, hire, and work with the best talent.</p>
                    </div>
                    {role === 'client' && <CheckCircle2 className="ml-auto text-brand-600 w-6 h-6" />}
                  </button>

                  <button 
                    onClick={() => setRole('freelancer')}
                    className={`w-full flex items-center p-4 border rounded-xl transition-all ${role === 'freelancer' ? 'border-brand-600 ring-1 ring-brand-600 bg-brand-50' : 'border-gray-200 hover:border-brand-300'}`}
                  >
                    <div className={`p-3 rounded-lg mr-4 ${role === 'freelancer' ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-medium text-gray-900">I'm a Freelancer, looking for work</h4>
                      <p className="text-sm text-gray-500">Find jobs, submit bids, and get paid securely.</p>
                    </div>
                    {role === 'freelancer' && <CheckCircle2 className="ml-auto text-brand-600 w-6 h-6" />}
                  </button>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    disabled={!role}
                    onClick={() => setStep(2)}
                    className="flex items-center px-6 py-3 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 disabled:opacity-50 transition-colors"
                  >
                    Continue <ChevronRight className="ml-2 w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h3 className="text-xl font-semibold mb-4">You're almost there!</h3>
                <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl mb-8">
                  <h4 className="font-semibold text-brand-900 mb-2">Escrow Protection Guarantee</h4>
                  <p className="text-sm text-brand-700">
                    SkillLink Pro uses a secure Escrow wallet system.
                    Clients deposit funds upfront, and freelancers are guaranteed payment upon successful delivery.
                  </p>
                </div>

                <div className="flex justify-between items-center mt-8">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-3 text-gray-500 hover:text-gray-700 font-medium transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleComplete}
                    disabled={loading}
                    className="flex items-center px-6 py-3 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 disabled:opacity-50 transition-colors"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                    Complete Setup
                  </button>
                </div>
              </motion.div>
            )}
         </div>
      </div>
    </div>
  );
}
