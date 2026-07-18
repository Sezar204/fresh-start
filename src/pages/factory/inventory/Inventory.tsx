import React, { useEffect, useState, useCallback } from "react"
import { useParams } from "react-router-dom"
import * as Tabs from "@radix-ui/react-tabs"
import { ColumnDef } from "@tanstack/react-table"
import { Package, AlertTriangle } from "lucide-react"
import { api } from "@/api/client"
import { useAppStore } from "@/stores/appStore"
import { StatCard } from "@/components/ui/StatCard"
import { Table } from "@/components/ui/Table"
import { Badge } from "@/components/ui/Badge"
import { Card } from "@/components/ui/Card"

export default function Inventory() {
  const { factoryId } = useParams<{ factoryId: string }>()
  const fid = factoryId || "1"
  const { notify } = useAppStore()

  const [activeTab, setActiveTab] = useState("rm")
  const [rawMaterials, setRawMaterials] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get<any>(`/factories/${fid}/inventory/raw-materials`)
      if (res.success && res.data) setRawMaterials(res.data)
    } catch {
      notify("Failed to load inventory levels", "error")
    } finally {
      setLoading(false)
    }
  }, [fid, notify])

  useEffect(() => { loadData() }, [loadData])

  const columnsRM: ColumnDef<any, any>[] = [
    { accessorKey: "material.code", header: "Code", cell: (info) => <span className="font-mono font-bold">{info.getValue()}</span> },
    { accessorKey: "material.name", header: "Material Name", cell: (info) => <span className="font-semibold text-slate-900">{info.getValue()}</span> },
    { accessorKey: "qty_on_hand", header: "On Hand", cell: (info) => <span className="font-bold">{info.getValue()}</span> },
    { accessorKey: "qty_available", header: "Available", cell: (info) => <span className="font-bold text-emerald-600">{info.getValue()}</span> },
    { accessorKey: "days_coverage", header: "Coverage Days", cell: (info) => <span className="font-bold text-blue-700">{info.getValue()}d</span> },
    {
      accessorKey: "coverage_status",
      header: "Status",
      cell: (info) => (
        <Badge variant={info.getValue() === "critical" ? "danger" : info.getValue() === "warning" ? "warning" : "success"} size="sm">
          {info.getValue().toUpperCase()}
        </Badge>
      ),
    },
  ]

  return (
    <div className="page-container space-y-6 select-none bg-slate-50 pb-12">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Inventory & Stock Control</h1>
          <p className="text-xs text-slate-500">Raw ingredient coverage, WIP staging, finished goods and ABC-XYZ analytics.</p>
        </div>
      </div>

      <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <Tabs.List className="flex border-b border-slate-200 gap-4 text-sm font-semibold">
          <Tabs.Trigger
            value="rm"
            className="pb-3 px-1 border-b-2 border-transparent cursor-pointer transition-colors hover:text-blue-700 data-[state=active]:border-blue-800 data-[state=active]:text-blue-800 text-slate-500"
          >
            Raw Materials & Ingredients
          </Tabs.Trigger>
          <Tabs.Trigger
            value="wip"
            className="pb-3 px-1 border-b-2 border-transparent cursor-pointer transition-colors hover:text-blue-700 data-[state=active]:border-blue-800 data-[state=active]:text-blue-800 text-slate-500"
          >
            Work in Progress (WIP)
          </Tabs.Trigger>
          <Tabs.Trigger
            value="fg"
            className="pb-3 px-1 border-b-2 border-transparent cursor-pointer transition-colors hover:text-blue-700 data-[state=active]:border-blue-800 data-[state=active]:text-blue-800 text-slate-500"
          >
            Finished Goods (FG)
          </Tabs.Trigger>
          <Tabs.Trigger
            value="analysis"
            className="pb-3 px-1 border-b-2 border-transparent cursor-pointer transition-colors hover:text-blue-700 data-[state=active]:border-blue-800 data-[state=active]:text-blue-800 text-slate-500"
          >
            ABC-XYZ Matrix Analysis
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="rm" className="space-y-6 outline-none">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard label="Total Stock Items" value={rawMaterials.length} icon={<Package className="w-5 h-5 text-blue-700" />} color="blue" />
            <StatCard label="Critical Shortages (<3d)" value={rawMaterials.filter((m) => m.coverage_status === "critical").length} icon={<AlertTriangle className="w-5 h-5 text-red-700" />} color="red" />
            <StatCard label="Warning Reorder Stage" value={rawMaterials.filter((m) => m.coverage_status === "warning").length} color="amber" />
          </div>
          <Table data={rawMaterials} columns={columnsRM} isLoading={loading} emptyMessage="No raw material stock records." />
        </Tabs.Content>

        <Tabs.Content value="wip" className="space-y-6 outline-none">
          <Card title="Shop Floor WIP Staging">
            <p className="text-xs text-slate-600">All intermediate chemical batches and un-packaged container runs are in-range.</p>
          </Card>
        </Tabs.Content>

        <Tabs.Content value="fg" className="space-y-6 outline-none">
          <Card title="Finished Product Pallets">
            <p className="text-xs text-slate-600">Warehouse Main: 4,500 total available finished units reserved for B2B orders.</p>
          </Card>
        </Tabs.Content>

        <Tabs.Content value="analysis" className="space-y-6 outline-none">
          <Card title="ABC-XYZ Inventory Matrix">
            <div className="grid grid-cols-3 gap-3 text-center text-xs font-bold font-mono">
              <div className="p-4 bg-red-100 text-red-800 rounded-lg border border-red-200">AX: High Value / Stable (3 Items)</div>
              <div className="p-4 bg-amber-100 text-amber-800 rounded-lg border border-amber-200">AY: High Value / Variable (2 Items)</div>
              <div className="p-4 bg-amber-100 text-amber-800 rounded-lg border border-amber-200">AZ: High Value / Erratic (1 Item)</div>
              <div className="p-4 bg-emerald-100 text-emerald-800 rounded-lg border border-emerald-200">BX: Mid Value / Stable (4 Items)</div>
              <div className="p-4 bg-emerald-100 text-emerald-800 rounded-lg border border-emerald-200">BY: Mid Value / Variable (3 Items)</div>
              <div className="p-4 bg-amber-100 text-amber-800 rounded-lg border border-amber-200">BZ: Mid Value / Erratic (1 Item)</div>
              <div className="p-4 bg-slate-100 text-slate-800 rounded-lg border border-slate-200">CX: Low Value / Stable (1 Item)</div>
              <div className="p-4 bg-slate-100 text-slate-800 rounded-lg border border-slate-200">CY: Low Value / Variable (0 Items)</div>
              <div className="p-4 bg-slate-100 text-slate-800 rounded-lg border border-slate-200">CZ: Dead Stock Risk (0 Items)</div>
            </div>
          </Card>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  )
}
