import { redirect } from "next/navigation";

export default function GrafanaPage() {
  redirect("http://localhost:3100/d/signal-lab-main/signal-lab-dashboard?orgId=1");
}
