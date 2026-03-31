import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Star, MapPin, Clock, GraduationCap, Languages, ArrowLeft, CalendarCheck } from "lucide-react";
import { MOCK_DOCTORS } from "../data/doctors";

// TODO: fetch doctor by id from backend API instead of MOCK_DOCTORS

export default function DoctorDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const doctor = MOCK_DOCTORS.find((d) => d.id === Number(id));

  if (!doctor) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <p className="text-5xl">🩺</p>
        <h2 className="text-2xl font-bold text-gray-700">Doctor not found</h2>
        <button
          onClick={() => navigate("/doctors")}
          className="text-blue-600 hover:underline text-sm"
        >
          ← Back to Doctors
        </button>
      </div>
    );
  }

  return (
    <div className="py-8 space-y-6 max-w-3xl mx-auto">

      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Doctors
      </button>

      {/* Hero Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col sm:flex-row gap-6">
        <img
          src={doctor.image_url}
          alt={doctor.name}
          className="w-20 h-20 rounded-2xl object-cover shrink-0 border border-gray-100"
        />
        <div className="flex-1 space-y-2">
          <h1 className="text-2xl font-bold text-gray-800">{doctor.name}</h1>
          <p className="text-blue-600 font-semibold">{doctor.specialty}</p>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 pt-1">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" /> {doctor.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              Available: <span className="font-medium text-green-600 ml-1">{doctor.available}</span>
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="font-medium text-gray-700">{doctor.rating}</span>
              <span className="text-gray-400 ml-1">({doctor.reviews} reviews)</span>
            </span>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-blue-700">{doctor.experience}</p>
          <p className="text-xs text-gray-500 mt-1">Years Experience</p>
        </div>
        <div className="bg-green-50 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-green-700">{doctor.reviews}</p>
          <p className="text-xs text-gray-500 mt-1">Patient Reviews</p>
        </div>
        <div className="bg-purple-50 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-purple-700">{doctor.rating}</p>
          <p className="text-xs text-gray-500 mt-1">Rating</p>
        </div>
      </div>

      {/* About */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-3">
        <h2 className="text-lg font-bold text-gray-800">About</h2>
        <p className="text-sm text-gray-600 leading-relaxed">{doctor.bio}</p>

        <div className="pt-2 flex flex-col gap-2 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-blue-500 shrink-0" />
            <span>{doctor.education}</span>
          </div>
          <div className="flex items-center gap-2">
            <Languages className="w-4 h-4 text-blue-500 shrink-0" />
            <span>{doctor.languages.join(", ")}</span>
          </div>
        </div>
      </div>

      {/* Booking Slots */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <CalendarCheck className="w-5 h-5 text-blue-500" />
          Available Slots
        </h2>
        <div className="flex flex-wrap gap-3">
          {doctor.slots.map((slot) => {
            const isSelected = selectedSlot === slot;
            return (
              <button
                key={slot}
                onClick={() => setSelectedSlot(isSelected ? null : slot)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium active:scale-95 transition-all ${
                  isSelected
                    ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200 ring-2 ring-blue-400 ring-offset-1"
                    : "border-blue-200 text-blue-700 hover:bg-blue-50"
                }`}
              >
                {isSelected ? "✓ " : ""}{slot}
              </button>
            );
          })}
        </div>

        <button
          disabled={!selectedSlot}
          className="w-full mt-2 bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          {selectedSlot ? `Book Appointment at ${selectedSlot}` : "Select a time slot"}
        </button>
      </div>

    </div>
  );
}
