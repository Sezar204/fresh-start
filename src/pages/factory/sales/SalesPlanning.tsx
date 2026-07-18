import React, { useEffect, useState, useCallback } from "react"
import { useParams } from "react-router-dom"
import * as Tabs from "@radix-ui/react-tabs"
import { ColumnDef } from "@tanstack/react-table"
import { TrendingUp, Plus, Cpu, ShoppingBag } from "lucide-react"
import { api } from "@/api/client"
import { useAppStore } from "@/stores/appStore"
import { SalesOrder } from "@/types"
import { StatCard } from "@/components/ui/StatCard"
import { Table } from "@/components/ui/Table"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { LineChart } from "@/components/charts/LineChart"

export default function SalesPlanning() {
  const { factoryId } = useParams<{ factoryId: string }>()
  const fid = factoryId || "1"
  const { notify } = useAppStore()

  const [activeTab, setActiveTab] = useState("b2b")
  const [orders, setOrders] = useState<SalesOrder[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get<any>(`/factories/${fid}/orders`)
      if (res.success && res.data) setOrders(res.data)
    } catch {
      notify("Failed to load sales orders", "error")
    } finally {
      setLoading(false)
    }
  }, [fid, notify])

  useEffect(() => { loadData() }, [loadData])

  const handleRunCTP = async (orderId: number) => {
    try {
      const res = await api.post<any>(`/factories/${fid}/orders/${orderId}/ctp-analysis`)
      if (res.success) {
        notify(`CTP Analysis: Can commit delivery by ${res.data.committed_date}`, "success")
      }
    } catch {
      notify("CTP Analysis execution error", "error")
    }
  }

  const columns: ColumnDef<SalesOrder, any>[] = [
    { accessorKey: "order_number", header: "Order #", cell: (info) => <span className="font-mono font-bold text-slate-900">{info.getValue()}</span> },
    { accessorKey: "order_date", header: "Order Date", cell: (info) => <span>{info.getValue()}</span> },
    { accessorKey: "required_delivery", header: "Required Delivery", cell: (info) => <span className="font-semibold">{info.getValue()}</span> },
    { accessorKey: "total_value", header: "Total Value", cell: (info) => <span className="font-bold text-slate-900">${Number(info.getValue()).toLocaleString()}</span> },
    { accessorKey: "status", header: "Status", cell: (info) => <Badge variant={info.getValue() === "confirmed" ? "success" : "info"} size="sm">{info.getValue().toUpperCase()}</Badge> },
    {
      id: "ctp",
      header: "Capable to Promise",
      cell: (info) => (
        <Button variant="outline" size="sm" leftIcon={<Cpu className="w-3.5 h-3.5 text-blue-700" />} onClick={() => handleRunCTP(info.row.original.id)}>
          Run CTP
        </Button>
      ),
    },
  ]

  const forecastData = [
    { period: "Week 1", actual: 1200, system: 1250, adjusted: 1300 },
    { period: "Week 2", actual: 1400, system: 1380, adjusted: 1400 },
    { period: "Week 3", actual: 1100, system: 1450, adjusted: 1450 },
    { period: "Week 4", actual: 1600, system: 1500, adjusted: 1550 },
  ]

  return (
    <div className="page-container space-y-6 bg-slate-50 select-none pb-12">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Sales & Demand Planning</h1>
          <p className="text-xs text-slate-500">B2B commercial orders, B2C forecasts, and S&OP alignment.</p>
        </div>
        <Button variant="default" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
          New Sales Order
        </Button>
      </div>

      <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <Tabs.List className="flex border-b border-slate-200 gap-4 text-sm font-semibold">
          <Tabs.Trigger
            value="b2b"
            className="pb-3 px-1 border-b-2 border-transparent cursor-pointer transition-colors hover:text-blue-700 data-[state=active]:border-blue-800 data-[state=active]:text-blue-800 text-slate-500"
          >
            B2B Commercial Orders
          </Tabs.Trigger>
          <Tabs.Trigger
            value="b2c"
            className="pb-3 px-1 border-b-2 border-transparent cursor-pointer transition-colors hover:text-blue-700 data-[state=active]:border-blue-800 data-[state=active]:text-blue-800 text-slate-500"
          >
            B2C Demand Forecast
          </Tabs.Trigger>
          <Tabs.Trigger
            value="sop"
            className="pb-3 px-1 border-b-2 border-transparent cursor-pointer transition-colors hover:text-blue-700 data-[state=active]:border-blue-800 data-[state=active]:text-blue-800 text-slate-500"
          >
            Sales & Operations (S&OP)
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="b2b" className="space-y-6 outline-none">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard label="Total Open Orders" value={orders.length} icon={<ShoppingBag className="w-5 h-5 text-blue-700" />} color="blue" />
            <StatCard label="Confirmed Pipeline" value="$12,500" icon={<TrendingUp className="w-5 h-5 text-emerald-700" />} color="green" />
            <StatCard label="Rush Orders Priority" value="1 Order" color="amber" />
          </div>
          <Table data={orders} columns={columns} isLoading={loading} emptyMessage="No sales orders recorded." />
        </Tabs.Content>

        <Tabs.Content value="b2c" className="space-y-6 outline-none">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 mb-4">4-Week Consumption Demand Projection</h3>
            <LineChart
              data={forecastData}
              xKey="period"
              lines={[
                { key: "actual", name: "Historical Consumption", color: "#64748B", dashed: true },
                { key: "system", name: "AI Moving Avg Forecast", color: "#1E40AF" },
                { key: "adjusted", name: "S&OP Adjusted Target", color: "#16A34A" },
              ]}
              height={300}
            />
          </div>
        </Tabs.Content>

        <Tabs.Content value="sop" className="space-y-6 outline-none">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm text-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">S&OP Consensus Balance</h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b text-slate-500 font-semibold bg-slate-50">
                  <th className="p-3">Product SKU</th>
                  <th className="p-3">B2B Firm Demand</th>
                  <th className="p-3">B2C Forecast</th>
                  <th className="p-3">Total Demand</th>
                  <th className="p-3">Line Capacity</th>
                  <th className="p-3">Consensus Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-3 font-bold">SKU-P100 (Liquid Detergent 1L)</td>
                  <td className="p-3">2,500 units</td>
                  <td className="p-3">1,400 units</td>
                  <td className="p-3 font-bold">3,900 units</td>
                  <td className="p-3 font-bold text-blue-700">4,000 units</td>
                  <td className="p-3"><Badge variant="success" size="sm">BALANCED</Badge></td>
                </tr>
              </tbody>
            </table>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  )
}
