import ShopClient from "./shop-client";

export default async function ShopPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ShopClient shopId={id} />;
}
