import { createServerClient, parseCookieHeader } from '@supabase/ssr';
import { SupabaseClient } from '@supabase/supabase-js';
import type { Context, MiddlewareHandler } from 'hono';
import { env } from 'hono/adapter';
import { setCookie } from 'hono/cookie';
import { Database } from '../types/supabase';

declare module 'hono' {
  interface ContextVariableMap {
    supabase: SupabaseClient<Database>;
  }
}

export const getSupabase = (c: Context) => {
  return c.get('supabase');
};

type SupabaseEnv = {
  SUPABASE_URL: string;
  SUPABASE_PUBLISHABLE_KEY: string;
};

export const supabaseMiddleware = (): MiddlewareHandler => {
  return async (c, next) => {
    const supabaseEnv = env<SupabaseEnv>(c);
    const supabaseUrl = supabaseEnv.SUPABASE_URL;
    const supabaseAnonKey = supabaseEnv.SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl) {
      throw new Error('SUPABASE_URL missing!');
    }

    if (!supabaseAnonKey) {
      throw new Error('SUPABASE_PUBLISHABLE_KEY missing!');
    }

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookieOptions: {
        sameSite: c.env.ENVIRONMENT === 'production' ? 'none' : 'lax',
        secure: c.env.ENVIRONMENT === 'production',
        httpOnly: true,
      },
      cookies: {
        getAll() {
          const cookies = parseCookieHeader(c.req.header('Cookie') ?? '');
          return cookies.map(cookie => ({
            name: cookie.name,
            value: cookie.value ?? '',
          }));
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            if (options) {
              setCookie(c, name, value, {
                path: '/',
                ...options,
                sameSite: typeof options.sameSite === 'string' 
                  ? options.sameSite 
                  : (c.env.ENVIRONMENT === 'production' ? 'none' : 'lax'),
                secure: options.secure ?? (c.env.ENVIRONMENT === 'production'),
              });
            } else {
              setCookie(c, name, value, {
                path: '/',
                httpOnly: true,
                secure: c.env.ENVIRONMENT === 'production',
                sameSite: c.env.ENVIRONMENT === 'production' ? 'none' : 'lax',
              });
            }
          });
        },
      },
    });

    c.set('supabase', supabase);

    await next();
  };
};
