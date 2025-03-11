'use server';

export async function checkPdfExists(numPoste: string): Promise<boolean> {
    const pdfUrl = `https://donneespubliques.meteofrance.fr/metadonnees_publiques/fiches/fiche_${numPoste}.pdf`;

    try {
        const response = await fetch(pdfUrl, { method: 'HEAD' });

        return response.ok;
    } catch (error) {
        console.error('Error checking PDF:', error);
        return false;
    }
}
