/** Client-side session hint for Next.js middleware (not a security token). */
export const AUTH_COOKIE = 'fisight_auth';

export function setAuthCookie(active: boolean) {
  if (typeof document === 'undefined') return;
  if (active) {
    document.cookie = `${AUTH_COOKIE}=1; path=/; max-age=604800; SameSite=Lax`;
  } else {
    document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
  }
}
