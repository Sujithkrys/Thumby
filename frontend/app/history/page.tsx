import type { Metadata } from "next";
import { HistoryClient } from "./HistoryClient";

export const metadata: Metadata = {
  title: "History — Thumby",
  description: "View all your past thumbnail generations.",
};

export default function HistoryPage() {
  return <HistoryClient />;
}
