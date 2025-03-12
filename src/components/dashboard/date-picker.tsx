'use client';

import * as React from 'react';
import { useEffect } from 'react';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import { addDays, format, subDays } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePostesStore } from '@/stores/usePostesStore';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface DatePickerProps {
    initialStartDate: Date;
    initialEndDate: Date;
}

export function DatePicker({ initialStartDate, initialEndDate }: DatePickerProps) {
    const { fetchPostes } = usePostesStore();
    const [startDate, setStartDate] = React.useState<Date>(initialStartDate);
    const [endDate, setEndDate] = React.useState<Date>(initialEndDate);

    /**
     * Fetch postes when the date range changes.
     */
    useEffect(() => {
        fetchPostes({ startDate, endDate });
    }, [startDate, endDate, fetchPostes]);

    return (
        <Drawer>
            <DrawerTrigger>
                <a className="text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground flex h-7 min-w-0 items-center gap-2 overflow-hidden rounded-md px-2 outline-hidden focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 text-sm group-data-[collapsible=icon]:hidden">
                    <span>
                        {format(startDate, 'P')} to {format(endDate, 'P')}
                    </span>
                </a>
            </DrawerTrigger>
            <DrawerContent className="p-6 text-center">
                <DrawerClose asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-1 right-1 text-primary hover:text-foreground"
                    >
                        <X className="size-6" />
                    </Button>
                </DrawerClose>
                <ScrollArea className="h-[400px] sm:h-[500px] w-full">
                    <DrawerHeader>
                        <DrawerTitle asChild><h2>Select a period</h2></DrawerTitle>
                        <DrawerDescription className="mt-0">
                            Choose a start date and an end date (min. 7 days).
                        </DrawerDescription>
                    </DrawerHeader>

                    {/* Responsive layout: side by side on desktop, stacked on mobile */}
                    <div className="flex flex-col sm:flex-row sm:space-x-10 space-y-4 sm:space-y-0 justify-center">
                        {/* Start Date Picker */}
                        <div className="flex flex-col items-center">
                            <p className="text-sm font-semibold mb-2">Start Date</p>
                            <DayPicker
                                captionLayout="dropdown"
                                required
                                fixedWeeks
                                showOutsideDays
                                mode="single"
                                selected={startDate}
                                onSelect={setStartDate}
                                defaultMonth={startDate}
                                disabled={{ after: addDays(endDate, -7) }} // Ensures a minimum 7-day gap
                            />
                        </div>

                        {/* End Date Picker */}
                        <div className="flex flex-col items-center">
                            <p className="text-sm font-semibold mb-2">End Date</p>
                            <DayPicker
                                captionLayout="dropdown"
                                required
                                fixedWeeks
                                showOutsideDays
                                mode="single"
                                selected={endDate}
                                onSelect={setEndDate}
                                defaultMonth={endDate}
                                disabled={{
                                    before: addDays(startDate, 7), // Ensures a minimum 7-day gap
                                    after: subDays(new Date(), 1), // Prevents selecting future dates
                                }}
                            />
                        </div>
                    </div>
                </ScrollArea>
            </DrawerContent>
        </Drawer>
    );
}
