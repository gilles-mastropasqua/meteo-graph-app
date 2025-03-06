'use client';

import { usePopupStore } from '@/stores/usePopupStore';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function PostePopup() {
    const { isOpen, selectedPoste, closePopup } = usePopupStore();

    // Prevent rendering when the popup is closed or no poste is selected
    if (!isOpen || !selectedPoste) return null;

    return (
        <Dialog open={isOpen} onOpenChange={closePopup}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>{selectedPoste.nomUsuel || 'Poste'}</DialogTitle>
                </DialogHeader>
                <div className="p-4 space-y-2">
                    <p><strong>Commune:</strong> {selectedPoste.commune}</p>
                    <p><strong>Altitude:</strong> {selectedPoste.alti}m</p>
                    <p><strong>Opening Date:</strong> {selectedPoste.datouvr}</p>
                    <p><strong>Closing Date:</strong> {selectedPoste.datferm || 'Always open'}</p>
                    <div className="flex justify-end">
                        <Button onClick={closePopup}>Close</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
