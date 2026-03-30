// TODO: replace with real data from backend API
// import drWomen1 from "../images/dr-women-1.png";
// import ellipse5  from "../images/Ellipse 5.png";
import drSarahMitchell from "../images/dr-sarah-mitchell.png";
import drOmarAlRashid from "../images/dr-omar-al-rashid.png";
import drOmaraOsei from "../images/dr-amara-osei.png";
import ellipse7 from "../images/dr-brandon-hayes.png";
import ellipse8 from "../images/dr-carlos-reyes.png";
import ellipse9 from "../images/dr-arjun-patel.png";
import ellipse10 from "../images/dr-ashley-carter.png";
import ellipse11 from "../images/dr-marcus-webb.png";
import ellipse12 from "../images/dr-henry-blackwood.png";
import ellipse13 from "../images/dr-dariush-tehrani.png";

export type Doctor = {
  id: number;
  name: string;
  specialty: string;
  location: string;
  rating: number;
  reviews: number;
  available: string;
  experience: number;
  avatar: string;
  image: string;
  bio: string;
  languages: string[];
  education: string;
  slots: string[];
};

export const MOCK_DOCTORS: Doctor[] = [
  {
    id: 1, name: "Dr. Sarah Mitchell", specialty: "Cardiologist", location: "New York, NY",
    rating: 4.9, reviews: 214, available: "Today", experience: 14, avatar: "SM", image: drSarahMitchell,
    bio: "Dr. Mitchell is a board-certified cardiologist with over 14 years of experience in diagnosing and treating complex heart conditions. She specializes in preventive cardiology and minimally invasive procedures.",
    languages: ["English", "Spanish"], education: "Harvard Medical School",
    slots: ["9:00 AM", "10:30 AM", "1:00 PM", "3:30 PM"],
  },
  {
    id: 2, name: "Dr. Omar Al-Rashid", specialty: "General Practice", location: "Los Angeles, CA",
    rating: 4.7, reviews: 189, available: "Tomorrow", experience: 8, avatar: "OA", image: drOmarAlRashid,
    bio: "Dr. Al-Rashid is a compassionate family doctor who provides comprehensive primary care for patients of all ages. He emphasizes preventive medicine and long-term patient relationships.",
    languages: ["English", "Arabic"], education: "UCLA School of Medicine",
    slots: ["8:00 AM", "11:00 AM", "2:00 PM"],
  },
  {
    id: 3, name: "Dr. Amara Osei", specialty: "Dermatologist", location: "Chicago, IL",
    rating: 4.8, reviews: 302, available: "Today", experience: 11, avatar: "AO", image: drOmaraOsei,
    bio: "Dr. Osei is a leading dermatologist specializing in both medical and cosmetic skin conditions. She is known for her expertise in treating skin cancer, eczema, and acne.",
    languages: ["English", "French", "Twi"], education: "Johns Hopkins School of Medicine",
    slots: ["9:30 AM", "12:00 PM", "2:30 PM", "4:00 PM"],
  },
  {
    id: 4, name: "Dr. Brandon Hayes", specialty: "Pediatrician", location: "Houston, TX",
    rating: 4.6, reviews: 97, available: "Wed", experience: 6, avatar: "BH", image: ellipse7,
    bio: "Dr. Hayes is a dedicated pediatrician committed to the health and well-being of children from newborns to adolescents. He has a warm, child-friendly approach that puts young patients at ease.",
    languages: ["English"], education: "Baylor College of Medicine",
    slots: ["8:30 AM", "10:00 AM", "1:30 PM"],
  },
  {
    id: 5, name: "Dr. Carlos Reyes", specialty: "Neurologist", location: "Phoenix, AZ",
    rating: 4.9, reviews: 176, available: "Today", experience: 17, avatar: "CR", image: ellipse8,
    bio: "Dr. Reyes is a highly regarded neurologist with expertise in stroke, epilepsy, and neurodegenerative diseases. He has published over 40 peer-reviewed papers in leading neurology journals.",
    languages: ["English", "Spanish", "Portuguese"], education: "Mayo Clinic School of Medicine",
    slots: ["10:00 AM", "12:30 PM", "3:00 PM"],
  },
  {
    id: 6, name: "Dr. Arjun Patel", specialty: "Psychiatrist", location: "Philadelphia, PA",
    rating: 4.7, reviews: 143, available: "Tomorrow", experience: 9, avatar: "AP", image: ellipse9,
    bio: "Dr. Patel is a compassionate psychiatrist specializing in anxiety, depression, and trauma-related disorders. He integrates evidence-based therapies with a holistic approach to mental wellness.",
    languages: ["English", "Hindi", "Gujarati"], education: "University of Pennsylvania School of Medicine",
    slots: ["9:00 AM", "11:00 AM", "2:00 PM", "4:30 PM"],
  },
  {
    id: 7, name: "Dr. Ashley Carter", specialty: "Orthopedic", location: "San Antonio, TX",
    rating: 4.5, reviews: 88, available: "Thu", experience: 12, avatar: "AC", image: ellipse10,
    bio: "Dr. Carter specializes in sports medicine and orthopedic surgery, helping athletes and active individuals recover from injuries and return to peak performance.",
    languages: ["English"], education: "UT Health San Antonio",
    slots: ["8:00 AM", "10:30 AM", "1:00 PM"],
  },
  {
    id: 8, name: "Dr. Marcus Webb", specialty: "Ophthalmologist", location: "San Diego, CA",
    rating: 4.8, reviews: 261, available: "Today", experience: 15, avatar: "MW", image: ellipse11,
    bio: "Dr. Webb is a fellowship-trained ophthalmologist with expertise in cataract surgery, glaucoma management, and retinal diseases. He is known for his precision and patient-centered care.",
    languages: ["English"], education: "UC San Diego School of Medicine",
    slots: ["9:00 AM", "11:30 AM", "2:00 PM", "3:30 PM"],
  },
  {
    id: 9, name: "Dr. Henry Blackwood", specialty: "General Practice", location: "Dallas, TX",
    rating: 4.6, reviews: 120, available: "Tomorrow", experience: 5, avatar: "HB", image: ellipse12,
    bio: "Dr. Blackwood is an energetic and approachable GP focused on preventive care and community health. He is passionate about closing health equity gaps and serving diverse patient populations.",
    languages: ["English"], education: "UT Southwestern Medical Center",
    slots: ["8:30 AM", "10:00 AM", "12:00 PM", "3:00 PM"],
  },
  {
    id: 10, name: "Dr. Dariush Tehrani", specialty: "Cardiologist", location: "San Jose, CA",
    rating: 4.9, reviews: 198, available: "Today", experience: 20, avatar: "DT", image: ellipse13,
    bio: "Dr. Tehrani is a seasoned cardiologist with two decades of experience in interventional cardiology. He has performed over 2,000 cardiac catheterizations and is a pioneer in preventive heart health.",
    languages: ["English", "Persian"], education: "Stanford University School of Medicine",
    slots: ["9:30 AM", "11:00 AM", "1:30 PM", "4:00 PM"],
  },
];
