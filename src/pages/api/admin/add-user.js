import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

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

  // Handle POST request
  if (req.method === "POST") {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    try {
      // Creating user with Supabase Admin API
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        user_metadata: { role },
      });

      if (error) {
        console.error("[ERROR] Supabase Error:", error);
        return res.status(500).json({ error: error.message });
      }

      console.log("[LOG] User created:", data);
      return res
        .status(200)
        .json({ message: "User created successfully", data });
    } catch (error) {
      console.error("[ERROR] Server Error:", error);
      return res.status(500).json({ error: error.message });
    }
  } else {
    // Handle unsupported methods
    return res.status(405).json({ error: "Method not allowed" });
  }
}
