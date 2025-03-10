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
import { getStationType } from '@/lib/map';

const formatDate = (dateStr: string | null | undefined): string => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
    });
};

export default function PosteDrawer() {
    const { selectedPoste, isOpen, closeDrawer } = usePopupStore();

    return (
        <Drawer open={isOpen} onOpenChange={closeDrawer} direction="right">
            <DrawerContent className="!w-[90%] lg:!w-[75%] !max-w-full border-l-1 border-sidebar-border">

                <DrawerClose asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-1 right-1 text-primary hover:text-foreground"
                    >
                        <X className="size-6" />
                    </Button>
                </DrawerClose>

                {/* ✅ Contenu du Drawer */}
                <DrawerHeader>
                    <DrawerTitle
                        className={'!text-2xl'}>{selectedPoste?.nomUsuel ?? 'Unknown Poste'} <span
                        className={'text-lg'}>#{selectedPoste?.numPoste ?? 'Unknown ID'}</span>
                    </DrawerTitle>
                    <hr className={'mb-2 mt-1'} />
                    <DrawerDescription asChild>
                        {/*<div className="space-y-2">*/}
                        {/*    <p><strong>City:</strong> {selectedPoste?.commune ?? 'N/A'}</p>*/}
                        {/*    <p><strong>Altitude:</strong> {selectedPoste?.alti ?? 'N/A'} m</p>*/}
                        {/*    <p><strong>Station Type:</strong> {selectedPoste?.typePosteActuel ?? 'N/A'}</p>*/}
                        {/*</div>*/}
                        <div className="flex flex-1 flex-col gap-4 pt-0">
                            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                                <div className="aspect-video rounded-sm bg-muted/50 p-2">
                                    <div className="space-y-2">
                                        <table className="w-full text-sm">
                                            <tbody>
                                            <tr>
                                                <td>City:</td>
                                                <td>{selectedPoste?.commune || 'N/A'}</td>
                                            </tr>
                                            <tr>
                                                <td>Altitude:</td>
                                                <td>{selectedPoste?.alti || 'N/A'} m</td>
                                            </tr>
                                            <tr>
                                                <td>Opening Date:</td>
                                                <td>{formatDate(selectedPoste?.datouvr)}</td>
                                            </tr>
                                            <tr>
                                                <td>Closing Date:</td>
                                                <td>{formatDate(selectedPoste?.datferm)}</td>
                                            </tr>
                                            <tr>
                                                <td>Location:</td>
                                                <td>{selectedPoste?.lieuDit || 'N/A'}</td>
                                            </tr>
                                            <tr>
                                                <td>Latitude:</td>
                                                <td>{selectedPoste?.lat}</td>
                                            </tr>
                                            <tr>
                                                <td>Longitude:</td>
                                                <td>{selectedPoste?.lon}</td>
                                            </tr>
                                            <tr>
                                                <td>LambX:</td>
                                                <td>${selectedPoste?.lambx}</td>
                                            </tr>
                                            <tr>
                                                <td>LambY:</td>
                                                <td>{selectedPoste?.lamby}</td>
                                            </tr>
                                            <tr>
                                                <td>Station Type:</td>
                                                <td>{selectedPoste?.typePosteActuel}</td>
                                            </tr>
                                            </tbody>
                                        </table>
                                        <p>{getStationType(selectedPoste?.typePosteActuel)}</p>
                                    </div>
                                </div>
                                <div className="aspect-video rounded-xl bg-muted/50" />
                                <div className="aspect-video rounded-xl bg-muted/50" />
                            </div>
                            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min"></div>
                        </div>
                    </DrawerDescription>
                </DrawerHeader>

                <DrawerFooter className="absolute bottom-1 right-1 pr-4 pb-4">
                    <DrawerClose asChild>
                        <Button
                            variant="outline"
                            className="w-[150px] flex items-center gap-2 bg-primary text-primary-foreground
                                       hover:bg-primary-foreground hover:text-primary active:bg-primary
                                       active:text-primary-foreground rounded-xs"
                        >
                            Back to map
                            <ArrowRightFromLine size={20} />
                        </Button>
                    </DrawerClose>
                </DrawerFooter>

            </DrawerContent>
        </Drawer>
    );
}
