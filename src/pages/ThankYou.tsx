import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

interface ConditionMultipliers {
  "New": number;
  "Gently Used": number;
  "Moderately Used": number;
  "Slightly Damaged": number;
}

interface Badge {
  name: string;
  color: string;
}

const conditionMultiplier: ConditionMultipliers = {
  "New": 2.0,
  "Gently Used": 1.5,
  "Moderately Used": 1.2,
  "Slightly Damaged": 1.0,
};

const getBadge = (totalScore: number): Badge => {
  if (totalScore >= 500) return { name: "Diamond", color: "text-blue-900" };
  if (totalScore >= 400) return { name: "Obsidian", color: "text-gray-800" };
  if (totalScore >= 300) return { name: "Pearl", color: "text-gray-400" };
  if (totalScore >= 200) return { name: "Amethyst", color: "text-purple-600" };
  if (totalScore >= 150) return { name: "Emerald", color: "text-green-600" };
  if (totalScore >= 100) return { name: "Ruby", color: "text-red-600" };
  if (totalScore >= 75) return { name: "Sapphire", color: "text-blue-600" };
  if (totalScore >= 50) return { name: "Gold", color: "text-yellow-500" };
  if (totalScore >= 25) return { name: "Silver", color: "text-gray-500" };
  return { name: "Bronze", color: "text-orange-500" };
};

const calculateDonationScore = (quantity: number, condition: keyof ConditionMultipliers): number => {
  const multiplier = conditionMultiplier[condition] ?? 1.0;
  return quantity * multiplier;
};

const ThankYouPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { numberOfItems?: number; condition?: keyof ConditionMultipliers; donorId?: string } | null;

  const numberOfItems = state?.numberOfItems ?? 1;
  const condition = state?.condition && conditionMultiplier[state.condition] ? state.condition : "New";
  const donorId = state?.donorId ?? "";

  const [totalScore, setTotalScore] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchDonorData = async () => {
      try {
        if (!donorId) return;
    
        const response = await fetch(`http://localhost:5000/api/donor/${donorId}`);
        if (!response.ok) throw new Error("Failed to fetch donor data");
    
        const donorData = await response.json();
        console.log("Fetched donor data:", donorData);
    
        const updatedTotalScore = (donorData.totalScore ?? 0) + calculateDonationScore(numberOfItems, condition);
        setTotalScore(updatedTotalScore);
      } catch (error) {
        console.error("Error fetching donor data:", error);
      }
    };    

    fetchDonorData();
  }, [donorId, numberOfItems, condition]);

  const handleBadgeAssignment = async () => {
    setErrorMessage("");

    if (!donorId) {
      setErrorMessage("Donor ID is missing. Please try again.");
      return;
    }

    try {
      const badge = getBadge(totalScore);

      const payload = {
        donor_id: donorId.toString(),
        numberOfItems,
        condition,
        badge: badge.name,
        totalScore,
        lastDonation: new Date().toISOString(),
      };

      console.log("Sending payload:", payload);

      const updateResponse = await fetch("http://localhost:5000/api/badges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!updateResponse.ok) throw new Error("Failed to update badge");

      navigate("/donorhome");
    } catch (error) {
      setErrorMessage(`Failed to assign badge: ${error}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg text-center">
        <CheckCircle className="h-16 w-16 text-rose-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Thank You for Your Donation!</h1>
        <p className="text-gray-600 mb-6">Your generous contribution will help those in need. We appreciate your support!</p>

        <div className={`text-2xl font-bold ${getBadge(totalScore).color} mb-4`}>
          🎖️ You earned the <span className="capitalize">{getBadge(totalScore).name}</span> badge!
        </div>

        {errorMessage && <p className="text-red-600">{errorMessage}</p>}

        <motion.button onClick={handleBadgeAssignment} className="mt-4 px-6 py-3 bg-rose-600 text-white font-semibold rounded-lg shadow-md transition hover:bg-rose-700">
          Back to Home
        </motion.button>
      </div>
    </div>
  );
};

export default ThankYouPage;
