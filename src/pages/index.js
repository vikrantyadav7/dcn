import { useEffect, useState } from "react";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("?path=get_details/379083", {
          method: "GET",
        }); // Pass the dynamic path here
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error("Error:", error);
        setError(error.message);
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      {error && <p>Error: {error}</p>}
      {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <p>Loading...</p>}
    </div>
  );
}
