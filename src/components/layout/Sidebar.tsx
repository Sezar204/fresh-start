import React, { useState } from "react"
import { NavLink, useNavigate, useParams } from "react-router-dom"
import {
  LayoutDashboard,
  Database,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  Factory as FactoryIcon,
  Package,
  ShoppingCart,
  CheckCircle,
  Warehouse as WarehouseIcon,
  Wrench,
  Users,
  DollarSign,
  BarChart2,
  FileText,
  Settings,
  ArrowLeftRight,
  ChevronLeft,
  Building2,
} from "lucide-react"
import { useAppStore } from "@/stores/appStore"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/utils/cn"

interface SidebarProps {
  collapsed: boolean
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const { currentFactory, setCurrentFactory, toggleSidebar } = useAppStore()
  const [masterDataOpen, setMasterDataOpen] = useState(false)
  const navigate = useNavigate()
  const params = useParams<{ factoryId?: string }>()
  const factoryId = params.factoryId || currentFactory?.id?.toString() || "1"

  const masterDataItems = [
    { label: "Production Lines", path: `/factory/${factoryId}/master-data/production-lines` },
    { label: "Machines", path: `/factory/${factoryId}/master-data/machines` },
    { label: "Shifts", path: `/factory/${factoryId}/master-data/shifts` },
    { label: "Products", path: `/factory/${factoryId}/master-data/products` },
    { label: "BOM / Recipes", path: `/factory/${factoryId}/master-data/bom` },
    { label: "Raw Materials", path: `/factory/${factoryId}/master-data/raw-materials` },
    { label: "Suppliers", path: `/factory/${factoryId}/master-data/suppliers` },
    { label: "Customers", path: `/factory/${factoryId}/master-data/customers` },
    { label: "Warehouses", path: `/factory/${factoryId}/master-data/warehouses` },
  ]

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: `/factory/${factoryId}/dashboard` },
    { label: "Sales Planning", icon: TrendingUp, path: `/factory/${factoryId}/sales` },
    { label: "Production", icon: FactoryIcon, path: `/factory/${factoryId}/production` },
    { label: "Inventory", icon: Package, path: `/factory/${factoryId}/inventory` },
    { label: "Procurement", icon: ShoppingCart, path: `/factory/${factoryId}/procurement` },
    { label: "Quality", icon: CheckCircle, path: `/factory/${factoryId}/quality` },
    { label: "Warehouse", icon: WarehouseIcon, path: `/factory/${factoryId}/warehouse` },
    { label: "Maintenance", icon: Wrench, path: `/factory/${factoryId}/maintenance` },
    { label: "Workforce", icon: Users, path: `/factory/${factoryId}/workforce` },
    { label: "Cost & Profit", icon: DollarSign, path: `/factory/${factoryId}/cost` },
    { label: "KPI Center", icon: BarChart2, path: `/factory/${factoryId}/kpis` },
    { label: "Reports", icon: FileText, path: `/factory/${factoryId}/reports` },
    { label: "Settings", icon: Settings, path: `/factory/${factoryId}/settings` },
  ]

  return (
    <aside
      className={cn(
        "bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-all duration-300 z-20 shrink-0 text-slate-300 select-none",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Top: Factory Header Info */}
      <div className="p-3 border-b border-slate-800 shrink-0">
        {!collapsed ? (
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-white truncate">
                {currentFactory?.name || "Factory Workspace"}
              </h2>
              {currentFactory && (
                <div className="mt-1">
                  <Badge variant="info" size="sm">
                    {currentFactory.type.toUpperCase()}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="p-2 rounded-lg bg-blue-900/40 text-blue-400">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
        )}
      </div>

      {/* Middle: Navigation Links */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {/* Dashboard Link */}
        <NavLink
          to={`/factory/${factoryId}/dashboard`}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer",
              isActive
                ? "bg-blue-800 text-white font-bold"
                : "text-slate-400 hover:bg-slate-800 hover:text-white"
            )
          }
          title={collapsed ? "Dashboard" : undefined}
        >
          <LayoutDashboard className="w-4 h-4 shrink-0 pointer-events-none" />
          {!collapsed && <span className="pointer-events-none">Dashboard</span>}
        </NavLink>

        {/* Master Data Collapsible */}
        <div>
          <button
            type="button"
            onClick={() => setMasterDataOpen(!masterDataOpen)}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
            )}
            title={collapsed ? "Master Data" : undefined}
          >
            <div className="flex items-center gap-3 pointer-events-none">
              <Database className="w-4 h-4 shrink-0" />
              {!collapsed && <span>Master Data</span>}
            </div>
            {!collapsed && (
              <span className="pointer-events-none">
                {masterDataOpen ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
              </span>
            )}
          </button>

          {!collapsed && masterDataOpen && (
            <div className="mt-1 ml-4 pl-3 border-l border-slate-800 space-y-1">
              {masterDataItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "block px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer",
                      isActive
                        ? "bg-blue-800/80 text-white font-bold"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          )}
        </div>

        {/* Remaining Navigation Links */}
        {navItems.slice(1).map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer",
                  isActive
                    ? "bg-blue-800 text-white font-bold"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                )
              }
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-4 h-4 shrink-0 pointer-events-none" />
              {!collapsed && <span className="pointer-events-none">{item.label}</span>}
            </NavLink>
          )
        })}
      </div>

      {/* Bottom Actions */}
      <div className="p-2 border-t border-slate-800 space-y-1 shrink-0">
        <button
          type="button"
          onClick={() => {
            setCurrentFactory(null)
            navigate("/hub")
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
          title={collapsed ? "Switch Factory / Hub" : undefined}
        >
          <ArrowLeftRight className="w-4 h-4 shrink-0 pointer-events-none" />
          {!collapsed && <span className="pointer-events-none">Switch Factory</span>}
        </button>

        <button
          type="button"
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <ChevronLeft
            className={cn("w-4 h-4 transition-transform duration-300 pointer-events-none", collapsed && "rotate-180")}
          />
        </button>
      </div>
    </aside>
  )
}
