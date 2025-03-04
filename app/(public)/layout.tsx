const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex min-h-screen py-10 flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 px-4">
      {children}
    </main>
  );
};

export default AuthLayout;
