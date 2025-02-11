import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Truck, Clock, CheckCircle, XCircle, TrendingUp } from 'lucide-react';

const OrgHome = () => {
  const navigate = useNavigate();
  const orgName = "Hope Community Center";

  // Dummy data for pickup statistics
  const pickupStats = {
    totalPickups: 324,
    pendingPickups: 12,
    completedToday: 8,
    cancelledToday: 2,
    successRate: 95
  };

  // Dummy data for weekly pickup trends
  const weeklyPickups = [
    { day: 'Mon', completed: 15, pending: 3 },
    { day: 'Tue', completed: 12, pending: 4 },
    { day: 'Wed', completed: 18, pending: 2 },
    { day: 'Thu', completed: 14, pending: 5 },
    { day: 'Fri', completed: 16, pending: 3 },
    { day: 'Sat', completed: 10, pending: 2 },
    { day: 'Sun', completed: 8, pending: 1 }
  ];

  // Dummy data for pickup time distribution
  const timeDistribution = [
    { time: '8-10', count: 25 },
    { time: '10-12', count: 40 },
    { time: '12-2', count: 30 },
    { time: '2-4', count: 35 },
    { time: '4-6', count: 20 }
  ];

  const maxTimeCount = Math.max(...timeDistribution.map(t => t.count));

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome, {orgName}
              </h1>
              <p className="text-blue-100">
                Manage your donation pickups and track your impact
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/Orgpickups')}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all flex items-center"
            >
              <Truck className="mr-2 h-5 w-5" />
              View Pickup Requests
            </motion.button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <div className="flex items-center">
              <Truck className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Pickups</p>
                <p className="text-2xl font-semibold text-gray-900">{pickupStats.totalPickups}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Pickups</p>
                <p className="text-2xl font-semibold text-gray-900">{pickupStats.pendingPickups}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Completed Today</p>
                <p className="text-2xl font-semibold text-gray-900">{pickupStats.completedToday}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Success Rate</p>
                <p className="text-2xl font-semibold text-gray-900">{pickupStats.successRate}%</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weekly Pickup Trends */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Weekly Pickup Trends</h2>
            <div className="h-64 flex items-end space-x-4">
              {weeklyPickups.map((day, index) => (
                <div key={day.day} className="flex-1 flex flex-col items-center">
                  <div className="w-full flex flex-col items-center space-y-1">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(day.pending / 20) * 100}%` }}
                      transition={{ delay: index * 0.1 }}
                      className="w-full bg-blue-200 rounded-t"
                      style={{ maxWidth: '24px' }}
                    />
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(day.completed / 20) * 100}%` }}
                      transition={{ delay: index * 0.1 }}
                      className="w-full bg-blue-500 rounded-t"
                      style={{ maxWidth: '24px' }}
                    />
                  </div>
                  <div className="mt-2 text-sm font-medium text-gray-600">{day.day}</div>
                  <div className="text-xs text-gray-500">{day.completed + day.pending}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4 space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded mr-2" />
                <span className="text-sm text-gray-600">Completed</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-200 rounded mr-2" />
                <span className="text-sm text-gray-600">Pending</span>
              </div>
            </div>
          </motion.div>

          {/* Pickup Time Distribution */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Pickup Time Distribution</h2>
            <div className="h-64 flex items-end space-x-4">
              {timeDistribution.map((slot, index) => (
                <div key={slot.time} className="flex-1 flex flex-col items-center">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(slot.count / maxTimeCount) * 100}%` }}
                    transition={{ delay: index * 0.1 }}
                    className="w-full bg-blue-500 rounded-t"
                    style={{ maxWidth: '32px' }}
                  />
                  <div className="mt-2 text-sm font-medium text-gray-600">{slot.time}</div>
                  <div className="text-xs text-gray-500">{slot.count} pickups</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default OrgHome;