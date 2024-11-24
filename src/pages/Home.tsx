import React from 'react';
import { Link } from 'react-router-dom';
import { SearchIcon, BriefcaseIcon, UserPlusIcon } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Find Your Dream Job with
            <span className="text-indigo-600"> JobHub</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Connect with top employers and discover opportunities that match your skills and aspirations.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="flex justify-center">
              <SearchIcon className="h-12 w-12 text-indigo-600" />
            </div>
            <h3 className="mt-4 text-xl font-semibold">Search Jobs</h3>
            <p className="mt-2 text-gray-600">Browse through our extensive collection of job listings</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="flex justify-center">
              <BriefcaseIcon className="h-12 w-12 text-indigo-600" />
            </div>
            <h3 className="mt-4 text-xl font-semibold">Apply Easily</h3>
            <p className="mt-2 text-gray-600">Simple and straightforward application process</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="flex justify-center">
              <UserPlusIcon className="h-12 w-12 text-indigo-600" />
            </div>
            <h3 className="mt-4 text-xl font-semibold">Create Profile</h3>
            <p className="mt-2 text-gray-600">Build your professional profile to stand out</p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <Link
            to="/register"
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:text-lg"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}