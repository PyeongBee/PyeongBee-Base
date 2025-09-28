import { create } from "zustand";

interface DeviceState {
  isMobile: boolean;
  setIsMobile: (isMobile: boolean) => void;
  checkDevice: () => void;
}

export const useDeviceStore = create<DeviceState>((set) => ({
  isMobile: false,
  setIsMobile: (isMobile: boolean) => set({ isMobile }),
  checkDevice: () => {
    const isMobile = window.innerWidth <= 768; // MOBILE_BREAKPOINT와 동일
    set({ isMobile });
  },
}));
