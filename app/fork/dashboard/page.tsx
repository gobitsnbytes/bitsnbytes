import type { Metadata } from "next"
import { ForkDashboard } from "./fork-dashboard"

export const metadata: Metadata = {
  title: "Fork Dashboard | Bits&Bytes",
  description: "Manage your Bits&Bytes fork - events, team, reports, and health scores.",
}

export default function DashboardPage() {
  return <ForkDashboard />
}