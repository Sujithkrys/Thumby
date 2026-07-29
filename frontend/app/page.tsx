import { redirect } from "next/navigation";

/**
 * Root page — redirects to the gallery (first slice in build order).
 */
export default function HomePage() {
  redirect("/gallery");
}
