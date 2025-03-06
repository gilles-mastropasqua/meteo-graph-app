import { create } from 'zustand';
import { GetPostesQuery } from '@/graphql/generated';
import { getPostesAction } from '@/components/dashboard/map/actions/getPostesAction';

interface PostesFilters {
    startDate: Date;
    endDate: Date;
}

interface PostesState {
    postes: GetPostesQuery['findManyPoste'];
    loading: boolean;
    fetchPostes: (filters: PostesFilters) => Promise<void>;
}

export const usePostesStore = create<PostesState>((set) => ({
    postes: [],
    loading: false,

    /**
     * Fetches postes based on the provided date range filters.
     */
    fetchPostes: async (filters) => {
        set({ loading: true });

        try {
            const data = await getPostesAction(filters);
            set({ postes: data });
        } catch (error) {
            console.error('Error while fetching postes:', error);
        } finally {
            set({ loading: false });
        }
    },
}));
