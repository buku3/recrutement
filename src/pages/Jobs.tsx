import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BriefcaseIcon, MapPinIcon, CurrencyIcon } from 'lucide-react';
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

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchJobs = async () => {
      const db = getDb();
      const result = await db.execute('SELECT * FROM jobs ORDER BY createdAt DESC');
      setJobs(result.rows as Job[]);
    };
    fetchJobs();
  }, []);

  if (jobs.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-2 text-lg font-medium text-gray-900">No job offers available</h2>
          <p className="mt-1 text-sm text-gray-500">
            Check back later for new opportunities
          </p>
          {user?.isAdmin && (
            <Link
              to="/jobs/create"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Create Job Offer
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Job Offers</h1>
        {user?.isAdmin && (
          <Link
            to="/jobs/create"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Create Job Offer
          </Link>
        )}
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <Link
            key={job.id}
            to={`/jobs/${job.id}`}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h2>
              <div className="flex items-center text-gray-500 mb-2">
                <BriefcaseIcon className="h-4 w-4 mr-2" />
                <span>{job.company}</span>
              </div>
              <div className="flex items-center text-gray-500 mb-2">
                <MapPinIcon className="h-4 w-4 mr-2" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center text-gray-500">
                <CurrencyIcon className="h-4 w-4 mr-2" />
                <span>{job.salary}</span>
              </div>
              <p className="mt-4 text-gray-600 line-clamp-3">{job.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}