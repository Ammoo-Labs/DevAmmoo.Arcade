import ShopClient from "./shop-client";

export function generateStaticParams() {
  return ["ammoo-arcade", "tech-haven", "sarahs-boutique"].map((id) => ({ id }));
}

export default async function ShopPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ShopClient shopId={id} />;
}
