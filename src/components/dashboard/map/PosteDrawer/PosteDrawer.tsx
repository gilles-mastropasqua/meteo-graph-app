'use client';

import { usePopupStore } from '@/stores/usePopupStore';
import { useFavoritesStore } from '@/stores/useFavoritesStore';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { ArrowRightFromLine, Star, X } from 'lucide-react';
import StationInfo from '@/components/dashboard/map/PosteDrawer/tabs/infos/StationInfo';
import { Poste } from '@/graphql/generated';
import NonEmptyFields from '@/components/dashboard/map/PosteDrawer/tabs/infos/NonEmptyFields';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Observations from '@/components/dashboard/map/PosteDrawer/tabs/observations/Observations';
import { ScrollArea } from '@/components/ui/scroll-area';
import Graphs from '@/components/dashboard/map/PosteDrawer/tabs/graphs/Graphs';


export default function PosteDrawer() {
    const { selectedPoste, isOpen, closeDrawer } = usePopupStore();
    const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();

    const toggleFavorite = () => {
        if (!selectedPoste) return;
        if (isFavorite(selectedPoste.numPoste)) {
            removeFavorite(selectedPoste.numPoste);
        } else {
            addFavorite({
                stationId: selectedPoste.numPoste,
                name: selectedPoste.nomUsuel,
                latitude: selectedPoste.lat,
                longitude: selectedPoste.lon,
            });
        }
    };

    return (
        <Drawer open={isOpen} onOpenChange={closeDrawer} direction="right" handleOnly={true}>
            <DrawerContent className="!w-[100%] lg:!w-[75%] !max-w-full border-l-1 border-sidebar-border">

                <DrawerClose asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-1 right-1 text-primary hover:text-foreground"
                    >
                        <X className="size-6" />
                    </Button>
                </DrawerClose>

                <DrawerHeader className={'p-1 sm:p-4'}>
                    <DrawerTitle
                        className={'!text-lg sm:!text-2xl'}>{selectedPoste?.nomUsuel ?? 'Unknown Poste'} <span
                        className={'text-sm sm:text-lg'}>#{selectedPoste?.numPoste ?? 'Unknown ID'}</span>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleFavorite}
                            className={(isFavorite(selectedPoste?.numPoste || '') ? 'text-yellow-500' : '') + ' ml-2'}
                        >
                            <Star className="h-4 w-4" />
                        </Button>
                    </DrawerTitle>
                    {/*<hr className={'mb-1 mt-0.5 sm:mb-2 sm:mt-1'} />*/}
                    <DrawerDescription asChild>


                        <div className="poste_drawer">

                            <Tabs defaultValue="infos" className="w-full relative" orientation="vertical">
                                <TabsList className={'mb-1 rounded-xs flex w-full'}>
                                    <TabsTrigger className={'rounded-xs'} value="infos">
                                        Infos
                                    </TabsTrigger>
                                    <TabsTrigger className={'rounded-xs'} value="observations">
                                        Observations
                                    </TabsTrigger>
                                    <TabsTrigger className={'rounded-xs'} value="Graphs">
                                        Graphs
                                    </TabsTrigger>
                                    {/*<TabsTrigger className={'rounded-xs'} value="download">*/}
                                    {/*    Download*/}
                                    {/*</TabsTrigger>*/}
                                </TabsList>
                                <TabsContent value="infos">
                                    <ScrollArea
                                        className="h-[calc(100vh-120px)] w-full max-w-full overflow-y-auto">
                                        <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                                            <StationInfo selectedPoste={selectedPoste as Poste} />
                                            <NonEmptyFields numPoste={selectedPoste?.numPoste ?? ''} />
                                        </div>
                                    </ScrollArea>

                                </TabsContent>
                                <TabsContent value="observations">
                                    <Observations selectedPoste={selectedPoste as Poste} />
                                </TabsContent>
                                <TabsContent value="Graphs">
                                    <ScrollArea
                                        className="h-[calc(100vh-120px)] w-full max-w-full overflow-y-auto">
                                        <Graphs selectedPoste={selectedPoste as Poste} />
                                    </ScrollArea>
                                </TabsContent>
                                {/*<TabsContent value="download">*/}
                                {/*    <div className="grid auto-rows-min gap-4 md:grid-cols-2">*/}
                                {/*    </div>*/}
                                {/*</TabsContent>*/}
                            </Tabs>
                        </div>
                    </DrawerDescription>
                </DrawerHeader>
                <DrawerFooter className="absolute bottom-0 right-0 p-2">
                    <DrawerClose asChild>
                        <Button
                            className="mt-2 bg-primary text-primary-foreground rounded-xs hover:cursor-pointer hover:bg-primary-foreground hover:text-primary px-0 py-1 h-auto"
                        >
                            <span className={'hidden sm:inline'}>Back to map</span>
                            <ArrowRightFromLine size={10} />
                        </Button>
                    </DrawerClose>
                </DrawerFooter>

            </DrawerContent>
        </Drawer>
        // <Drawer open={isOpen} onOpenChange={closeDrawer} direction="right" handleOnly={true}>
        //     <DrawerContent className="!w-[100%] lg:!w-[75%] !max-w-full border-l-1 border-sidebar-border">
        //     <DrawerClose asChild>
        //             <Button
        //                 variant="ghost"
        //                 size="icon"
        //                 className="absolute top-1 right-1 text-primary hover:text-foreground"
        //             >
        //                 <X className="size-6" />
        //             </Button>
        //         </DrawerClose>
        //
        //         <DrawerHeader className="flex items-center justify-between p-1 sm:p-4">
        //             <div>
        //                 <DrawerTitle
        //                     className={'!text-lg sm:!text-2xl'}>{selectedPoste?.nomUsuel ?? 'Unknown Poste'}
        //                 </DrawerTitle>
        //                 <DrawerDescription>{selectedPoste?.numPoste}</DrawerDescription>
        //                 <Button
        //                     variant="ghost"
        //                     size="icon"
        //                     onClick={toggleFavorite}
        //                     className={isFavorite(selectedPoste?.numPoste || '') ? 'text-yellow-500' : ''}
        //                 >
        //                     <Star className="h-4 w-4" />
        //                 </Button>
        //             </div>
        //
        //
        //
        //         <DrawerDescription asChild>
        //
        //
        //             <div className="poste_drawer">
        //
        //                 <Tabs defaultValue="infos" className="w-full relative" orientation="vertical">
        //                     <TabsList className={'mb-1 rounded-xs flex w-full'}>
        //                         <TabsTrigger className={'rounded-xs'} value="infos">
        //                             Infos
        //                         </TabsTrigger>
        //                         <TabsTrigger className={'rounded-xs'} value="observations">
        //                             Observations
        //                         </TabsTrigger>
        //                         <TabsTrigger className={'rounded-xs'} value="Graphs">
        //                             Graphs
        //                         </TabsTrigger>
        //                         {/*<TabsTrigger className={'rounded-xs'} value="download">*/}
        //                         {/*    Download*/}
        //                         {/*</TabsTrigger>*/}
        //                     </TabsList>
        //                     <TabsContent value="infos">
        //                         <ScrollArea
        //                             className="h-[calc(100vh-120px)] w-full max-w-full overflow-y-auto">
        //                             <div className="grid auto-rows-min gap-4 md:grid-cols-2">
        //                                 <StationInfo selectedPoste={selectedPoste as Poste} />
        //                                 <NonEmptyFields numPoste={selectedPoste?.numPoste ?? ''} />
        //                             </div>
        //                         </ScrollArea>
        //
        //                     </TabsContent>
        //                     <TabsContent value="observations">
        //                         <Observations selectedPoste={selectedPoste as Poste} />
        //                     </TabsContent>
        //                     <TabsContent value="Graphs">
        //                         <ScrollArea
        //                             className="h-[calc(100vh-120px)] w-full max-w-full overflow-y-auto">
        //                             <Graphs selectedPoste={selectedPoste as Poste} />
        //                         </ScrollArea>
        //                     </TabsContent>
        //                     {/*<TabsContent value="download">*/}
        //                     {/*    <div className="grid auto-rows-min gap-4 md:grid-cols-2">*/}
        //                     {/*    </div>*/}
        //                     {/*</TabsContent>*/}
        //                 </Tabs>
        //             </div>
        //         </DrawerDescription>
        //         </DrawerHeader>
        //         <DrawerFooter className="absolute bottom-0 right-0 p-2">
        //             <DrawerClose asChild>
        //                 <Button
        //                     className="mt-2 bg-primary text-primary-foreground rounded-xs hover:cursor-pointer hover:bg-primary-foreground hover:text-primary px-0 py-1 h-auto"
        //                 >
        //                     <span className={'hidden sm:inline'}>Back to map</span>
        //                     <ArrowRightFromLine size={10} />
        //                 </Button>
        //             </DrawerClose>
        //         </DrawerFooter>
        //
        //     </DrawerContent>
        // </Drawer>
    );
}
