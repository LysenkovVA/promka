import { Metadata } from "next"
import { ProfileDetails } from "../../ui/profile-details/profile-details"

export const metadata: Metadata = {
  title: "Профиль",
}

export default async function ProfileDetailsPage() {
  return <ProfileDetails />
}
