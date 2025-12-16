import React from "react";

interface Props {
  children: React.ReactNode;
}

const AuthLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      {children}
    </div>
  );
};

export default AuthLayout;
