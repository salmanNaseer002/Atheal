type ErrorResponse = {
  message: string;
};

export const handleAuthError = (error: unknown): ErrorResponse => {
  let message = "";

  if (error instanceof Error) {
    const errorMessage = error.message || "";

    if (
      errorMessage.includes("auth/user-not-found") ||
      errorMessage.includes("auth/wrong-password") ||
      errorMessage.includes("auth/email-already-in-use") ||
      errorMessage.includes("auth/invalid-credential")
    ) {
      message = "Invalid Email or Password";
    } else {
      message = errorMessage || "Something went wrong. Try again!";
    }
  } else if (typeof error === "string") {
    if (
      error.includes("auth/user-not-found") ||
      error.includes("auth/wrong-password") ||
      error.includes("auth/email-already-in-use") ||
      error.includes("auth/invalid-credential")
    ) {
      message = "Invalid Email or Password";
    } else {
      message = error || "Something went wrong. Try again!";
    }
  } else {
    message = "An unexpected error occurred";
  }

  return { message };
};
