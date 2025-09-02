"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { Identity, ActorSubclass } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import {
  createActor,
  canisterId as canisterIdGenerated,
} from "../../../declarations/backend";
import { _SERVICE } from "../../../declarations/backend/backend.did";

interface AuthContextType {
  isAuth: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  authUser: AuthClient | null;
  identity: Identity | null;
  principal: Principal | null;
  callFunction: ActorSubclass<_SERVICE> | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

const network = process.env.DFX_NETWORK;

const host =
  process.env.DFX_NETWORK === "ic"
    ? "https://ic0.app" // Mainnet
    : `http://127.0.0.1:4943`; // Localnet

const identityProvider =
  network === "ic"
    ? "https://identity.ic0.app" // Mainnet
    : `http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943`; // Local

const defaultOptions = {
  createOptions: {
    idleOptions: {
      disableIdle: true,
    },
  },
  loginOptions: {
    identityProvider,
  },
};

const canisterId =
  process.env.NEXT_PUBLIC_BACKEND_CANISTER_ID || "u6s2n-gx777-77774-qaaba-cai";

export const useAuthClient = (options = defaultOptions) => {
  const [isAuth, setIsAuth] = useState(false);
  const [authUser, setAuthUser] = useState<AuthClient | null>(null);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [principal, setPrincipal] = useState<Principal | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [callFunction, setCallFunction] = useState<any | null>(null);

  const updateClient = async (client: AuthClient) => {
    const isAuthenticated = await client.isAuthenticated();
    setIsAuth(isAuthenticated);

    const identity = client.getIdentity();
    setIdentity(identity);

    const principal = identity.getPrincipal();
    setPrincipal(principal);

    setAuthUser(client);

    const actor = createActor(canisterId, {
      agentOptions: {
        identity,
        host,
      },
    });

    setCallFunction(actor);
  };

  useEffect(() => {
    AuthClient.create(options.createOptions).then(async (client) => {
      updateClient(client);
    });
  }, [options.createOptions]);

  const login = async () => {
    await authUser?.login({
      ...options.loginOptions,
      onSuccess: () => {
        updateClient(authUser);
      },
    });
  };

  const logout = async () => {
    await authUser?.logout();
    if (authUser) {
      updateClient(authUser);
    }
  };

  return {
    isAuth,
    login,
    logout,
    authUser,
    identity,
    principal,
    callFunction,
  };
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useAuthClient();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext) as AuthContextType;
};
