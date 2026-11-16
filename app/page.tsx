import { redirect } from "next/navigation";

/** Catalogue home always opens the live Gajavali collection. */
export default function HomePage() {
  redirect("/c/gajavali");
}
