import { TriangleAlert } from "lucide-react";

interface FormErrorProps {
  message?: string;
}

export const FormError = ({ message }: FormErrorProps) => {
  if (!message) return null;

  return (
    <div className=" bg-destructive/15 p-4  px-5 rounded-md flex items-center gap-x-2 text-sm text-destructive">
      <TriangleAlert size="24" /> <p>{message}</p>
    </div>
  );
};
