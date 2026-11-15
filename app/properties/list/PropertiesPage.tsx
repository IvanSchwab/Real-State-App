import Nav from "@/components/ui/Nav";
import Footer from "@/components/ui/Footer";
import WhatsAppFab from "@/components/ui/WhatsAppFab";
import Listing from "./Listing";

export default function PropertiesPage() {
  return (
    <div className="page">
      <Nav />
      <Listing />
      <Footer />
      <WhatsAppFab />
    </div>
  );
}
