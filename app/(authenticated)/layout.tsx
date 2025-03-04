import Navbar from "@/components/common/navbar";

const AuthLayout = ({ children }: { children: React.ReactNode }) => (
  <main>
    <Navbar />
    {children}
  </main>
);

export default AuthLayout;
