import {
  CalendarCheck,
  Stethoscope,
  ShieldCheck,
  Clock,
  Bell,
  FileText,
  HeartPulse,
  Star,
} from "lucide-react";

type BentoCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  accent?: string;
};

function BentoCard({ icon, title, description, className = "", accent = "bg-white" }: BentoCardProps) {
  return (
    <div
      className={`${accent} rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-3 ${className}`}
    >
      <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="py-10 space-y-8">

      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 text-white p-10 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <HeartPulse className="w-8 h-8" />
          <span className="text-sm font-semibold uppercase tracking-widest opacity-80">Medi Connect</span>
        </div>
        <h1 className="text-4xl font-bold leading-tight max-w-lg">
          Your health, managed in one place.
        </h1>
        <p className="text-blue-100 max-w-md text-base">
          Book trusted healthcare professionals, track your appointments, and stay on top of your wellbeing. Whenever you need it, wherever you are.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* Tall card */}
        <BentoCard
          icon={<Stethoscope className="w-5 h-5" />}
          title="Find a Doctor"
          description="Browse our network of verified specialists across all fields: GPs, cardiologists, dermatologists and more. Filter by availability, location, and rating."
          className="lg:row-span-2"
          accent="bg-blue-50"
        />

        <BentoCard
          icon={<CalendarCheck className="w-5 h-5" />}
          title="Easy Booking"
          description="Schedule appointments in seconds. Pick a time slot that works for you with our real-time availability calendar."
        />

        <BentoCard
          icon={<ShieldCheck className="w-5 h-5" />}
          title="Verified Professionals"
          description="Every doctor on Medi Connect is fully licensed and background-verified for your peace of mind."
        />

        <BentoCard
          icon={<Clock className="w-5 h-5" />}
          title="24/7 Availability"
          description="Access on-demand consultations any time of day. No waiting rooms, no queues."
          accent="bg-green-50"
        />

        <BentoCard
          icon={<Bell className="w-5 h-5" />}
          title="Smart Reminders"
          description="Never miss an appointment again. Get automated reminders via email or push notification before your visit."
        />

        <BentoCard
          icon={<FileText className="w-5 h-5" />}
          title="Health Records"
          description="Your visit summaries, prescriptions, and medical notes, all stored securely in one place."
          accent="bg-purple-50"
        />

        <BentoCard
          icon={<Star className="w-5 h-5" />}
          title="Patient Reviews"
          description="Read real reviews from other patients to choose the right doctor with confidence."
        />

      </div>
    </div>
  );
}
