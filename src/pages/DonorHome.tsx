import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Package, Calendar, Award, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Chart.js Imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Donor {
  full_name: string;
  address: string;
  phone_number: string;
  donation_preferences: string[];
  total_donations: number; // Total donations for the whole year
  items_donated: number; // Items donated for the current month (if donation data is monthly, update accordingly)
  last_donation: string;
  badge_type: string;
}

interface Donor {
  full_name: string;
  address: string;
  phone_number: string;
  donation_preferences: string[];
  total_donations: number; // Total donations for the whole year
  items_donated: number; // Items donated for the current month (if donation data is monthly, update accordingly)
  last_donation: string;
  badge_type: string;
}

const DonorHome = () => {
  const navigate = useNavigate();
  const [donor, setDonor] = useState<Donor | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDonorDetails = async () => {
      const donorId = localStorage.getItem("donor_id");
      const token = localStorage.getItem("token");
    
      if (!donorId) {
        console.error("❌ Donor ID missing in LocalStorage");
        setIsLoading(false);
        return;
      }
    
      try {
        const response = await axios.get(
          `http://localhost:5000/api/donor/${donorId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
    
        setDonor(response.data);
      } catch (error) {
        console.error("❌ Error fetching donor data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    

    fetchDonorDetails();
  }, []);

  // Fallback values in case no donation has been made
  const donationStats = {
    total_donations: donor?.total_donations ?? 0,
    items_donated: donor?.items_donated ?? 0,
    last_donation: donor?.last_donation || "N/A",
    badge_type: donor?.badge_type ?? "Bronze",
  };

  // Build monthly data for the chart.
  // We assume that if any donation is made this year,
  // it is reflected in the current month.
  const months = [
    "Jan 2025",
    "Feb 2025",
    "Mar 2025",
    "Apr 2025",
    "May 2025",
    "Jun 2025",
    "Jul 2025",
    "Aug 2025",
    "Sep 2025",
    "Oct 2025",
    "Nov 2025",
    "Dec 2025",
  ];

  // Get current month index (0-based)
  const currentMonthIndex = new Date().getMonth();

  // Create an array with 12 months all set to 0
  const monthlyDonations = new Array(12).fill(0);

  // If there's a donation for this year, reflect it only in the current month
  if (donationStats.items_donated > 0) {
    monthlyDonations[currentMonthIndex] = donationStats.items_donated;
  }

  const chartData = {
    labels: months,
    datasets: [
      {
        label: "Items Donated",
        data: monthlyDonations,
        borderColor: "rgba(244, 63, 94, 1)", // rose-500
        backgroundColor: "rgba(244, 63, 94, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        min: 0, // Only show positive values
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `Items Donated Over (${new Date().getFullYear()})`,
      },
    },
  };

  if (isLoading) {
    return (
      <p className="text-center text-gray-600">Loading donor details...</p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <div className="bg-gradient-to-r from-rose-500 to-rose-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <h1 className="text-3xl font-bold mb-2">
            {donor ? `Welcome back, ${donor.full_name}!` : "Welcome!"}
          </h1>
          <p>
            Your generosity continues to make a difference in our community.
          </p>
          <hr className="my-2 border-gray-300" />
          {donor && (
            <div className="mb-4 space-y-2">
              <div className="flex items-center">
                <span className="font-semibold text-lg">Address:</span>
                <span className="ml-2 text-lg">{donor.address}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold text-lg">Phone:</span>
                <span className="ml-2 text-lg">{donor.phone_number}</span>
              </div>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/donateitems")}
            className="bg-white text-rose-600 px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all mt-4"
          >
            Make a Donation
          </motion.button>
        </div>

        {/* Statistic Boxes in a single row */}
        <div className="flex flex-wrap justify-between gap-4 mb-8">
          <motion.div className="flex-1 min-w-[200px] bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-rose-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Total Donations
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {donationStats.total_donations}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div className="flex-1 min-w-[200px] bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-rose-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Items Donated ({months[currentMonthIndex]})
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {donationStats.items_donated}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div className="flex-1 min-w-[200px] bg-white rounded-xl shadow-md p-6">
          {donor && (
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-rose-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Last Donation
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {donor.last_donation}
                </p>
              </div>
            </div>
          )}
          </motion.div>

          <motion.div className="flex-1 min-w-[200px] bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-rose-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Badge
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {donationStats.badge_type}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Chart displaying donation trend with only positive y-axis values */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <Line data={chartData} options={chartOptions} />
        </div>
      </motion.div>
    </div>
  );
};

export default DonorHome;
