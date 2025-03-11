'use client';

import { useState } from 'react';
import { ClipboardCheck, Copy } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assure-toi d'avoir une fonction utilitaire pour fusionner les classes

interface CopyableTextProps {
    text: string | number; // Texte à copier
    className?: string; // Permet d'ajouter des classes CSS
    iconClassName?: string; // Classe spécifique pour l'icône
}

export default function CopyableText({ text, className, iconClassName }: CopyableTextProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text.toString());
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Réinitialise après 2s
        } catch (err) {
            console.error('Failed to copy text:', err);
        }
    };

    return (
        <div className={cn('flex items-center gap-2', className)}>
            <span>{text}</span>
            <span onClick={handleCopy} className="cursor-pointer">
        {copied ? (
            <ClipboardCheck className={cn('w-[16px] h-[16-px]', iconClassName)} />
        ) : (
            <Copy className={cn('w-[14px] h-[14-px]', iconClassName)} />
        )}
      </span>
        </div>
    );
}
