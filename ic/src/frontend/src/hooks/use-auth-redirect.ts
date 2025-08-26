import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../providers/auth-provider";
import { useUserProfile } from "./use-backend";

export function useAuthRedirect() {
  const { isAuth, identity, principal } = useAuth();
  const { data: userProfileData } = useUserProfile(principal?.toText() || "");
  const router = useRouter();
  const pathname = usePathname();

  // Ambil identityProvider dari logika di auth-provider
  const network = process.env.DFX_NETWORK;
  const identityProvider =
    network === "ic"
      ? "https://identity.ic0.app" // Mainnet
      : "http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943"; // Local

  const origin = window.location.origin;

  useEffect(() => {
    // Redirect logic untuk path /register
    if (pathname === "/register") {
      // Jika belum login, redirect ke identity provider
      if (!isAuth || !identity || !principal) {
        router.push(`${identityProvider}?provider=${origin}&target=/register`);
        return;
      }

      // Jika sudah login dan punya data user, redirect ke dashboard
      if (userProfileData) {
        router.push("/dashboard");
        return;
      }
    }

    // Redirect logic untuk path /dashboard
    if (pathname === "/dashboard") {
      // Jika sudah login tapi belum punya data user, redirect ke register
      if (!userProfileData) {
        router.push("/register");
        return;
      }

      // Jika belum login, redirect ke identity provider dengan target dashboard
      if (!isAuth || !identity || !principal) {
        router.push(`${identityProvider}?provider=${origin}&target=/dashboard`);
        return;
      }
    }

    // Redirect logic untuk path root (/)
    if (pathname === "/") {
      // Jika sudah login dan punya data user, redirect ke dashboard
      if (isAuth && identity && principal && userProfileData) {
        router.push("/dashboard");
        return;
      }

      // Jika sudah login tapi belum punya data user, redirect ke register
      else if (isAuth && identity && principal && !userProfileData) {
        router.push("/register");
        return;
      } else {
        return;
      }
    }
  }, [isAuth, identity, principal, userProfileData, router, pathname]);

  return { isAuth, identity, principal, userProfileData, router, pathname };
}
