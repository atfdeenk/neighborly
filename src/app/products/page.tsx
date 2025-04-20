import { Suspense } from "react";
import SuspenseProductsPage from "./SuspenseProductsPage";

export default function ProductsPage() {
  return (
    <Suspense fallback={null}>
      <SuspenseProductsPage />
    </Suspense>
  );
}
