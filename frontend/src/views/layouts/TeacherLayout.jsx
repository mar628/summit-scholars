import React, { useCallback, useContext, useEffect, memo } from 'react';
import {
  School, ChevronRight, ChevronsUpDown, LogOut, House,
  BookOpen, ClipboardList, Notebook, BarChart3, User,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuGroup,
  DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel,
  SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, SidebarProvider, SidebarRail,
} from '@/components/ui/sidebar';
import useLogout from '@/hooks/useLogout';
import { Link, useNavigate } from 'react-router-dom';
import getInitials from '@/helpers/get-initials';
import Context from '@/context/context';
import _ from 'lodash';

const data = {
  navMain: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      url: '#',
      icon: House,
      items: [{ title: 'Overview', url: '/teacher/dashboard' }],
    },
    {
      id: 'homework',
      title: 'Homework',
      url: '#',
      icon: ClipboardList,
      items: [
        { title: 'Homework List', url: '/teacher/homework' },
      ],
    },
    {
      id: 'notes',
      title: 'Notes',
      url: '#',
      icon: Notebook,
      items: [
        { title: 'My Notes', url: '/admin/notes' },
        { title: 'Create Note', url: '/builder' },
      ],
    },
    {
      id: 'progress',
      title: 'Teaching Progress',
      url: '#',
      icon: BarChart3,
      items: [{ title: 'My Progress', url: '/teacher/progress' }],
    },
  ],
};

const TeacherLayout = ({ children }) => {
  const { sidebarState: { isSidebarOpen, navMainAdmin, changeNavMainAdminAction } } = useContext(Context);
  const logoutFunction = useLogout();
  const navigate = useNavigate();

  const toggleNav = useCallback((id) => {
    const value = navMainAdmin[id];
    const updated = _.cloneDeep(navMainAdmin);
    updated[id] = !value;
    changeNavMainAdminAction(updated);
  }, [navMainAdmin]);

  return (
    <SidebarProvider open={isSidebarOpen}>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link to="/teacher/dashboard">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <School className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold">Summit Scholars</span>
                    <span className="text-xs text-muted-foreground">Teacher Portal</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Teacher Menu</SidebarGroupLabel>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <Collapsible
                  key={item.title}
                  asChild
                  open={navMainAdmin[item.id] ?? false}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.title} onClick={() => toggleNav(item.id)}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <Link to={subItem.url}><span>{subItem.title}</span></Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton size="lg">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarFallback className="rounded-lg bg-primary text-primary-foreground text-xs">T</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">Teacher</span>
                      <span className="truncate text-xs text-muted-foreground">teacher</span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" side="bottom" align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => navigate('/settings/my-profile')}>
                      <User /> Profile Settings
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logoutFunction}>
                    <LogOut /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
};

export default memo(TeacherLayout);
