import { NextRequest, NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import PBKDF2 from './utils/encrypt';
import makeid from './utils/makeid';

// Ratelimits
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
const cache = new Map();

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const ratelimit = {
  save: new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(20, '1 m'),
    analytics: true,
    prefix: 'ratelimit:save',
    ephemeralCache: cache,
  }),
  fetch: new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(40, '1 m'),
    analytics: true,
    prefix: 'ratelimit:fetch',
    ephemeralCache: cache,
  }),
  regen: new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(1, '2 m'),
    analytics: true,
    prefix: 'ratelimit:regen',
    ephemeralCache: cache,
  }),
  delete: new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(10, '1 m'),
    analytics: true,
    prefix: 'ratelimit:delete',
    ephemeralCache: cache,
  }),
  default: new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(60, '1 m'),
    prefix: 'ratelimit:default',
    ephemeralCache: cache,
  }),
};

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const path = req?.nextUrl?.pathname;

  if (path && path.startsWith('/api')) {
    const auth = req.headers['authorization'];
    if (
      !auth &&
      path !== '/api/ping' &&
      path !== '/api/teapot' &&
      path !== '/api'
    ) {
      return new NextResponse(
        JSON.stringify({ message: 'Not Authorized !', status: 401 }),
        {
          status: 401,
          headers: {
            'content-type': 'application/json',
          },
        }
      );
    } else if (!auth || auth !== process.env.NEXT_PUBLIC_KEY) {
      let rl: Ratelimit;
      switch (path) {
        case '/api/save':
          rl = ratelimit.save;
        case '/api/fetch':
          rl = ratelimit.fetch;
        case '/api/regenerate':
          rl = ratelimit.regen;
        case '/api/delete':
          rl = ratelimit.delete;
        default:
          rl = ratelimit.default;
      }

      const { success, limit, reset, remaining } = await rl.limit(
        auth ? auth : req.ip
      );

      res.headers.set('RateLimit-Limit', limit.toString());
      res.headers.set('RateLimit-Remaining', remaining.toString());

      if (!success) console.warn('API-KEY: ', auth);
      return success
        ? res
        : new NextResponse(
            JSON.stringify({
              message: 'Ratelimited !',
              warning:
                'Repeating this periodically may result of invokation of your API access.',
              status: 429,
            }),
            {
              status: 429,
              headers: {
                'content-type': 'application/json',
                'RateLimit-Limit': limit.toString(),
                'Retry-After': reset.toString(),
              },
            }
          );
    }
  } else {
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

      if (!user && session) {
        await supabase.from('Users').insert({
          uid: session?.user?.id,
          id: session?.user?.user_metadata?.provider_id,
          email: PBKDF2(session?.user?.email),
          name: session?.user?.user_metadata?.name,
          image: session?.user?.user_metadata?.avatar_url ?? '',
          apiKey: makeid(20),
        });
      }
    }

    return res;
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
