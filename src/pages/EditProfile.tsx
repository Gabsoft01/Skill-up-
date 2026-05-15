import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { UserCircle, Save, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function EditProfile() {
  const { profile, fetchProfile } = useAuthStore();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [skills, setSkills] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || '');
      setBio(profile.bio || '');
      setSkills(profile.skills?.join(', ') || '');
      setCountry(profile.country || '');
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const dbDoc = doc(db, 'users', profile.uid);
      const skillsArray = skills.split(',').map(s => s.trim()).filter(s => s.length > 0);
      
      await updateDoc(dbDoc, {
        displayName,
        bio,
        skills: skillsArray,
        country,
      });
      
      await fetchProfile(profile.uid);
      
      if (profile.role === 'client') {
        navigate('/client');
      } else {
        navigate('/freelancer');
      }
    } catch (err: any) {
      handleFirestoreError(err, OperationType.UPDATE, 'users');
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-8 sm:p-10">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center">
              <UserCircle className="w-8 h-8 text-brand-600" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-gray-900">Edit Profile</h1>
              <p className="text-gray-500">Update your personal information and skills.</p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
                Display Name
              </label>
              <input
                id="displayName"
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                id="bio"
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                placeholder={`Tell us about yourself...`}
              />
            </div>

            {profile.role === 'freelancer' && (
              <div>
                <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
                  Skills (comma separated)
                </label>
                <input
                  id="skills"
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                  placeholder="React, Node.js, Design"
                />
              </div>
            )}

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                Location (Country)
              </label>
              <input
                id="country"
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                placeholder="United States"
              />
            </div>

            <div className="pt-4 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <Save className="w-5 h-5 mr-2" />
                )}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
