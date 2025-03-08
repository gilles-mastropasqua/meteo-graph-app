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
                    <DrawerTitle>{selectedPoste?.nomUsuel ?? 'Unknown Poste'}</DrawerTitle>
                    <DrawerDescription asChild>
                        <div className="space-y-2">
                            <p><strong>City:</strong> {selectedPoste?.commune ?? 'N/A'}</p>
                            <p><strong>Altitude:</strong> {selectedPoste?.alti ?? 'N/A'} m</p>
                            <p><strong>Station Type:</strong> {selectedPoste?.typePosteActuel ?? 'N/A'}</p>
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
