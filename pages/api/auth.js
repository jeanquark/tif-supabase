/**
 * NOTE: this file is only needed if you're doing SSR (getServerSideProps)!
 */
 import { supabase } from '../../lib/initSupabase'

 export default function handler(req, res) {
   console.log('[api/auth] handler')
   supabase.auth.api.setAuthCookie(req, res)
 }
 