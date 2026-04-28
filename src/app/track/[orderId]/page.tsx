import { redirect } from "next/navigation";

export default async function TrackAliasPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  redirect(`/orders/${orderId}/track`);
}

