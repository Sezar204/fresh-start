import React, { useEffect, useState, useCallback } from "react"
import { useParams } from "react-router-dom"
import * as Tabs from "@radix-ui/react-tabs"
import { ColumnDef } from "@tanstack/react-table"
import { ShoppingCart, AlertCircle, Plus } from "lucide-react"
import { api } from "@/api/client"
import { useAppStore } from "@/stores/appStore"
import { PurchaseOrder } from "@/types"
import { StatCard } from "@/components/ui/StatCard"
import { Table } from "@/components/ui/Table"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"

export default function Procurement() {
  const { factoryId } = useParams<{ factoryId: string }>()
  const fid = factoryId || "1"
  const { notify } = useAppStore()

  const [activeTab, setActiveTab] = useState("pos")
  const [pos, setPos] = useState<PurchaseOrder[]>([])
  const [mrpReqs, setMrpReqs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [posRes, mrpRes] = await Promise.allSettled([
        api.get<any>(`/factories/${fid}/purchase-orders`),
        api.get<any>(`/factories/${fid}/requirements`),
      ])
      if (posRes.status === "fulfilled" && posRes.value?.data) setPos(posRes.value.data)
      if (mrpRes.status === "fulfilled" && mrpRes.value?.data) setMrpReqs(mrpRes.value.data)
    } catch {
      notify("Failed to load procurement status", "error")
    } finally {
      setLoading(false)
    }
  }, [fid, notify])

  useEffect(() => { loadData() }, [loadData])

  const columnsPO: ColumnDef<PurchaseOrder, any>[] = [
    { accessorKey: "po_number", header: "PO Number", cell: (info) => <span className="font-mono font-bold text-slate-900">{info.getValue()}</span> },
    { accessorKey: "order_date", header: "Order Date", cell: (info) => <span>{info.getValue()}</span> },
    { accessorKey: "expected_delivery", header: "Expected Delivery", cell: (info) => <span className="font-semibold text-amber-700">{info.getValue()}</span> },
    { accessorKey: "total_value", header: "PO Value", cell: (info) => <span className="font-bold text-slate-900">${Number(info.getValue()).toLocaleString()}</span> },
    { accessorKey: "status", header: "Status", cell: (info) => <Badge variant={info.getValue() === "issued" ? "info" : "warning"} size="sm">{info.getValue().toUpperCase()}</Badge> },
  ]

  return (
    <div className="page-container space-y-6 select-none bg-slate-50 pb-12">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Procurement & MRP Materials</h1>
          <p className="text-xs text-slate-500">Purchase order tracking, automated MRP material requirements, and supplier scoring.</p>
        </div>
        <Button variant="default" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
          Issue Purchase Order
        </Button>
      </div>

      <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <Tabs.List className="flex border-b border-slate-200 gap-4 text-sm font-semibold">
          <Tabs.Trigger
            value="pos"
            className="pb-3 px-1 border-b-2 border-transparent cursor-pointer transition-colors hover:text-blue-700 data-[state=active]:border-blue-800 data-[state=active]:text-blue-800 text-slate-500"
          >
            Active Purchase Orders
          </Tabs.Trigger>
          <Tabs.Trigger
            value="mrp"
            className="pb-3 px-1 border-b-2 border-transparent cursor-pointer transition-colors hover:text-blue-700 data-[state=active]:border-blue-800 data-[state=active]:text-blue-800 text-slate-500"
          >
            MRP Requirements Matrix
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="pos" className="space-y-6 outline-none">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard label="Open Purchase Orders" value={pos.length} icon={<ShoppingCart className="w-5 h-5 text-blue-700" />} color="blue" />
            <StatCard label="Overdue PO Shipments" value={1} icon={<AlertCircle className="w-5 h-5 text-red-600" />} color="red" />
            <StatCard label="Total Open Commitment" value="$3,600" color="purple" />
          </div>
          <Table data={pos} columns={columnsPO} isLoading={loading} emptyMessage="No purchase orders active." />
        </Tabs.Content>

        <Tabs.Content value="mrp" className="space-y-6 outline-none">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900">Calculated Net Shortages (MRP Output)</h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b text-slate-500 font-semibold bg-slate-50">
                  <th className="p-3">Required Ingredient</th>
                  <th className="p-3">Gross Requirement</th>
                  <th className="p-3">Current Stock</th>
                  <th className="p-3">Net Shortage</th>
                  <th className="p-3">Required Release Date</th>
                  <th className="p-3">Primary Vendor</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mrpReqs.map((req, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{req.material}</td>
                    <td className="p-3">{req.gross_req} kg</td>
                    <td className="p-3">{req.on_hand} kg</td>
                    <td className="p-3 font-bold text-red-600">{req.net_req} kg</td>
                    <td className="p-3 font-mono">{req.po_date}</td>
                    <td className="p-3 text-slate-600">{req.supplier}</td>
                    <td className="p-3 text-right">
                      <Button variant="default" size="sm">Auto-Draft PO</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  )
}
