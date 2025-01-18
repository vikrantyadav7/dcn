import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
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

  // Handle DELETE request
  if (req.method === "DELETE") {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    try {
      // Delete the user from Supabase
      const { error } = await supabase.auth.admin.deleteUser(userId);

      if (error) {
        console.error("[ERROR] Supabase Error:", error);
        return res.status(500).json({ error: error.message });
      }

      console.log("[LOG] User deleted successfully:", userId);
      return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("[ERROR] Server Error:", error);
      return res.status(500).json({ error: error.message });
    }
  } else {
    // Handle unsupported methods
    res.setHeader("Allow", ["DELETE"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}
