import Nav from "@/components/ui/Nav";
import Footer from "@/components/ui/Footer";
import PropertyView from "./PropertyView";

interface PageProps {
  params: Promise<{ propertyHash: string }>;
}

export default async function Page({ params }: PageProps) {
  const { propertyHash } = await params;

  return (
    <div className="page ficha">
      <Nav />
      <PropertyView hash={propertyHash} />
      <Footer />
    </div>
  );
}
