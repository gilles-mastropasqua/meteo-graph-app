'use client';

import { usePopupStore } from '@/stores/usePopupStore';
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
import { ArrowRightFromLine, X } from 'lucide-react';
import StationInfo from '@/components/dashboard/map/PosteDrawer/StationInfo';
import { Poste } from '@/graphql/generated';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function PosteDrawer() {
    const { selectedPoste, isOpen, closeDrawer } = usePopupStore();

    return (
        <Drawer open={isOpen} onOpenChange={closeDrawer} direction="right">
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
                    </DrawerTitle>
                    <hr className={'mb-1 mt-0.5 sm:mb-2 sm:mt-1'} />
                    <DrawerDescription asChild>
                        <ScrollArea className="h-[100vh] w-full">
                            <div className="poste_drawer">
                                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                                    <StationInfo selectedPoste={selectedPoste as Poste} />
                                    <div className="aspect-video rounded-xs bg-muted/50 p-2">
                                        <h5 className={'text-lg'}>Available data:</h5>
                                        <ul className={'space-y-1'}>
                                            <li>Temperature</li>
                                            <li>Humidity</li>
                                            <li>Wind</li>
                                            <li>Pressure</li>
                                            <li>Rain</li>
                                        </ul>
                                    </div>
                                    <div className="aspect-video rounded-xs bg-muted/50" />
                                </div>
                                <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min"></div>
                            </div>
                        </ScrollArea>
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
    );
}


