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
import { ArrowRightFromLine } from 'lucide-react';

export default function PosteDrawer() {
    const { selectedPoste, isOpen, closeDrawer } = usePopupStore();

    return (
        <Drawer open={isOpen} onOpenChange={closeDrawer} direction="right">
            <DrawerContent className="!w-[90%] lg:!w-[75%] !max-w-full border-l-1 border-sidebar-border">
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
                <DrawerFooter>
                    <DrawerClose asChild>
                        <Button variant="outline" className="flex items-center gap-2">
                            Back to map
                            <ArrowRightFromLine size={'sm'} />
                        </Button>
                    </DrawerClose>
                </DrawerFooter>

            </DrawerContent>
        </Drawer>
    );
}
