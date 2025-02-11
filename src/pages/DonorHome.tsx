import React from 'react';
import { motion } from 'framer-motion';
import { Package, Calendar, TrendingUp, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DonorHome = () => {
  const navigate = useNavigate();
  // Dummy data for donations
  const donorName = "Sarah Johnson";
  const donationStats = {
    totalDonations: 15,
    itemsDonated: 47,
    lastDonation: "2024-02-15",
    impactScore: 850
  };

  const recentDonations = [
    { month: 'Jan', items: 5 },
    { month: 'Feb', items: 8 },
    { month: 'Mar', items: 12 },
    { month: 'Apr', items: 4 },
    { month: 'May', items: 15 },
    { month: 'Jun', items: 10 },
    { month: 'Jul', items: 7 },
    { month: 'Aug', items: 9 },
    { month: 'Sep', items: 13 },
    { month: 'Oct', items: 6 },
    { month: 'Nov', items: 11 },
    { month: 'Dec', items: 14 }
  ];

  const maxItems = Math.max(...recentDonations.map(d => d.items), 1);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-rose-500 to-rose-600 rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome back, {donorName}!
              </h1>
              <p className="text-rose-100">
                Your generosity continues to make a difference in our community.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/donateitems')}
              className="bg-white text-rose-600 px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
            >
              Make a Donation
            </motion.button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <div className="flex items-center">
              <Package className="h-8 w-8 text-rose-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Donations</p>
                <p className="text-2xl font-semibold text-gray-900">{donationStats.totalDonations}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-rose-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Items Donated</p>
                <p className="text-2xl font-semibold text-gray-900">{donationStats.itemsDonated}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-rose-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Last Donation</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {new Date(donationStats.lastDonation).toLocaleDateString()}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-md p-6"
          >
            <div className="flex items-center">
              <Award className="h-8 w-8 text-rose-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Impact Score</p>
                <p className="text-2xl font-semibold text-gray-900">{donationStats.impactScore}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Donation Chart */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Donation History</h2>
          <div className="h-64 flex items-end space-x-2">
            {recentDonations.map((donation, index) => (
              <div key={donation.month} className="flex-1 flex flex-col items-center">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(donation.items / maxItems) * 100}%` }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="w-8 bg-rose-500 rounded-t-lg"
                  style={{ originY: 1 }}
                />
                <div className="mt-2 text-sm font-medium text-gray-600">{donation.month}</div>
                <div className="text-xs text-gray-500">{donation.items} items</div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DonorHome;