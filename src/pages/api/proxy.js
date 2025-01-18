export default async function handler(req, res) {
  const baseUrl = process.env.NEXT_PUBLIC_JAZE_API_BASE_URL;
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;
  const allowedOrigin =
    process.env.NEXT_PUBLIC_ALLOWED_ORIGIN || "http://localhost:8231";

  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight (OPTIONS) requests
  if (req.method === "OPTIONS") {
    console.log("[LOG] OPTIONS request received. Returning 200.");
    return res.status(200).end();
  }

  try {
    // Log the incoming request
    console.log(
      `[LOG] Incoming request: Method = ${req.method}, Query =`,
      req.query
    );

    // Get and decode the path parameter
    const { path } = req.query;
    if (!path) {
      console.error("[ERROR] Missing 'path' query parameter.");
      return res
        .status(400)
        .json({ message: "Missing 'path' query parameter" });
    }
    const decodedPath = decodeURIComponent(path);
    console.log(`[LOG] Decoded path: ${decodedPath}`);

    // Construct the target URL
    const targetUrl = `${baseUrl.replace(/\/+$/, "")}/${decodedPath.replace(
      /^\/+/,
      ""
    )}`;
    console.log(`[LOG] Constructed Target URL: ${targetUrl}`);

    // Set up headers for the API cal
    const headers = {
      Authorization: `Basic ${apiKey}`,
      "Content-Type": "application/json",
    };

    // console.log("[LOG] Sending API request with headers:", headers);

    // Perform the API call
    const apiResponse = await fetch(targetUrl, { method: req.method, headers });

    console.log(`[LOG] API Response Status: ${apiResponse.status}`);

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error("[ERROR] API Error Response:", errorText);
      return res.status(apiResponse.status).send(errorText);
    }

    // Parse and return the response
    const data = await apiResponse.json();
    console.log("[LOG] API Response Data:", data);
    return res.status(200).json(data);
  } catch (error) {
    console.error("[ERROR] Server Error:", error.message);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
}
