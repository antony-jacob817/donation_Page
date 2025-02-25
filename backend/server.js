import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import axios from "axios";
import ExifReader from "exifreader";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(express.json());

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:5000",
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ✅ Ensure Environment Variables Are Set
if (
  !process.env.MONGO_URI ||
  !process.env.JWT_SECRET ||
  !process.env.GEMINI_API_KEY
) {
  console.error(
    "❌ Missing required environment variables! Check your .env file."
  );
  process.exit(1);
}

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ User Schema & Model
const userSchema = new mongoose.Schema({
  full_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone_number: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  password: { type: String, required: true },
  user_type: { type: String, required: true }, // Can be "donor" or other roles
});

const User = mongoose.model("User", userSchema);

// ✅ IMAGE ANALYSIS ROUTE (Gemini AI)
const upload = multer({ storage: multer.memoryStorage() });

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Analyze image using Gemini + Reverse Search + EXIF analysis
async function analyzeImage(imageBuffer) {
  try {
    const base64Image = imageBuffer.toString("base64");

    if (!base64Image) {
      console.error("Failed to encode image.");
      return;
    }

    const prompt = `Analyze the given image carefully. Return with exactly four fields:
1. Type : A short, specific label for the primary subject. Type must be of Cloths, Non-perishable Food, School Supplies, Hygiene Products, Baby Supplies and Books. And if not in these type say Other.
2. Quantity: How many distinct items are visible? Provide an integer.
3. Google Image: "Yes" or "No" depending on whether you suspect it is found on Google. 
4. AI Generated: "Yes" or "No" depending on whether you suspect it was AI-generated.

Start with "Here is the analysis of the image:"`;

// Then pass it into generateContent
const result = await model.generateContent([
  { inlineData: { mimeType: "image/jpeg", data: base64Image } },
  prompt
]);

    console.log("Full Response:", result); // Debugging the full response

    // Try extracting the correct text format
    const responseText = result?.response?.text?.() || JSON.stringify(result);

    return responseText;
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw error;
  }
}

// **Reverse Image Search via Google Lens**
async function reverseImageSearch(imageBuffer) {
  try {
    const formData = new FormData();
    formData.append("encoded_image", imageBuffer, "image.jpg");

    const response = await axios.post("https://www.google.com/searchbyimage/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.request.res.responseUrl.includes("search") ? "Yes" : "No";
  } catch (error) {
    console.error("Reverse Image Search failed:", error);
    return "Unknown";
  }
}

// **EXIF Metadata Analysis for AI/Fake Detection**
async function analyzeExifMetadata(imageBuffer) {
  try {
    const metadata = await ExifReader.load(imageBuffer);
    
    // Check if critical EXIF data is missing (common in AI-generated images)
    const hasCameraInfo = metadata.Make || metadata.Model;
    const hasEditingSoftware = metadata.Software ? metadata.Software.includes("AI") : false;

    return {
      isFake: !hasCameraInfo || hasEditingSoftware,
      metadata,
    };
  } catch (error) {
    console.error("EXIF metadata analysis failed:", error);
    return { isFake: "Unknown", metadata: {} };
  }
}

// **Helper: Parse Gemini Response into JSON**
function parseGeminiResponse(responseText) {
  const lines = responseText.split("\n").map((line) => line.split(":").map((s) => s.trim()));
  const result = {};
  lines.forEach(([key, value]) => {
    if (key && value) {
      result[key.toLowerCase().replace(/\s+/g, "_")] = value;
    }
  });
  return result;
}

// Create the POST route for image analysis
app.post("/api/analyze-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file uploaded" });
    }

    const imageDescription = await analyzeImage(req.file.buffer);
    res.json({ description: imageDescription });
  } catch (error) {
    console.error("Error analyzing image:", error);
    res
      .status(500)
      .json({ error: "Image analysis failed", message: error.message });
  }
});


// ✅ Donor Registration Using User Model
app.post("/api/donor/register", async (req, res) => {
  try {
    const { full_name, email, phone_number, address, password } = req.body;

    if (!full_name || !email || !phone_number || !address || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Register donor as a user with "donor" role
    const newUser = new User({
      full_name,
      email,
      phone_number,
      address,
      password: hashedPassword,
      user_type: "donor", // Set user type as donor
    });

    await newUser.save();
    res.status(201).json({ message: "Donor registered successfully!" });
  } catch (error) {
    console.error("❌ Error registering donor:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
});

// ✅ Fetch Donor by ID
app.get("/api/donor/:id", async (req, res) => {
  const { id } = req.params;
  console.log("🔍 Received Donor ID:", id);

  try {
    // Validate ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      console.error("❌ Invalid Donor ID format:", id);
      return res.status(400).json({ message: "Invalid donor ID format" });
    }

    const donor = await User.findById(id);
    if (!donor) {
      console.log("❌ Donor not found in DB:", id);
      return res.status(404).json({ message: "Donor not found" });
    }

    res.json(donor);
  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// ✅ LOGIN ROUTE
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and Password are required" });
    }

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, user_type: user.user_type },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token, user });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
});

