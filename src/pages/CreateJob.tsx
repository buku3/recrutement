import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getDb } from '../lib/db';
import { useAuth } from '../contexts/AuthContext';

export default function CreateJob() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    requirements: '',
    salary: ''
  });

  if (!user?.isAdmin) {
    navigate('/');
    return null;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const db = getDb();
      await db.execute({
        sql: `INSERT INTO jobs (title, company, location, description, requirements, salary)
              VALUES (?, ?, ?, ?, ?, ?)`,
        args: [
          formData.title,
          formData.company,
          formData.location,
          formData.description,
          formData.requirements,
          formData.salary
        ]
      });
      
      toast.success('Job offer created successfully!');
      navigate('/jobs');
    } catch (error) {
      toast.error('Failed to create job offer.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create Job Offer</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-sm rounded-lg p-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Job Title
          </label>
          <input
            type="text"
            name="title"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700">
            Company
          </label>
          <input
            type="text"
            name="company"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.company}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            name="location"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.location}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="salary" className="block text-sm font-medium text-gray-700">
            Salary
          </label>
          <input
            type="text"
            name="salary"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.salary}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Job Description
          </label>
          <textarea
            name="description"
            rows={4}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="requirements" className="block text-sm font-medium text-gray-700">
            Requirements
          </label>
          <textarea
            name="requirements"
            rows={4}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.requirements}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Job Offer
          </button>
        </div>
      </form>
    </div>
  );
}