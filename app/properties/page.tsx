import { Suspense } from 'react';
import PropertiesPage from "@/app/properties/list/PropertiesPage";

export default function Properties() {
  return (
    <Suspense fallback={<div>Loading search parameters...</div>}>
      <PropertiesPage />
    </Suspense>
  );
}