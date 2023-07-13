import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import PBKDF2 from './utils/encrypt';
import makeid from './utils/makeid';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createMiddlewareClient({ req, res });
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    const { data: user } = await supabase
      .from('Users')
      .select()
      .eq('id', session?.user?.user_metadata?.provider_id)
      .limit(1)
      .single();

    if (!user) {
      await supabase.from('Users').insert({
        uid: session?.user?.id,
        id: session?.user?.user_metadata?.provider_id,
        email: PBKDF2(session?.user?.email),
        name: session?.user?.user_metadata?.name,
        image: session?.user?.user_metadata?.avatar_url ?? "",
        boards: [],
        apiKey: makeid(20),
      });

      console.log('new user created')
    }
  }

  return res;
}
