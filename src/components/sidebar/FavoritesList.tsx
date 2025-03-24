import { useFavoritesStore, type FavoriteStation } from '@/stores/useFavoritesStore'
import { useMapStore } from '@/stores/useMapStore'
import { usePopupStore } from '@/stores/usePopupStore'
import { XCircle } from 'lucide-react'
import { Poste } from '@/graphql/generated'
import { SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'

export function FavoritesList() {
  const { favorites, removeFavorite } = useFavoritesStore()
  const { flyToLocation } = useMapStore()
  const { openDrawer } = usePopupStore()

  if (favorites.length === 0) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        No favorite stations
      </div>
    )
  }

  const handleStationClick = (station: FavoriteStation) => {
    // Fly to the station location with a zoom level of 11
    flyToLocation(station.longitude, station.latitude, 11)
    // Create a minimal Poste object with required fields
    const poste: Poste = {
      numPoste: station.stationId,
      nomUsuel: station.name,
      lat: station.latitude,
      lon: station.longitude,
      commune: '',
      observations: [],
      posteOuvert: true,
      __typename: 'Poste'
    }
    openDrawer(poste)
  }

  return (
    <SidebarMenuSub className="px-0 mx-0">
      {favorites.map((station) => (
        <SidebarMenuSubButton asChild key={station.stationId}>
          <SidebarMenuSubItem>
            <SidebarMenuSubButton asChild>
              <div className="flex w-full items-center justify-between">
              <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFavorite(station.stationId)
                  }}
                  asChild
                >
                  <XCircle className="h-3 w-3" />
                </Button>
                <button
                  onClick={() => handleStationClick(station)}
                  className="flex-1 text-left"
                >
                  <div className="font-medium text-xs">{station.name} <span className="text-xs text-muted-foreground">#{station.stationId}</span></div>
                </button>
              </div>
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        </SidebarMenuSubButton>
      ))}
    </SidebarMenuSub>
  )
}
