import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, Target } from 'lucide-react';

const FeaturedCauses = () => {
  const causes = [
    {
      title: 'Education for All',
      description: 'Help provide educational resources to underprivileged children',
      image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1650&q=80',
      goal: 50000,
      raised: 32000,
      donors: 245,
    },
    {
      title: 'Food Security Initiative',
      description: 'Support local food banks in providing meals to families in need',
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1650&q=80',
      goal: 25000,
      raised: 18750,
      donors: 163,
    },
    {
      title: 'Medical Aid Program',
      description: 'Provide essential medical supplies to rural communities',
      image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1650&q=80',
      goal: 75000,
      raised: 45000,
      donors: 312,
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Featured Causes
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Join these meaningful initiatives and make a real difference in people's lives
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {causes.map((cause, index) => (
            <motion.div
              key={cause.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col rounded-lg shadow-lg overflow-hidden"
            >
              <div className="flex-shrink-0">
                <img className="h-48 w-full object-cover" src={cause.image} alt={cause.title} />
              </div>
              <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">{cause.title}</h3>
                  <p className="mt-3 text-base text-gray-500">{cause.description}</p>
                </div>
                <div className="mt-6">
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-rose-600">
                          {Math.round((cause.raised / cause.goal) * 100)}%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-rose-200">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(cause.raised / cause.goal) * 100}%` }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-rose-500"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <div className="flex items-center">
                      <Target className="h-4 w-4 text-rose-500 mr-1" />
                      Goal: ${cause.goal.toLocaleString()}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-rose-500 mr-1" />
                      {cause.donors} Donors
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700"
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Donate Now
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCauses;