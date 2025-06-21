import { authMiddleware } from '@civic/auth/nextjs/middleware'

export default authMiddleware();

export const config = {
  // include the paths you wish to secure here
  matcher: [
    /*
     * Match all request paths except:
     * - _next directory (Next.js static files)
     * - favicon.ico, sitemap.xml, robots.txt
     * - image files
     * - dashboard routes
     */
    '/((?!_next|favicon.ico|sitemap.xml|robots.txt|dashboard|.*\.jpg|.*\.png|.*\.svg|.*\.gif).*)',
  ],
}
