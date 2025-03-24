import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface FavoriteStation {
  stationId: string
  name: string
  latitude: number
  longitude: number
}

interface FavoritesState {
  favorites: FavoriteStation[]
  addFavorite: (station: FavoriteStation) => void
  removeFavorite: (stationId: string) => void
  isFavorite: (stationId: string) => boolean
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (station) => {
        const { favorites } = get()
        if (!favorites.some((f) => f.stationId === station.stationId)) {
          set({ favorites: [...favorites, station] })
        }
      },
      removeFavorite: (stationId) => {
        const { favorites } = get()
        set({ favorites: favorites.filter((f) => f.stationId !== stationId) })
      },
      isFavorite: (stationId) => {
        const { favorites } = get()
        return favorites.some((f) => f.stationId === stationId)
      },
    }),
    {
      name: 'favorites-storage',
    }
  )
)
