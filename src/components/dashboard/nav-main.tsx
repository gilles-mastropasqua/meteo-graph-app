'use client';

import { CalendarIcon, ChevronRight, MapPin, Ship, Snowflake, Sun, Waves } from 'lucide-react';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarSeparator,
} from '@/components/ui/sidebar';
import { DatePicker } from '@/components/dashboard/date-picker';
import { subDays } from 'date-fns';
import { useMapStore } from '@/stores/useMapStore';
import React from 'react';


// 📍 France Métropolitaine
const METROPOLE = [
    { name: 'France Métropolitaine', coords: [2.2137, 46.6034], zoom: 5 },
    { name: 'Île-de-France', coords: [2.3515, 48.8566], zoom: 9 },
    { name: 'Provence-Alpes-Côte d\'Azur', coords: [5.9359, 43.9352], zoom: 7 },
    { name: 'Auvergne-Rhône-Alpes', coords: [4.0764, 45.3281], zoom: 7 },
    { name: 'Nouvelle-Aquitaine', coords: [0.5004, 44.8500], zoom: 7 },
    { name: 'Occitanie', coords: [2.1964, 43.8957], zoom: 7 },
    { name: 'Bourgogne-Franche-Comté', coords: [4.7194, 47.2805], zoom: 7 },
    { name: 'Bretagne', coords: [-3.1986, 48.2020], zoom: 7 },
    { name: 'Centre-Val de Loire', coords: [1.7211, 47.7525], zoom: 7 },
    { name: 'Grand Est', coords: [6.1844, 48.6738], zoom: 7 },
    { name: 'Hauts-de-France', coords: [2.9631, 50.4800], zoom: 7 },
    { name: 'Normandie', coords: [0.8632, 49.1829], zoom: 7 },
    { name: 'Pays de la Loire', coords: [-0.9873, 47.8341], zoom: 7 },
    { name: 'Corse', coords: [9.1308, 42.0396], zoom: 8 },
];

// 📍 Départements et Régions d’Outre-Mer (DROM)
const DROM = [
    { name: 'Guadeloupe', coords: [-61.58, 16.25], zoom: 7 },
    { name: 'Martinique', coords: [-61.02, 14.64], zoom: 7 },
    { name: 'Guyane', coords: [-53.12, 3.93], zoom: 6 },
    { name: 'Réunion', coords: [55.5364, -21.1151], zoom: 7 },
    { name: 'Mayotte', coords: [45.1662, -12.8275], zoom: 9 },
];

// 📍 Collectivités d’Outre-Mer (COM)
const COM = [
    { name: 'Saint-Pierre-et-Miquelon', coords: [-56.3333, 46.95], zoom: 7 },
    { name: 'Saint-Martin', coords: [-63.08, 18.07], zoom: 8 },
    { name: 'Saint-Barthélemy', coords: [-62.85, 17.9], zoom: 8 },
    { name: 'Polynésie Française', coords: [-149.42, -17.56], zoom: 7 },
    { name: 'Wallis-et-Futuna', coords: [-176.20, -13.30], zoom: 8 },
    { name: 'Nouvelle-Calédonie', coords: [165.618, -21.299], zoom: 6 },
];

// 📍 Terres Australes et Antarctiques Françaises (TAAF)
const TAAF = [
    { name: 'Îles Kerguelen', coords: [69.35, -49.35], zoom: 5 },
    { name: 'Îles Crozet', coords: [50.23, -46.43], zoom: 6 },
    { name: 'Îles Saint-Paul et Amsterdam', coords: [77.57, -37.83], zoom: 7 },
    { name: 'Terre Adélie', coords: [139.88, -66.67], zoom: 5 },
];

// 📍 Îles Éparses
const ILES_EPARSES = [
    { name: 'Île Europa', coords: [39.67, -22.34], zoom: 9 },
    { name: 'Île Juan de Nova', coords: [42.73, -17.05], zoom: 9 },
    { name: 'Îles Glorieuses', coords: [47.29, -11.58], zoom: 9 },
    { name: 'Île Tromelin', coords: [54.52, -15.89], zoom: 9 },
    // { name: 'Île Bassas da India', coords: [39.67, -21.50], zoom: 9 },
];

// Define region groups
const REGION_GROUPS = [
    { key: 'METRO', label: 'Mainland France', abbr: 'Métropole', regions: METROPOLE, icon: MapPin },
    { key: 'DROM', label: 'Overseas Departments & Regions', abbr: 'DROM', regions: DROM, icon: Sun },
    { key: 'COM', label: 'Overseas Collectivities', abbr: 'COM', regions: COM, icon: Ship },
    { key: 'TAAF', label: 'French Southern & Antarctic Lands', abbr: 'TAAF', regions: TAAF, icon: Snowflake },
    { key: 'ILES', label: 'Scattered Islands', abbr: 'Iles Éparses', regions: ILES_EPARSES, icon: Waves },
];


export function NavMain() {
    const { flyToLocation } = useMapStore();

    return (
        <>
            <SidebarGroup>
                <SidebarGroupLabel>Filters</SidebarGroupLabel>
                <SidebarMenu>
                    <Collapsible asChild defaultOpen={true} open={true} className="group/collapsible">
                        <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton tooltip={'Period'}>
                                    <CalendarIcon />
                                    <span>Selected period</span>
                                    <ChevronRight
                                        className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <SidebarMenuSub>
                                    <SidebarMenuSubItem>
                                        <SidebarMenuSubButton asChild>
                                            <DatePicker
                                                initialStartDate={subDays(new Date(), 30)}
                                                initialEndDate={subDays(new Date(), 1)}
                                            />
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        </SidebarMenuItem>
                    </Collapsible>
                </SidebarMenu>
            </SidebarGroup>

            <SidebarSeparator className="mx-0" />

            <SidebarGroup>
                <SidebarGroupLabel>Places</SidebarGroupLabel>
                <SidebarMenu>
                    {REGION_GROUPS.map(({ key, label, abbr, regions, icon }) => (
                        // <Collapsible asChild defaultOpen={key === 'METRO'} className="group/collapsible" key={key}>
                        <Collapsible asChild className="group/collapsible" key={key}>
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton tooltip={label}>
                                        {React.createElement(icon, { className: 'w-5 h-5 mr-2' })}
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <span>{abbr}</span>
                                            </TooltipTrigger>
                                            <TooltipContent>{label}</TooltipContent>
                                        </Tooltip>
                                        <ChevronRight
                                            className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {regions.map((region) => (
                                            <SidebarMenuSubButton asChild={true} key={region.name}>
                                                <SidebarMenuSubItem key={region.name}>
                                                    <SidebarMenuSubButton asChild>
                                                        <button
                                                            onClick={() => flyToLocation(region.coords[0], region.coords[1], region.zoom)}>
                                                            {region.name}
                                                        </button>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            </SidebarMenuSubButton>
                                        ))}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    ))}
                </SidebarMenu>
            </SidebarGroup>
            <SidebarSeparator className="mx-0" />
        </>
    );
}
