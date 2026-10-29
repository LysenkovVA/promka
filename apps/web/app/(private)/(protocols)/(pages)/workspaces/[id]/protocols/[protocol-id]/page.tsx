import { Metadata } from "next"
import { ProtocolDetails } from "../../../../../ui/protocol-details/protocol-details"

export const metadata: Metadata = {
  title: "Протокол",
}

export default async function ProtocolDetailsPage({
  params,
}: {
  params: Promise<{ "protocol-id": string }>
}) {
  const { "protocol-id": protocolId } = await params

  return <ProtocolDetails protocolId={protocolId} />
}
