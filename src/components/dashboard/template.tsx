'use client';

import * as React from 'react';

import MeteoGraphLogo from '../../../public/template/meteo-graph.png';

import { NavMain } from '@/components/dashboard/nav-main';
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarRail,
    SidebarTrigger,
} from '@/components/ui/sidebar';

import Image from 'next/image';
import { ModeToggle } from '@/components/dashboard/mode-toggle';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '../ui/breadcrumb';
import { Separator } from '../ui/separator';
import { useBreadcrumbStore } from '@/stores/useBreadcrumpStore';
import PosteDrawer from '@/components/dashboard/map/PosteDrawer/PosteDrawer';
import { Button } from '@/components/ui/button';

function MeteoGraphLogoContainer() {
    return (
        <>
            <div
                className="flex aspect-square size-6 items-center justify-center rounded-lg text-sidebar-primary-foreground">
                <Image src={MeteoGraphLogo} alt={'Meteo Graph Logo'} className={'-ml-1 -mt-1'} />
            </div>
            <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold text-[12px]">Meteo Graph</span>
                <span className="text-[10px]">v1.0.0</span>
            </div>
        </>
    );
}

export default function DashboardTemplate({ children }: { children: React.ReactNode }) {

    const { items } = useBreadcrumbStore();
    return (
        <SidebarProvider className={'dashboard_container'}>
            <Sidebar collapsible="icon">
                <SidebarHeader className={'h-12 border-b border-sidebar-border'}>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton className={'h-8'} asChild>
                                <a href="/dashboard">
                                    <MeteoGraphLogoContainer />
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
                <SidebarContent>
                    <NavMain />
                </SidebarContent>
                <SidebarRail />
            </Sidebar>
            <SidebarInset className={'overflow-hidden'}>
                <header
                    className="bg-sidebar/85 absolute z-50 w-full flex h-12 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b border-sidebar-border">
                    <div className={'flex justify-between w-full pr-2'}>
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                            <div className={'block md:hidden'}>
                                <a href="/dashboard" className={'flex items-center gap-2 pt-1'}>
                                    <MeteoGraphLogoContainer />
                                </a>
                            </div>
                            <Separator
                                orientation="vertical"
                                className="mr-2 data-[orientation=vertical]:h-4"
                            />
                            <Breadcrumb>
                                <BreadcrumbList>
                                    {items.map((item, index) => (
                                        <React.Fragment key={index}>
                                            <BreadcrumbItem className="hidden md:block">
                                                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                                            </BreadcrumbItem>
                                            {index !== items.length - 1 &&
                                                <BreadcrumbSeparator className="hidden md:block" />}
                                        </React.Fragment>
                                    ))}
                                </BreadcrumbList>
                            </Breadcrumb>

                        </div>
                        <div className={'float-right flex'}>
                            <Button
                                variant="ghost"
                                className="h-8 w-8 px-0 mx-1 "
                                asChild
                            >
                                <a href={'https://github.com/gilles-mastropasqua/meteo-graph-app'} target={'_blank'}>
                                    <Image src={'/template/github.svg'} alt={'Github logo'} width={16} height={16}
                                           className={'dark:invert'} />
                                </a>
                            </Button>
                            <ModeToggle />
                        </div>
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 h-[100dvh] !overflow-hidden relative">
                    {children}
                    <PosteDrawer />
                </div>
            </SidebarInset>

        </SidebarProvider>
    );
}
