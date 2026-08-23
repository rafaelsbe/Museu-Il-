import AreaPageClient from "@/components/AreaPageClient";

type Props = {
  params: Promise<{ area: string }>;
};

export default async function AreaPage({ params }: Props) {
  const { area } = await params;
  return (
    <div className="min-h-screen bg-background">
      <AreaPageClient area={area} />
    </div>
  );
}
