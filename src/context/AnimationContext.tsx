"use client";

import React, { createContext, useContext, useState } from "react";

interface AnimationContextType {
  isSplashComplete: boolean;
  setSplashComplete: (value: boolean) => void;
  isPartnerOverlayOpen: boolean;
  setPartnerOverlayOpen: (value: boolean) => void;
  navbarTheme: "white" | "golden";
  setNavbarTheme: (theme: "white" | "golden") => void;
  isGlobalBookingOpen: boolean;
  setGlobalBookingOpen: (value: boolean) => void;
  villaBookingId: string | null;
  setVillaBookingId: (id: string | null) => void;
  isRathaaOverlayOpen: boolean;
  setRathaaOverlayOpen: (value: boolean) => void;
  isEnquireOverlayOpen: boolean;
  setEnquireOverlayOpen: (value: boolean) => void;
}

const AnimationContext = createContext<AnimationContextType | undefined>(
  undefined,
);

export const AnimationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isSplashComplete, setSplashComplete] = useState(false);
  const [isPartnerOverlayOpen, setPartnerOverlayOpen] = useState(false);
  const [navbarTheme, setNavbarTheme] = useState<"white" | "golden">("golden");
  const [isGlobalBookingOpen, setGlobalBookingOpen] = useState(false);
  const [villaBookingId, setVillaBookingId] = useState<string | null>(null);
  const [isRathaaOverlayOpen, setRathaaOverlayOpen] = useState(false);
  const [isEnquireOverlayOpen, setEnquireOverlayOpen] = useState(false);

  return (
    <AnimationContext.Provider
      value={{
        isSplashComplete,
        setSplashComplete,
        isPartnerOverlayOpen,
        setPartnerOverlayOpen,
        navbarTheme,
        setNavbarTheme,
        isGlobalBookingOpen,
        setGlobalBookingOpen,
        villaBookingId,
        setVillaBookingId,
        isRathaaOverlayOpen,
        setRathaaOverlayOpen,
        isEnquireOverlayOpen,
        setEnquireOverlayOpen,
      }}
    >
      {children}
    </AnimationContext.Provider>
  );
};

export const useAnimation = () => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error("useAnimation must be used within an AnimationProvider");
  }
  return context;
};
