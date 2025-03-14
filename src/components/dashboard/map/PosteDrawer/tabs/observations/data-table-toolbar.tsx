'use client';

import { Table } from '@tanstack/react-table';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { DataTableViewOptions } from '@/components/dashboard/map/PosteDrawer/tabs/observations/data-table-view-options';
import { Input } from '@/components/ui/input';

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
    const globalFilter = table.getState().globalFilter;

    return (
        <div className="flex items-center justify-between mb-2">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="Search..."
                    value={globalFilter ?? ''}
                    onChange={(event) => table.setGlobalFilter(event.target.value)}
                    className="h-6 lg:h-8 w-[150px] lg:w-[250px] text-sm"
                />

                {globalFilter && (
                    <Button
                        variant="ghost"
                        onClick={() => table.setGlobalFilter('')}
                        className="h-8 px-2 lg:px-3"
                    >
                        Reset
                        <X className="h-4 w-4 ml-1" />
                    </Button>
                )}
            </div>

            <DataTableViewOptions table={table} />
        </div>
    );
}
