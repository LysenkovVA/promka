import { Metadata } from "next"
import { WorkspaceDetails } from "@/Workspaces/ui/WorkspaceDetails/WorkspaceDetails"

export const metadata: Metadata = {
  title: "Компания",
}

export default async function WorkspaceDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return <WorkspaceDetails workspaceId={id} />
}
