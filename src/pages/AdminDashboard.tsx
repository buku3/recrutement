import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getDb } from '../lib/db';
import { useAuth } from '../contexts/AuthContext';

interface Application {
  id: number;
  jobId: number;
  userId: number;
  status: string;
  createdAt: string;
  job: {
    title: string;
  };
  user: {
    fullName: string;
    username: string;
  };
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/');
      return;
    }

    const fetchApplications = async () => {
      const db = getDb();
      const result = await db.execute(`
        SELECT 
          a.*,
          j.title as job_title,
          u.fullName as user_fullName,
          u.username as user_username
        FROM applications a
        JOIN jobs j ON a.jobId = j.id
        JOIN users u ON a.userId = u.id
        ORDER BY a.createdAt DESC
      `);

      const formattedApplications = result.rows.map((row: any) => ({
        id: row.id,
        jobId: row.jobId,
        userId: row.userId,
        status: row.status,
        createdAt: row.createdAt,
        job: {
          title: row.job_title
        },
        user: {
          fullName: row.user_fullName,
          username: row.user_username
        }
      }));

      setApplications(formattedApplications);
    };

    fetchApplications();
  }, [user, navigate]);

  const handleStatusChange = async (applicationId: number, newStatus: string) => {
    try {
      const db = getDb();
      await db.execute({
        sql: 'UPDATE applications SET status = ? WHERE id = ?',
        args: [newStatus, applicationId]
      });

      setApplications(applications.map(app => 
        app.id === applicationId ? { ...app, status: newStatus } : app
      ));

      toast.success('Application status updated successfully');
    } catch (error) {
      toast.error('Failed to update application status');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Applications Dashboard</h1>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Applied
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map((application) => (
                <tr key={application.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {application.job.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{application.user.fullName}</div>
                    <div className="text-sm text-gray-500">{application.user.username}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(application.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        application.status === 'accepted' ? 'bg-green-100 text-green-800' : 
                        'bg-red-100 text-red-800'}`}>
                      {application.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <select
                      value={application.status}
                      onChange={(e) => handleStatusChange(application.id, e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="accepted">Accept</option>
                      <option value="rejected">Reject</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}