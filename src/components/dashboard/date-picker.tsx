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
import { addDays, differenceInDays, format, subDays } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePostesStore } from '@/stores/usePostesStore';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface DatePickerProps {
    initialStartDate: Date;
    initialEndDate: Date;
}

const MAX_DAYS = 180; // Maximum 180 days (6 months)
const MIN_DAYS = 7;  // Minimum 7 days

export function DatePicker({ initialStartDate, initialEndDate }: DatePickerProps) {
    const { fetchPostes } = usePostesStore();
    const [startDate, setStartDate] = React.useState<Date>(initialStartDate);
    const [endDate, setEndDate] = React.useState<Date>(initialEndDate);

    /**
     * Updates the start date and ensures constraints on the end date.
     */
    const handleStartDateChange = (date: Date | undefined) => {
        if (!date) return;
        let newEndDate = endDate;

        // Ensure the end date does not exceed the maximum allowed range
        if (differenceInDays(newEndDate, date) > MAX_DAYS) {
            newEndDate = addDays(date, MAX_DAYS);
        }

        // Ensure a minimum period of 7 days
        if (differenceInDays(newEndDate, date) < MIN_DAYS) {
            newEndDate = addDays(date, MIN_DAYS);
        }

        setStartDate(date);
        setEndDate(newEndDate);
    };

    /**
     * Updates the end date and ensures constraints on the start date.
     */
    const handleEndDateChange = (date: Date | undefined) => {
        if (!date) return;
        let newStartDate = startDate;

        // Ensure the start date is within the maximum allowed range
        if (differenceInDays(date, newStartDate) > MAX_DAYS) {
            newStartDate = subDays(date, MAX_DAYS);
        }

        // Ensure a minimum period of 7 days
        if (differenceInDays(date, newStartDate) < MIN_DAYS) {
            newStartDate = subDays(date, MIN_DAYS);
        }

        setStartDate(newStartDate);
        setEndDate(date);
    };

    /**
     * Fetches postes when the date range changes.
     */
    useEffect(() => {
        fetchPostes({ startDate, endDate });
    }, [startDate, endDate, fetchPostes]);

    return (
        <Drawer>
            <DrawerTrigger>
                <a className="text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground flex h-7 min-w-0 items-center gap-2 overflow-hidden rounded-md px-2 outline-hidden focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 text-sm group-data-[collapsible=icon]:hidden">
                    <span>
                        {format(startDate, 'LLL dd, yyyy')} to {format(endDate, 'LLL dd, yyyy')}
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
                            min. 7 days, max. 6 months
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
                                onSelect={handleStartDateChange}
                                defaultMonth={startDate}
                                disabled={{
                                    after: subDays(endDate, MIN_DAYS), // Prevents a period shorter than 7 days
                                }}
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
                                onSelect={handleEndDateChange}
                                defaultMonth={endDate}
                                disabled={{
                                    before: addDays(startDate, MIN_DAYS), // Minimum 7 days after start date
                                    after: subDays(new Date(), 0), // No future dates allowed
                                }}
                            />
                        </div>
                    </div>
                </ScrollArea>
            </DrawerContent>
        </Drawer>
    );
}