//Donation Items
const donationSchema = new mongoose.Schema({
  donor_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  category: { type: String, required: true }, // AI-detected or custom category
  numberOfItems: { type: Number, required: true },
  condition: { type: String, required: true }, // Item condition
  additional_notes: { type: String },
  donation_date: { type: Date, default: Date.now }, // Remove default: Date.now
  image_url: { type: String }, // Image URL
  ai_response: { type: String }, // AI analysis result
});

const Donation = mongoose.model("Donation", donationSchema);

app.post("/api/donations", async (req, res) => {
  console.log("📥 Received request:", req.body);

  let { donor_id, category, numberOfItems, condition, additional_notes, donation_date, image_url, ai_response } = req.body;

  // ✅ Ensure required fields are present
  if (!donor_id || !category || !numberOfItems || !condition) {
    return res.status(400).json({ message: "All required fields must be provided" });
  }

  // ✅ Ensure donor_id is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(donor_id)) {
    return res.status(400).json({ message: "Invalid donor ID format" });
  }

  // ✅ Fix `image_url` (if it's an object, convert it to an empty string)
  if (typeof image_url !== "string") {
    image_url = "";
  }

  try {
    const newDonation = new Donation({
      donor_id,
      category,
      numberOfItems,
      condition,
      additional_notes,
      donation_date,
      image_url,
      ai_response,
    });

    await newDonation.save();
    console.log("✅ Donation saved successfully!");
    res.status(201).json({ message: "Donation submitted successfully!" });
  } catch (error) {
    console.error("❌ Server error:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
});

// ✅ Badge Schema & Model (Updated)
const badgeSchema = new mongoose.Schema({
  donor_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  badge_type: { type: String, required: true },
  donation_date: { type: Date, required: true }, // Use device time
});

const Badge = mongoose.model("Badge", badgeSchema);

// ✅ Assign or Update Badge API
app.post("/api/badges", async (req, res) => {
  try {
    const { donor_id, badge } = req.body;

    if (!donor_id || !badge) {
      return res.status(400).json({ success: false, message: "Missing donor_id or badge" });
    }

    const existingBadge = await Badge.findOne({ donor_id });

    if (existingBadge) {
      // Update existing badge
      existingBadge.badge_type = badge;
      existingBadge.donation_date = new Date(); // Update donation date
      await existingBadge.save();
      return res.json({ success: true, message: "Badge updated successfully" });
    } else {
      // Create a new badge entry if none exists
      const newBadge = new Badge({
        donor_id,
        badge_type: badge,
        donation_date: new Date(),
      });
      await newBadge.save();
      return res.json({ success: true, message: "Badge assigned successfully" });
    }
  } catch (error) {
    console.error("❌ Error saving/updating badge:", error);
    res.status(500).json({ success: false, message: "Server error while saving/updating badge" });
  }
});

// ✅ Fetch Badges for a Donor
app.get("/api/badges/:donorId", async (req, res) => {
  try {
    const { donorId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(donorId)) {
      console.log("❌ Invalid donor ID:", donorId);
      return res.status(400).json({ message: "Invalid donor ID format" });
    }

    const badge = await Badge.findOne({ donor_id: donorId });
    if (!badge) {
      return res.status(404).json({ message: "No badge found for this donor" });
    }

    console.log("📜 Badge retrieved:", badge);
    res.json(badge);
  } catch (error) {
    console.error("❌ Error fetching badge:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
});

// ✅ Fetch All Donations
const router = express.Router();

router.get("/donor/:donorId", async (req, res) => {
  try {
    const { donorId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(donorId)) {
        return res.status(400).json({ message: "Invalid donor ID format" });
    }

    // Fetch donations for donor and sort by latest donation_date
    const donations = await Donation.find({ donor_id: donorId }).sort({ donation_date: -1 });

    console.log("Fetched Donations:", donations); // ✅ Debugging output

    if (donations.length === 0) {
        return res.status(404).json({ message: "No donations found for this donor." });
    }

    // Get the last donation date
    let lastDonationDate = donations[0].donation_date;

    console.log("Last Donation Date from DB:", lastDonationDate); // ✅ Debugging output

    // Ensure it's in proper format
    if (!(lastDonationDate instanceof Date)) {
        lastDonationDate = new Date(lastDonationDate);
    }

    res.json({
        last_donation: lastDonationDate, // ✅ Check if this outputs correctly
    });

} catch (error) {
    console.error("❌ Error fetching donor donations:", error);
    res.status(500).json({ message: "Server error, please try again later." });
}


});

export default router;

router.get("/donations/:donorId", async (req, res) => {
  try {
      const { donorId } = req.params;

      // Validate donorId
      if (!mongoose.Types.ObjectId.isValid(donorId)) {
          return res.status(400).json({ message: "Invalid donor ID format" });
      }

      // Find the latest donation for the donor
      const latestDonation = await Donation.findOne({ donor_id: donorId })
          .sort({ donation_date: -1 })
          .limit(1);

      if (latestDonation) {
          res.json({ last_donation: latestDonation.donation_date });
      } else {
          res.json({ last_donation: null }); // No donations found
      }
  } catch (error) {
      console.error("❌ Error fetching last donation date:", error);
      res.status(500).json({ message: "Server error, please try again later." });
  }
});

// ✅ TEST ROUTE
app.get("/", (req, res) => {
  res.send("🔥 Server is running...");
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
