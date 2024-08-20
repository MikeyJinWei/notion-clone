"use client";

import Document from "@/components/Document";

const DocumentPage = ({
  params: { id },
}: {
  params: {
    id: string;
  };
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Document id={id} />
    </div>
  );
};
export default DocumentPage;
