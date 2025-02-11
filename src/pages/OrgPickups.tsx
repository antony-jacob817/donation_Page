import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Calendar, Clock, User, Package, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PickupRequest {
  id: number;
  donorName: string;
  address: string;
  date: string;
  time: string;
  items: string[];
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
}

const pickupRequests: PickupRequest[] = [
  {
    id: 1,
    donorName: "Sarah Johnson",
    address: "123 Main St, Cityville",
    date: "2024-03-15",
    time: "10:00 AM",
    items: ["Winter Coats", "School Supplies"],
    status: 'pending'
  },
  {
    id: 2,
    donorName: "Michael Brown",
    address: "456 Oak Ave, Townsburg",
    date: "2024-03-15",
    time: "2:30 PM",
    items: ["Non-perishable Food", "Books", "Baby Supplies"],
    status: 'accepted'
  },
  {
    id: 3,
    donorName: "Emily Davis",
    address: "789 Pine Rd, Villageton",
    date: "2024-03-16",
    time: "11:15 AM",
    items: ["Hygiene Products"],
    status: 'pending'
  },
  {
    id: 4,
    donorName: "James Wilson",
    address: "321 Elm St, Hamletville",
    date: "2024-03-16",
    time: "3:45 PM",
    items: ["Winter Coats", "Non-perishable Food", "Books"],
    status: 'pending'
  }
];

const PickupRequests = () => {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredRequests = selectedStatus === 'all'
    ? pickupRequests
    : pickupRequests.filter(request => request.status === selectedStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/OrgHome')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
        </div>

        {/* Title and Filters */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Pickup Requests</h1>
          <div className="flex space-x-4">
            {['all', 'pending', 'accepted', 'completed', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  selectedStatus === status
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-6">
          {filteredRequests.map((request) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-blue-500 mr-2" />
                    <h3 className="text-xl font-semibold text-gray-900">{request.donorName}</h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-600">{request.address}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-600">{new Date(request.date).toLocaleDateString()}</span>
                    <Clock className="h-5 w-5 text-gray-400 ml-4 mr-2" />
                    <span className="text-gray-600">{request.time}</span>
                  </div>
                </div>

                <div className="flex items-center mb-4">
                  <Package className="h-5 w-5 text-gray-400 mr-2" />
                  <div className="flex flex-wrap gap-2">
                    {request.items.map((item, index) => (
                      <span
                        key={index}
                        className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {request.status === 'pending' && (
                  <div className="flex space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center"
                    >
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Accept Pickup
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center justify-center"
                    >
                      <XCircle className="h-5 w-5 mr-2" />
                      Decline
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PickupRequests;