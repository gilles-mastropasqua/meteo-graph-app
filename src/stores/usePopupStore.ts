import { create } from 'zustand';
import { GetPostesQuery } from '@/graphql/generated';

type PosteType = GetPostesQuery['findManyPoste'][0];

interface PopupState {
    selectedPoste: PosteType | null;
    setSelectedPoste: (poste: PosteType) => void;
}

export const usePopupStore = create<PopupState>((set) => ({
    selectedPoste: null,
    setSelectedPoste: (poste) => set({ selectedPoste: poste }),
}));
