import { create } from 'zustand';

/**
 * Define the breadcrumb item type.
 */
type BreadcrumbItem = {
    label: string;
    href: string;
};

/**
 * Zustand store for managing the breadcrumb state.
 */
interface BreadcrumbState {
    items: BreadcrumbItem[];
    setBreadcrumb: (items: BreadcrumbItem[]) => void;
}

export const useBreadcrumbStore = create<BreadcrumbState>((set) => ({
    items: [{ label: 'Dashboard', href: '/dashboard' }], // Default breadcrumb
    setBreadcrumb: (items) => set({ items }),
}));
