import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/browse(.*)",
  "/search(.*)",
  "/paper(.*)",
  "/common-questions(.*)",
  "/sign-in(.*)",
]);

const isAdminRoute = createRouteMatcher([
  "/admin(.*)",
  "/dashboard(.*)",
  "/papers(.*)",
  "/boards(.*)",
  "/subjects(.*)",
  "/classes(.*)",
  "/questions(.*)",
  "/media(.*)",
  "/settings(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  // Student-facing routes stay open. Admin surfaces require a signed-in Clerk
  // session first, then the admin layout verifies publicMetadata.role.
  if (!isPublicRoute(request) && isAdminRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
