import { useState, useRef, ChangeEvent } from "react";
import { useNavigate} from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Camera, Loader, CheckCircle, Search } from "lucide-react";
import axios from "axios";

const DonationItems = () => {
  const navigate = useNavigate();
  const [selectedCondition, setSelectedCondition] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [numberOfItems, setNumberOfItems] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiResponse, setApiResponse] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false); // New state to track analysis completion
  const [customCategory, setCustomCategory] = useState("");
  const [category, setCategory] = useState("");
  

  // Updated with type annotation
  const handleImageCapture = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setIsAnalyzed(false); // Reset analysis status when a new image is uploaded
    }
  };

  const handleImageClick = async () => {
    if (!image) return;

    setAnalyzing(true);
    setIsAnalyzed(false); // Reset analysis status before starting

    try {
      const formData = new FormData();
      formData.append("image", image);

      const response = await axios.post(
        "http://localhost:5000/api/analyze-image",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setApiResponse(response.data?.description || "No description available.");
      setIsAnalyzed(true); // Set to true when analysis completes successfully
    } catch (error) {
      console.error("Error analyzing image:", error);
      setApiResponse("Error analyzing image.");
      setIsAnalyzed(false);
    } finally {
      setAnalyzing(false);
    }
  };

  const conditions = [
    {
      value: "new",
      label: "New",
      description: "Brand new, unworn clothing with tags",
    },
    {
      value: "gently_used",
      label: "Gently Used",
      description: "Worn a few times but in excellent condition",
    },
    {
      value: "moderately_used",
      label: "Moderately Used",
      description: "Visible signs of wear but no major defects",
    },
    {
      value: "slightly_damaged",
      label: "Slightly Damaged",
      description: "Minor tears, missing buttons, or light stains",
    },
  ];

  const categories = [
    {
      value: "Cloths",
      description: "All types of clothing for adults and children",
    },
    {
      value: "Non-perishable Food",
      description: "Canned goods, dried foods, and other non-perishable items",
    },
    {
      value: "School Supplies",
      description: "Notebooks, pencils, backpacks, and other school essentials",
    },
    {
      value: "Hygiene Products",
      description: "Soap, shampoo, toothbrushes, and other hygiene items",
    },
    {
      value: "Baby Supplies",
      description: "Diapers, wipes, formula, and other baby necessities",
    },
    { value: "Books", description: "New or gently used books for all ages" },
  ];

  // Updated openCamera with null check
  const openCamera = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async () => {
    if (!selectedCondition || numberOfItems < 1 || !isAnalyzed) {
      alert("Please complete all fields and ensure image analysis is done.");
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      const donorId = localStorage.getItem("donor_id"); // ✅ Get donorId properly
  
      if (!donorId) {
        throw new Error("❌ Donor ID not found in localStorage");
      }
  
      const response = await fetch("http://localhost:5000/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donor_id: donorId,
          category: category === "other" ? customCategory : category,
          numberOfItems,
          condition: selectedCondition, // ✅ Use correct variable
          additional_notes: notes,
          donation_date: new Date().toISOString(),
          image_url: image || "",
          ai_response: apiResponse,
        }),
      });
  
      if (response.ok) {
        navigate("/thankyou", {
          state: { numberOfItems, condition: selectedCondition, donorId }, // ✅ Pass correct data
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit donation");
      }
    } catch (error) {
      console.error("❌ Error submitting donation:", error);
      alert("Failed to submit donation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }; 
    

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Items
          </button>
        </div>
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Item Details
          </h1>
          <p className="text-gray-600">Please provide details about item</p>
        </div>

        {/*category selection*/}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Select Item Category
          </h2>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.value}
              </option>
            ))}
            <option value="other">Other</option>
          </select>

          {/* Show textarea if 'Other' is selected */}
          {category === "other" && (
            <input
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="Enter item category..."
              className="w-full mt-4 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          )}
        </div>

        {/* Condition Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Select Item Condition
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {conditions.map((condition) => (
              <motion.button
                key={condition.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCondition(condition.value)}
                className={`p-4 rounded-lg border-2 text-left ${
                  selectedCondition === condition.value
                    ? "border-rose-500 bg-rose-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">
                    {condition.label}
                  </span>
                  {selectedCondition === condition.value && (
                    <CheckCircle className="h-5 w-5 text-rose-500" />
                  )}
                </div>
                <p className="text-sm text-gray-600">{condition.description}</p>
              </motion.button>
            ))}
          </div>
        </div>
        {/* Number of Items */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Number of Items
          </h2>
          <input
            type="number"
            value={numberOfItems || ""}
            onChange={(e) => setNumberOfItems(Number(e.target.value))}
            min="1"
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            placeholder="Enter the number of items"
          />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4 md:w-full">
          Add Item Photo & Image Analysis
        </h2>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Heading Covering Both Sections */}

          {/* Left Section - Image Upload */}
          <div className="md:w-1/2 flex flex-col h-full mb-4">
            <div className="flex flex-col items-center flex-1">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                capture="environment"
                onChange={handleImageCapture}
                className="hidden"
              />

              {image ? (
                <div className="relative w-full max-w-md h-72">
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Captured item"
                    className="w-full h-full object-cover rounded-lg cursor-pointer"
                    onClick={handleImageClick}
                  />
                  <div className="absolute bottom-4 right-4 flex space-x-2">
                    <button
                      onClick={openCamera}
                      className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-50"
                    >
                      <Camera className="h-6 w-6 text-gray-600" />
                    </button>
                    <button
                      onClick={handleImageClick}
                      className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-50"
                    >
                      <Search className="h-6 w-6 text-gray-600" />
                    </button>
                  </div>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={openCamera}
                  className="w-full max-w-md h-72 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100"
                >
                  <Camera className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-sm text-gray-600">Click to take a photo</p>
                </motion.button>
              )}
            </div>
          </div>

          {/* Right Section - Image Analysis */}
          <div className="md:w-1/2 flex flex-col h-full">
            <div className="bg-white rounded-lg shadow-md p-4 flex-1 mb-4">
              {analyzing ? (
                <div className="animate-pulse text-gray-500">
                  Analyzing image...
                </div>
              ) : (
                <div className="relative h-64">
                  <textarea
                    readOnly
                    value={apiResponse}
                    className="w-full p-4 bg-gray-50 rounded-md border border-gray-200 text-sm resize-none h-full"
                    placeholder="Image analysis results will appear here..."
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Additional Notes */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Additional Notes
          </h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional details about the item..."
            className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          />
        </div>
        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={ isSubmitting || !selectedCondition || numberOfItems < 1 || !isAnalyzed}
          className={`w-full py-4 rounded-lg font-semibold text-white ${
            isSubmitting || !selectedCondition || numberOfItems < 1 || !isAnalyzed
              ? "bg-gray-400"
              : "bg-rose-600 hover:bg-rose-700"
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <Loader className="animate-spin h-5 w-5 mr-2" />
              Submitting...
            </span>
          ) : (
            "Submit Donation"
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default DonationItems;