import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { BriefcaseIcon, MapPinIcon, CurrencyIcon, ClipboardListIcon } from 'lucide-react';
import { getDb } from '../lib/db';
import { useAuth } from '../contexts/AuthContext';

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string;
  salary: string;
  createdAt: string;
}

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      const db = getDb();
      const result = await db.execute({
        sql: 'SELECT * FROM jobs WHERE id = ?',
        args: [id]
      });

      if (result.rows.length) {
        setJob(result.rows[0] as Job);

        if (user) {
          const applicationResult = await db.execute({
            sql: 'SELECT * FROM applications WHERE jobId = ? AND userId = ?',
            args: [id, user.id]
          });
          setHasApplied(applicationResult.rows.length > 0);
        }
      } else {
        navigate('/jobs');
      }
    };
    fetchJob();
  }, [id, user]);

  const handleApply = async () => {
    if (!user) {
      toast.error('Please login to apply for this job');
      navigate('/login');
      return;
    }

    try {
      const db = getDb();
      await db.execute({
        sql: 'INSERT INTO applications (jobId, userId) VALUES (?, ?)',
        args: [id, user.id]
      });
      setHasApplied(true);
      toast.success('Application submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit application');
    }
  };

  if (!job) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{job.title}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="flex items-center text-gray-600">
              <BriefcaseIcon className="h-5 w-5 mr-2" />
              <span>{job.company}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <MapPinIcon className="h-5 w-5 mr-2" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <CurrencyIcon className="h-5 w-5 mr-2" />
              <span>{job.salary}</span>
            </div>
          </div>

          <div className="prose max-w-none mb-8">
            <h2 className="text-xl font-semibold mb-4">Job Description</h2>
            <p className="whitespace-pre-line">{job.description}</p>
          </div>

          <div className="prose max-w-none mb-8">
            <h2 className="text-xl font-semibold mb-4">Requirements</h2>
            <p className="whitespace-pre-line">{job.requirements}</p>
          </div>

          {!user?.isAdmin && (
            <div className="flex justify-end">
              <button
                onClick={handleApply}
                disabled={hasApplied}
                className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white
                  ${hasApplied
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
              >
                <ClipboardListIcon className="h-5 w-5 mr-2" />
                {hasApplied ? 'Already Applied' : 'Apply Now'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}