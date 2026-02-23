"use client";

import React, { createContext, useContext, useState } from "react";

interface AnimationContextType {
  isSplashComplete: boolean;
  setSplashComplete: (value: boolean) => void;
  isMenuOpen: boolean;
  setMenuOpen: (value: boolean) => void;
  navbarTheme: "white" | "golden";
  setNavbarTheme: (theme: "white" | "golden") => void;
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
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [navbarTheme, setNavbarTheme] = useState<"white" | "golden">("golden");

  return (
    <AnimationContext.Provider
      value={{
        isSplashComplete,
        setSplashComplete,
        isMenuOpen,
        setMenuOpen,
        navbarTheme,
        setNavbarTheme,
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
