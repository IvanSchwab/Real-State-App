import type { Metadata } from "next";
import { Suspense } from "react";
import PropertiesPage from "@/app/properties/list/PropertiesPage";

export const metadata: Metadata = {
  title: "Propiedades | Olivera de Schwab Propiedades",
  description: "Casas, departamentos, PH, locales y terrenos en venta y alquiler en San Martín y alrededores.",
};

export default function Properties() {
  return (
    <Suspense fallback={<div className="page" style={{ minHeight: "100vh" }} />}>
      <PropertiesPage />
    </Suspense>
  );
}
