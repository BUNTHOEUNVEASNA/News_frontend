import React from "react";

const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 p-6">
      <div className="w-full max-w-lg">{children}</div>
    </div>
  );
};

export default PublicLayout;
