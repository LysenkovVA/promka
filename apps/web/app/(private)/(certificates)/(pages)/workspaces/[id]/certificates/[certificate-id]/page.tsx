import { Metadata } from "next"
import { CertificateDetails } from "../../../../../ui/certificate-details/certificate-details"

export const metadata: Metadata = {
  title: "Удостоверение",
}

export default async function CertificateDetailsPage({
  params,
}: {
  params: Promise<{ "certificate-id": string }>
}) {
  const { "certificate-id": certificateId } = await params

  return <CertificateDetails certificateId={certificateId} />
}
