'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
  LayoutDashboard, 
  Image, 
  DollarSign, 
  MessageSquare, 
  LogOut, 
  ChevronLeft,
  Settings,
} from 'lucide-react'
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip"
import { supabase } from '@/lib/supabase'

const sidebarItems = [
  { 
    name: 'Dashboard', 
    href: '/admin/dashboard', 
    icon: LayoutDashboard,
    description: 'Overview of your site'
  },
  { 
    name: 'Banner', 
    href: '/admin/banner', 
    icon: Image,
    description: 'Manage banner images'
  },
  { 
    name: 'Price List', 
    href: '/admin/price-list', 
    icon: DollarSign,
    description: 'Update service prices'
  },
  { 
    name: 'Reviews', 
    href: '/admin/reviews', 
    icon: MessageSquare,
    description: 'Manage customer reviews'
  },
  { 
    name: 'Gallery', 
    href: '/admin/gallery', 
    icon: MessageSquare,
    description: 'Manage Gallery'
  },
]

export function AdminSidebar({ 
  isSidebarOpen, 
  toggleSidebar 
}: { 
  isSidebarOpen: boolean
  toggleSidebar: () => void 
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/admin/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (!mounted) return null

  return (
    <TooltipProvider delayDuration={0}>
      <div
        className={cn(
          "fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out",
          "bg-gradient-to-b from-gray-900 to-gray-800",
          "border-r border-gray-700",
          isSidebarOpen ? "w-64" : "w-20",
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4">
          <div className={cn(
            "flex items-center gap-2 transition-opacity duration-300",
            isSidebarOpen ? "opacity-100" : "opacity-0 invisible"
          )}>
            <Settings className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold text-white">Admin Panel</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className={cn(
              "h-8 w-8 p-0 text-gray-400 hover:text-white",
              !isSidebarOpen && "ml-auto"
            )}
          >
            <ChevronLeft className={cn(
              "h-4 w-4 transition-transform duration-300",
              !isSidebarOpen && "rotate-180"
            )} />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="mt-4 px-3">
          <ul className="space-y-1">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href

              return (
                <li key={item.name}>
                  {isSidebarOpen ? (
                    <Link href={item.href} passHref>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start gap-3 px-3 py-6",
                          "transition-colors duration-200",
                          "text-gray-400 hover:text-white",
                          isActive && "bg-gray-800/50 text-white"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        <div className="flex flex-col items-start">
                          <span>{item.name}</span>
                          <span className="text-xs text-gray-500">{item.description}</span>
                        </div>
                      </Button>
                    </Link>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link href={item.href} passHref>
                          <Button
                            variant="ghost"
                            className={cn(
                              "w-full justify-center p-3",
                              "text-gray-400 hover:text-white",
                              isActive && "bg-gray-800/50 text-white"
                            )}
                          >
                            <item.icon className="h-5 w-5" />
                          </Button>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="flex flex-col">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-xs text-gray-400">{item.description}</span>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {isSidebarOpen ? (
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3 text-gray-400 hover:text-white"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </Button>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="w-full justify-center text-gray-400 hover:text-white"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <span>Logout</span>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}