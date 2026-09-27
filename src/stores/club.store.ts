import { create } from 'zustand';

const CURRENT_CLUB_KEY = 'rasttro:currentClubId';

interface ClubContextState {
  currentClubId: string | null;
  setCurrentClubId: (clubId: string | null) => void;
}

export const useClubStore = create<ClubContextState>((set) => ({
  currentClubId: localStorage.getItem(CURRENT_CLUB_KEY),
  setCurrentClubId: (clubId) => {
    if (clubId) localStorage.setItem(CURRENT_CLUB_KEY, clubId);
    else localStorage.removeItem(CURRENT_CLUB_KEY);
    set({ currentClubId: clubId });
  },
}));
