import ContentManagement from "@/components/ContentManagement/ContentManagement";
import React, { Suspense } from "react";

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ContentManagement />
    </Suspense>
  );
};

export default page;
