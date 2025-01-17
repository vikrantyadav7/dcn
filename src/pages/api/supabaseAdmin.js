// pages/api/supabase.js

import { NextApiRequest, NextApiResponse } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${supabaseKey}`,
};

async function fetchData() {
  const response = await fetch(`${supabaseUrl}/rest/v1/users`, {
    method: "GET",
    headers: headers,
  });

  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    throw new Error("Error fetching data from Supabase");
  }
}

export default async function handler(
  req = NextApiRequest,
  res = NextApiResponse
) {
  try {
    // Fetch data from Supabase
    const data = await fetchData();
    res.status(200).json(data); // Send the data as JSON response
  } catch (error) {
    res.status(500).json({ error: error.message }); // Send error if something goes wrong
  }
}
