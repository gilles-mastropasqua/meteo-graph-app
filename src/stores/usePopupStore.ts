import { create } from 'zustand';
import { GetPostesQuery } from '@/graphql/generated';

/**
 * Defines the type for a single poste from the GraphQL query result.
 */
type PosteType = GetPostesQuery['findManyPoste'][0];

/**
 * Zustand store for managing the popup state.
 */
interface PopupState {
    isOpen: boolean;
    selectedPoste: PosteType | null;
    openPopup: (poste: PosteType) => void;
    closePopup: () => void;
}

export const usePopupStore = create<PopupState>((set) => ({
    isOpen: false,
    selectedPoste: null,
    openPopup: (poste) => set({ isOpen: true, selectedPoste: poste }),
    closePopup: () => set({ isOpen: false, selectedPoste: null }),
}));
