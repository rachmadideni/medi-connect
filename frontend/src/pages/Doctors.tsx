import { useState } from "react";
import { useNavigate } from "react-router";
import { Star, MapPin, Clock, Sparkles, SlidersHorizontal, Search, X } from "lucide-react";
import { MOCK_DOCTORS, type Doctor } from "../data/doctors";

// TODO: replace MOCK_DOCTORS with real data from backend API

const SPECIALTIES = ["All", "Cardiologist", "General Practice", "Dermatologist", "Pediatrician", "Neurologist", "Psychiatrist", "Orthopedic", "Ophthalmologist"];
const AVAILABILITY = ["All", "Today", "Tomorrow"];

type SearchMode = "filters" | "ai";

// TODO: replace this with a real backend AI search API call
async function mockAiSearch(query: string): Promise<Doctor[]> {
  await new Promise((r) => setTimeout(r, 900)); // simulate network delay
  const q = query.toLowerCase();
  const keywords = q.split(/\s+/).filter((w) => w.length > 2);

  return MOCK_DOCTORS.filter((d) => {
    const haystack = [
      d.name, d.specialty, d.location, d.bio,
      d.available, d.education, ...d.languages,
    ].join(" ").toLowerCase();
    return keywords.some((kw) => haystack.includes(kw));
  }).sort((a, b) => {
    // rank by number of keyword hits
    const hayA = [a.name, a.specialty, a.location, a.bio, ...a.languages].join(" ").toLowerCase();
    const hayB = [b.name, b.specialty, b.location, b.bio, ...b.languages].join(" ").toLowerCase();
    const scoreA = keywords.filter((kw) => hayA.includes(kw)).length;
    const scoreB = keywords.filter((kw) => hayB.includes(kw)).length;
    return scoreB - scoreA;
  });
}

export default function Doctors() {
  const navigate = useNavigate();

  // Filter search state
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("All");
  const [availability, setAvailability] = useState("All");

  // AI search state
  const [mode, setMode] = useState<SearchMode>("filters");
  const [aiQuery, setAiQuery] = useState("");
  const [aiResults, setAiResults] = useState<Doctor[] | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const filteredResults = MOCK_DOCTORS.filter((d) => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.location.toLowerCase().includes(search.toLowerCase());
    const matchSpecialty = specialty === "All" || d.specialty === specialty;
    const matchAvail = availability === "All" || d.available === availability;
    return matchSearch && matchSpecialty && matchAvail;
  });

  async function handleAiSearch() {
    if (!aiQuery.trim()) return;
    setAiLoading(true);
    setAiError("");
    setAiResults(null);
    try {
      const results = await mockAiSearch(aiQuery); // TODO: replace with API call to /api/doctors/search?q=...
      setAiResults(results);
    } catch {
      setAiError("Something went wrong. Please try again.");
    } finally {
      setAiLoading(false);
    }
  }

  function clearAiSearch() {
    setAiQuery("");
    setAiResults(null);
    setAiError("");
  }

  const displayedDoctors = mode === "ai" ? (aiResults ?? []) : filteredResults;
  const showGrid = mode === "filters" || aiResults !== null;

  return (
    <div className="py-8 space-y-6">

      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-800">Find a Doctor</h2>
        <p className="text-gray-500 mt-1">Browse and book from our network of verified healthcare professionals.</p>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2 bg-gray-100 p-1 rounded-xl w-fit">
        <button
          onClick={() => setMode("filters")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === "filters"
              ? "bg-white text-blue-700 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Quick Filters
        </button>
        <button
          onClick={() => setMode("ai")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === "ai"
              ? "bg-white text-blue-700 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          AI Search
        </button>
      </div>

      {/* Quick Filters Panel */}
      {mode === "filters" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3 items-center">
          <input
            type="text"
            placeholder="Search by name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-48 px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {SPECIALTIES.map((s) => <option key={s}>{s}</option>)}
          </select>
          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            {AVAILABILITY.map((a) => <option key={a}>{a}</option>)}
          </select>
          {(search || specialty !== "All" || availability !== "All") && (
            <button
              onClick={() => { setSearch(""); setSpecialty("All"); setAvailability("All"); }}
              className="text-sm text-blue-600 hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* AI Search Panel */}
      {mode === "ai" && (
        <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-5 space-y-3">
          <div className="flex items-center gap-2 text-blue-600 text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            Describe what you're looking for in plain language
          </div>
          <div className="flex gap-3">
            <textarea
              rows={2}
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAiSearch(); } }}
              placeholder={`e.g. "I need a Spanish-speaking cardiologist available today in California"`}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <div className="flex flex-col gap-2">
              <button
                onClick={handleAiSearch}
                disabled={aiLoading || !aiQuery.trim()}
                className="flex items-center gap-1.5 bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {aiLoading ? (
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                ) : (
                  <Search className="w-4 h-4" />
                )}
                {aiLoading ? "Searching…" : "Search"}
              </button>
              {aiResults !== null && (
                <button
                  onClick={clearAiSearch}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors px-1"
                >
                  <X className="w-3.5 h-3.5" /> Clear
                </button>
              )}
            </div>
          </div>

          {/* Suggestion chips */}
          {aiResults === null && !aiLoading && (
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                "Cardiologist available today",
                "Spanish speaking doctor",
                "Pediatrician in Texas",
                "Neurologist with high rating",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setAiQuery(suggestion)}
                  className="text-xs px-3 py-1 rounded-full border border-blue-100 text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {aiError && <p className="text-sm text-red-500">{aiError}</p>}
        </div>
      )}

      {/* Loading skeleton */}
      {mode === "ai" && aiLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3 animate-pulse">
              <div className="flex gap-4 items-center">
                <div className="w-12 h-12 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-100 rounded" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      {showGrid && !aiLoading && (
        <>
          <p className="text-sm text-gray-400">
            {displayedDoctors.length} doctor{displayedDoctors.length !== 1 ? "s" : ""} found
            {mode === "ai" && aiResults !== null && (
              <span className="ml-2 text-blue-500 font-medium">· AI results for "{aiQuery}"</span>
            )}
          </p>

          {displayedDoctors.length === 0 ? (
            <div className="text-center py-20 text-gray-400">No doctors match your search.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedDoctors.map((doctor) => (
                <div
                  key={doctor.id}
                  onClick={() => navigate(`/doctors/${doctor.id}`)}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4 hover:shadow-md hover:border-blue-200 cursor-pointer transition-all"
                >
                  {/* Avatar + Name */}
                  <div className="flex items-center gap-4">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-12 h-12 rounded-full object-cover shrink-0 border border-gray-100"
                    />
                    <div>
                      <p className="font-semibold text-gray-800 leading-tight">{doctor.name}</p>
                      <p className="text-xs text-blue-600 font-medium">{doctor.specialty}</p>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="flex flex-col gap-1.5 text-xs text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {doctor.location}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      Available: <span className="font-medium text-green-600">{doctor.available}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                      <span className="font-medium text-gray-700">{doctor.rating}</span>
                      <span className="text-gray-400">({doctor.reviews} reviews)</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-400">{doctor.experience} yrs experience</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/doctors/${doctor.id}`); }}
                      className="bg-blue-600 text-white text-xs font-semibold px-4 py-1.5 rounded-lg hover:bg-blue-700 active:scale-95 transition-all">
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
