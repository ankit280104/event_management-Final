import { Outlet } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { useAtom } from "jotai";
import { clubsListAtom, eventAtom, instructorAtom } from "./atom/userAtoms";
import { useEffect, useState } from "react";
import { Circles } from "react-loader-spinner";

function App() {
  const [, setInstructors] = useAtom(instructorAtom);
  const [, setEvents] = useAtom(eventAtom);
  const [, setClubs] = useAtom(clubsListAtom);

  const [loadingStates, setLoadingStates] = useState({
    instructors: true,
    events: true,
    clubs: true,
  });
  const [errors, setErrors] = useState({
    instructors: null,
    events: null,
    clubs: null,
  });

  // Helper function to handle error responses
  const handleErrorResponse = async (response, stateName) => {
    try {
      // Try to parse as JSON first
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        return (
          errorData.message || errorData.error || `${stateName} request failed`
        );
      } else {
        // If not JSON, get the text
        const errorText = await response.text();
        return `Server error (${response.status}): ${response.statusText}`;
      }
    } catch (error) {
      return `${stateName} request failed: ${response.status} ${response.statusText}`;
    }
  };

  // Helper function to make API call
  const fetchData = async (endpoint, stateName, setterFunction) => {
    const url = `${import.meta.env.VITE_BACKEND_URL}/${endpoint}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        const errorMessage = await handleErrorResponse(response, stateName);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setterFunction(data);
      setLoadingStates((prev) => ({ ...prev, [stateName]: false }));
    } catch (error) {
      console.error(`${stateName} error:`, error);
      setErrors((prev) => ({
        ...prev,
        [stateName]: error.message || `Failed to load ${stateName}`,
      }));
      setLoadingStates((prev) => ({ ...prev, [stateName]: false }));
    }
  };

  useEffect(() => {
    fetchData("instructor/", "instructors", setInstructors);
    fetchData("events/", "events", setEvents);
    fetchData("clubs/", "clubs", setClubs);
  }, []);

  const isLoading = Object.values(loadingStates).some((state) => state);
  const hasErrors = Object.values(errors).some((error) => error !== null);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Circles
          height="80"
          width="80"
          color="#3498db"
          ariaLabel="circles-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
        <p className="mt-4 text-gray-600">Loading resources...</p>
      </div>
    );
  }

  if (hasErrors) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md">
          <h2 className="text-red-800 text-lg font-semibold mb-2">
            Error Loading Resources
          </h2>
          <ul className="list-disc pl-4">
            {Object.entries(errors).map(
              ([key, error]) =>
                error && (
                  <li key={key} className="text-red-600">
                    {`${key.charAt(0).toUpperCase() + key.slice(1)}: ${error}`}
                  </li>
                )
            )}
          </ul>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default App;
