import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const useProtectedPage = () => {
  const router = useRouter();
  const { status } = useSession();
  const [isAuthenticating, setIsAuthenticating] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      void router.push("/");
    } else if (status === "authenticated") {
      setIsAuthenticating(false);
    }
  }, [router, status]);

  return {
    isAuthenticating,
    isAuthed: status === "authenticated",
  };
};
