import { create } from 'zustand';
import { GetPostesQuery } from '@/graphql/generated';

/**
 * Defines the type for a single poste.
 */
type PosteType = GetPostesQuery['findManyPoste'][0];

/**
 * Zustand store for managing the drawer state.
 */
interface PopupState {
    selectedPoste: PosteType | null;
    isOpen: boolean;
    openDrawer: (poste: PosteType) => void;
    closeDrawer: () => void;
}

export const usePopupStore = create<PopupState>((set) => ({
    selectedPoste: null,
    isOpen: false,
    openDrawer: (poste) => set({ selectedPoste: poste, isOpen: true }),
    closeDrawer: () => set({ selectedPoste: null, isOpen: false }),
}));
