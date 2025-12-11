import { redirect } from "next/navigation";

import { getAgentBootstrapState } from "@/lib/server/bootstrap";
import OnboardingForm from "./OnboardingForm";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const { hasAgents } = await getAgentBootstrapState();

  if (hasAgents) {
    redirect("/login");
  }

  return <OnboardingForm />;
}
