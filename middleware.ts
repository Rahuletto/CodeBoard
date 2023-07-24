import { NextRequest, NextResponse } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import PBKDF2 from './utils/encrypt';

// Ratelimits
import { Ratelimit } from '@upstash/ratelimit';
import redis from './utils/redis';

const cache = new Map();

const ratelimit = {
  save: new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(20, '1 m'),
    analytics: true,
    prefix: 'ratelimit@save',
    ephemeralCache: cache,
  }),
  fetch: new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(40, '1 m'),
    analytics: true,
    prefix: 'ratelimit@fetch',
    ephemeralCache: cache,
  }),
  regen: new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(1, '2 m'),
    analytics: true,
    prefix: 'ratelimit@regen',
    ephemeralCache: cache,
  }),
  delete: new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(10, '1 m'),
    analytics: true,
    prefix: 'ratelimit@delete',
    ephemeralCache: cache,
  }),
  default: new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(60, '1 m'),
    prefix: 'ratelimit@default',
    ephemeralCache: cache,
  }),
};

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const path = req?.nextUrl?.pathname;

  const auth = req.headers.get('authorization');
  
  if (path && path.startsWith('/api')) {
    if (
      path &&
      (path == '/api/ping' || path == '/api/teapot' || path == '/api')
    ) {
      const { success, limit, remaining, reset } =
        await ratelimit.default.limit(req.ip);

      res.headers.set('RateLimit-Limit', limit.toString());
      res.headers.set('RateLimit-Remaining', remaining.toString());

      return success
        ? res
        : new NextResponse(
            JSON.stringify({
              message: 'Ratelimited !',
              warning:
                'Repeating this periodically may result of blacklisting of your ip',
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
    } else if (
      !auth &&
      path !== '/api/ping' &&
      path !== '/api/teapot' &&
      path !== '/api' &&
      path !== '/api/og'
    ) {
      return new NextResponse(
        JSON.stringify({
          message: 'Not Authorized !!',
          from: 'MIDDLEWARE',
          status: 401,
        }),
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
      const id = session?.user?.user_metadata?.provider_id;

      let user = await redis.get(`user-${id}`)
      if (!user) {
        const { data } = await supabase
          .from('Users')
          .select()
          .eq('id', id)
          .limit(1)
          .single();

        user = data;
        if (data) await redis.set(`user-${id}`, data, { ex: 60 * 3 })
      }
      
      if (!user && session) {
        const key = generateUUID()

        await supabase.from('Users').insert({
          uid: session?.user?.id,
          id: session?.user?.user_metadata?.provider_id,
          email: PBKDF2(session?.user?.email),
          name: session?.user?.user_metadata?.name,
          image: session?.user?.user_metadata?.avatar_url ?? '',
          apiKey: key,
        });
      }
    }

    return res;
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

function generateUUID() {
  var d = new Date().getTime();

  if (window.performance && typeof window.performance.now === "function") {
    d += performance.now();
  }

  var uuid = 'codeboard_api.xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });

  return uuid;
}