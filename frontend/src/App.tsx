import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import PrivateLayout from "./components/PrivateLayout";

const Home = lazy(() => import("./pages/Home"));
const Doctors = lazy(() => import("./pages/Doctors"));
const DoctorDetail = lazy(() => import("./pages/DoctorDetail"));
const Appointments = lazy(() => import("./pages/Appointments"));
const NotFound = lazy(() => import("./pages/NotFound"));

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-24 text-blue-500">
      <svg
        className="animate-spin w-8 h-8"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="doctors" element={<Doctors />} />
              <Route path="doctors/:id" element={<DoctorDetail />} />
              <Route element={<PrivateLayout />}>
                <Route path="appointments" element={<Appointments />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}