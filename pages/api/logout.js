import { supabase } from "../../utils/supabaseClient";

export default async function logoutUser(req, res) {
  // let { error } = await supabase.auth.signOut();
  let { error } = await supabase.auth.api.signOut();

  if (error) return res.status(401).json({ error: error.message });
  return res.status(200).json({ body: "User has been logged out" });
}