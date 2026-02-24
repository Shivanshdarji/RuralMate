"use client";
import { useState, createContext, useContext } from "react";

const SidebarContext = createContext<{
    isOpen: boolean;
    setIsOpen: (val: boolean) => void;
    toggle: () => void;
}>({
    isOpen: false,
    setIsOpen: () => { },
    toggle: () => { },
});

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);

    return (
        <SidebarContext.Provider value={{ isOpen, setIsOpen, toggle }}>
            {children}
        </SidebarContext.Provider>
    );
};

export const useSidebar = () => useContext(SidebarContext);
