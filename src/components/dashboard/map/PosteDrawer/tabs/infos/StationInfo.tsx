'use client';

import { useState, useTransition } from 'react';
import { FileText, Info } from 'lucide-react';
import { getStationType } from '@/lib/map';
import { checkPdfExists } from '@/actions/checkPdf';
import CopyableText from '@/components/ui/CopyableText';
import { Poste } from '@/graphql/generated';
import { getDepartementCodeFromNumPoste, getDepartmentNameFromNumPoste } from '@/lib/departments';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const formatDate = (dateStr: string | null | undefined): string => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
    });
};


export default function StationInfo({ selectedPoste }: { selectedPoste: Poste }) {

    return (
        <div className="info_station">
            <div className="space-y-2">
                <table className="w-full text-sm border-spacing-0 rounded-xs overflow-hidden">
                    <thead>
                    <tr>
                        <td colSpan={2} className={'rounded-t-xs'}>
                            <h3 className={'flex gap-1 justify-center'}>
                                <span className={'relative'}>Poste Informations</span>
                                <TooltipProvider delayDuration={1000} skipDelayDuration={500}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                                    <span>
                                                        <Info size={4}
                                                              className={'w-4 h-4 relative top-[-2px] '} />
                                                    </span>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Informations about the station during the selected period.</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </h3>
                        </td>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>Name:</td>
                        <td>
                            <CopyableText text={selectedPoste?.nomUsuel || 'N/A'} className={'flex justify-between'} />
                        </td>
                    </tr>
                    <tr>
                        <td>ID:</td>
                        <td>
                            <CopyableText text={selectedPoste?.numPoste || 'N/A'} className={'flex justify-between'} />
                        </td>
                    </tr>
                    <tr>
                        <td>Department:</td>
                        <td>
                            <CopyableText
                                text={getDepartmentNameFromNumPoste(selectedPoste?.numPoste) + ` (${getDepartementCodeFromNumPoste(selectedPoste?.numPoste)})`}
                                className={'flex justify-between'} />
                        </td>
                    </tr>
                    <tr>
                        <td>City:</td>
                        <td>
                            <CopyableText text={selectedPoste?.commune || 'N/A'} className={'flex justify-between'} />
                        </td>
                    </tr>
                    <tr>
                        <td>Altitude:</td>
                        <td>
                            <CopyableText text={selectedPoste?.alti + ' meters' || 'N/A'}
                                          className={'flex justify-between'} />
                        </td>
                    </tr>
                    <tr>
                        <td>Opening Date:</td>
                        <td>
                            <CopyableText text={formatDate(selectedPoste?.datouvr)}
                                          className={'flex justify-between'} />
                        </td>
                    </tr>
                    <tr>
                        <td>Closing Date:</td>
                        <td>
                            <CopyableText text={formatDate(selectedPoste?.datferm)}
                                          className={'flex justify-between'} />
                        </td>
                    </tr>
                    <tr>
                        <td>Location:</td>
                        <td>
                            <CopyableText text={selectedPoste?.lieuDit || 'N/A'} className={'flex justify-between'} />
                        </td>
                    </tr>
                    <tr>
                        <td>Latitude:</td>
                        <td>
                            <CopyableText text={selectedPoste?.lat || 'N/A'} className={'flex justify-between'} />
                        </td>
                    </tr>
                    <tr>
                        <td>Longitude:</td>
                        <td>
                            <CopyableText text={selectedPoste?.lon || 'N/A'} className={'flex justify-between'} />
                        </td>
                    </tr>
                    <tr>
                        <td>LambX:</td>
                        <td>
                            <CopyableText text={selectedPoste?.lambx || 'N/A'} className={'flex justify-between'} />
                        </td>
                    </tr>
                    <tr>
                        <td>LambY:</td>
                        <td>
                            <CopyableText text={selectedPoste?.lamby || 'N/A'} className={'flex justify-between'} />
                        </td>
                    </tr>
                    <tr>
                        <td>Station Type:</td>
                        <td>
                            <CopyableText text={selectedPoste?.typePosteActuel ?? 'N/A'}
                                          className={'flex justify-between'} />
                        </td>
                    </tr>
                    </tbody>
                    <tfoot>
                    <tr>
                        <td colSpan={2}>
                            <p>{getStationType(selectedPoste?.typePosteActuel)}</p>
                            <DownloadButton numPoste={selectedPoste?.numPoste} />
                        </td>
                    </tr>
                    </tfoot>
                </table>


            </div>
        </div>
    );
}

function DownloadButton({ numPoste }: { numPoste: string | undefined }) {
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleDownload = () => {
        setError(null);

        if (!numPoste) {
            setError('Station ID is missing.');
            return;
        }

        startTransition(async () => {
            const exists = await checkPdfExists(numPoste);

            if (exists) {
                window.open(
                    `https://donneespubliques.meteofrance.fr/metadonnees_publiques/fiches/fiche_${numPoste}.pdf`,
                    '_blank',
                );
            } else {
                setError('This station specifications datasheet is not available.');
            }
        });
    };

    return (
        <div>
            <Button
                className="mt-2 bg-primary text-primary-foreground rounded-xs hover:cursor-pointer hover:bg-primary-foreground hover:text-primary px-1 py-1 h-auto w-auto"
                onClick={handleDownload}
                disabled={isPending}
            >
                <div className="flex items-center gap-2 justify-center w-auto">
                    <FileText className="h-4 w-4" />
                    {isPending ? 'Checking...' : 'Download station specifications'}
                </div>
            </Button>

            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
}
