export interface SelectOptions {
  label: string;
  value: string;
}

export interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNo: string;
  photoURL: string;
  bio: string;
  role: "admin" | "user";
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  image?: string;
  location?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Document {
  id: string;
  userId: string;
  userName: string;
  title: string;
  description: string;
  fileUrl: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: number;
  documentType: string;
}
