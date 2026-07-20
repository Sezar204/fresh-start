import React, { useEffect, useState, useCallback } from "react"
import { useParams } from "react-router-dom"
import {
  AlertTriangle,
  FileCheck2,
  TrendingUp,
  Play,
  Check,
  X,
  ShoppingCart,
} from "lucide-react"
import { api } from "@/api/client"
import { useAppStore } from "@/stores/appStore"
import { StatCard } from "@/components/ui/StatCard"
import { HealthGauge } from "@/components/ui/HealthGauge"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkline } from "@/components/ui/Sparkline"
import { BarChart } from "@/components/charts/BarChart"
import { PageSkeleton } from "@/components/ui/PageSkeleton"

export default function FactoryDashboard() {
  const { factoryId } = useParams<{ factoryId: string }>()
  const fid = factoryId || "1"
  const { notify } = useAppStore()

  const [loading, setLoading] = useState(true)
  const [runningEngines, setRunningEngines] = useState(false)
  const [alerts, setAlertsList] = useState<any[]>([])
  const [decisions, setDecisionsList] = useState<any[]>([])
  const [criticalMaterials, setCriticalMaterials] = useState<any[]>([])

  const loadDashboardData = useCallback(async () => {
    try {
      const [alertsRes, decisionsRes, materialsRes] = await Promise.allSettled([
        api.get<any>(`/factories/alerts/${fid}`),
        api.get<any>(`/factories/decisions/${fid}/pending`),
        api.get<any>(`/factories/${fid}/inventory/analysis/critical-items`),
      ])

      if (alertsRes.status === "fulfilled" && alertsRes.value?.data) {
        setAlertsList(alertsRes.value.data)
      }
      if (decisionsRes.status === "fulfilled" && decisionsRes.value?.data) {
        setDecisionsList(decisionsRes.value.data)
      }
      if (materialsRes.status === "fulfilled" && materialsRes.value?.data) {
        setCriticalMaterials(materialsRes.value.data)
      }
    } catch (e) {
      notify("Error loading factory workspace metrics", "error")
    } finally {
      setLoading(false)
    }
  }, [fid, notify])

  useEffect(() => {
    loadDashboardData()
    const interval = setInterval(loadDashboardData, 300000) // 5 minutes
    return () => clearInterval(interval)
  }, [loadDashboardData])

  const handleRunEngines = async () => {
    setRunningEngines(true)
    try {
      const res = await api.post<any>(`/engines/run/all/${fid}`)
      if (res.success) {
        notify("Decision engines executed successfully", "success")
        loadDashboardData()
      }
    } catch {
      notify("Failed to run decision engines", "error")
    } finally {
      setRunningEngines(false)
    }
  }

  const handleApproveDecision = async (id: number) => {
    try {
      await api.put(`/factories/decisions/${id}/approve`)
      notify("Decision approved and applied", "success")
      loadDashboardData()
    } catch {
      notify("Failed to approve decision", "error")
    }
  }

  const handleRejectDecision = async (id: number) => {
    try {
      await api.put(`/factories/decisions/${id}/reject`)
      notify("Decision rejected", "info")
      loadDashboardData()
    } catch {
      notify("Failed to reject decision", "error")
    }
  }

  const handleMarkReadAlert = async (id: number) => {
    try {
      await api.put(`/factories/alerts/${id}/read`)
      loadDashboardData()
    } catch {
      // silent
    }
  }

  if (loading) return <PageSkeleton />

  const chartData = [
    { name: "Line 1 (Pack)", planned: 4000, actual: 3850 },
    { name: "Line 2 (Assy)", planned: 1600, actual: 1520 },
    { name: "Line 3 (Proc)", planned: 8000, actual: 8100 },
  ]

  return (
    <div className="page-container space-y-6 bg-slate-50 select-none pb-12">
      {/* Row 1: Key Overview & Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card padding={false} className="flex items-center justify-center p-4">
          <HealthGauge score={88} size="md" />
        </Card>

        <StatCard
          label="Critical Alerts"
          value={alerts.filter((a) => !a.is_resolved).length}
          icon={<AlertTriangle className="w-5 h-5 text-red-600" />}
          color="red"
          trend="down"
          trendValue="-1 since shift start"
        />

        <StatCard
          label="Pending Decisions"
          value={decisions.length}
          icon={<FileCheck2 className="w-5 h-5 text-amber-600" />}
          color="amber"
          trendValue="Requires executive review"
        />

        <StatCard
          label="Plan Adherence"
          value="92.5"
          unit="%"
          icon={<TrendingUp className="w-5 h-5 text-emerald-600" />}
          color="green"
          trend="up"
          trendValue="+2.1% vs target"
        />
      </div>

      {/* Row 2: Production Chart & Mini Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Today's Line Throughput" className="lg:col-span-2">
          <BarChart
            data={chartData}
            xKey="name"
            bars={[
              { key: "planned", name: "Planned Output", color: "#1E40AF" },
              { key: "actual", name: "Actual Output", color: "#16A34A" },
            ]}
            height={260}
          />
        </Card>

        <Card title="Line Schedule" subtitle="Shift 1 Production Progress">
          <div className="space-y-3 text-xs">
            {chartData.map((d) => {
              const pct = Math.round((d.actual / d.planned) * 100)
              return (
                <div key={d.name} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex justify-between font-semibold text-slate-800">
                    <span>{d.name}</span>
                    <span className={pct >= 95 ? "text-emerald-600" : "text-amber-600"}>
                      {pct}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      {/* Row 3: 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">OEE Overall</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">84.2%</p>
            <p className="text-[10px] text-emerald-600 font-semibold mt-1">Target: 85.0%</p>
          </div>
          <Sparkline data={[80, 82, 81, 85, 83, 84]} color="#1E40AF" />
        </Card>

        <Card className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Inventory Days</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">14.5 Days</p>
            <p className="text-[10px] text-emerald-600 font-semibold mt-1">Target: 14.0 Days</p>
          </div>
          <Sparkline data={[18, 16, 15, 14, 15, 14.5]} color="#16A34A" />
        </Card>

        <Card className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">OTIF Delivery</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">94.8%</p>
            <p className="text-[10px] text-emerald-600 font-semibold mt-1">Target: 95.0%</p>
          </div>
          <Sparkline data={[91, 93, 92, 95, 94, 94.8]} color="#0891B2" />
        </Card>

        <Card className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase">Quality FPY</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">97.1%</p>
            <p className="text-[10px] text-emerald-600 font-semibold mt-1">Target: 98.0%</p>
          </div>
          <Sparkline data={[95, 96, 96, 97, 98, 97.1]} color="#D97706" />
        </Card>
      </div>

      {/* Row 4: Critical Alerts & Pending Decisions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Critical Alerts */}
        <Card
          title="Active System Alerts"
          headerAction={
            <Button
              variant="outline"
              size="sm"
              loading={runningEngines}
              leftIcon={<Play className="w-3.5 h-3.5 text-blue-600" />}
              onClick={handleRunEngines}
            >
              Run Decision Engines
            </Button>
          }
        >
          <div className="space-y-3">
            {alerts.length > 0 ? (
              alerts.slice(0, 4).map((a) => (
                <div
                  key={a.id}
                  className="p-3 rounded-lg border border-slate-200 bg-white shadow-sm flex items-start justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          a.severity === "emergency"
                            ? "danger"
                            : a.severity === "critical"
                            ? "danger"
                            : "warning"
                        }
                        size="sm"
                      >
                        {a.severity.toUpperCase()}
                      </Badge>
                      <span className="font-bold text-slate-800">{a.title}</span>
                    </div>
                    <p className="text-slate-600 mt-1">{a.message}</p>
                  </div>
                  {!a.is_read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarkReadAlert(a.id)}
                    >
                      Dismiss
                    </Button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic">No active system alerts.</p>
            )}
          </div>
        </Card>

        {/* Pending Decisions */}
        <Card title="Executive Decisions Required">
          <div className="space-y-3">
            {decisions.length > 0 ? (
              decisions.map((d) => (
                <div
                  key={d.id}
                  className="p-3.5 rounded-lg border border-slate-200 bg-white shadow-sm space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{d.title}</span>
                    <Badge variant="warning" size="sm">
                      {d.priority.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-slate-600">{d.recommendation}</p>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<X className="w-3.5 h-3.5 text-red-600" />}
                      onClick={() => handleRejectDecision(d.id)}
                    >
                      Reject
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      leftIcon={<Check className="w-3.5 h-3.5" />}
                      onClick={() => handleApproveDecision(d.id)}
                    >
                      Approve & Execute
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic">No pending executive decisions.</p>
            )}
          </div>
        </Card>
      </div>

      {/* Row 5: Critical Stock Table */}
      <Card title="Material Shortages & Safety Stock Alerts">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50">
                <th className="p-3">Material Code</th>
                <th className="p-3">Material Name</th>
                <th className="p-3">On Hand</th>
                <th className="p-3">Safety Stock</th>
                <th className="p-3">Coverage (Days)</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {criticalMaterials.map((m, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-bold text-slate-700">{m.material_code}</td>
                  <td className="p-3 font-medium text-slate-900">{m.material_name}</td>
                  <td className="p-3 font-bold text-slate-900">{m.on_hand}</td>
                  <td className="p-3 text-slate-500">{m.safety_stock}</td>
                  <td className="p-3 font-bold text-amber-700">{m.coverage_days}d</td>
                  <td className="p-3">
                    <Badge
                      variant={m.status === "EMERGENCY" ? "danger" : "warning"}
                      size="sm"
                    >
                      {m.status}
                    </Badge>
                  </td>
                  <td className="p-3 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<ShoppingCart className="w-3.5 h-3.5 text-blue-700" />}
                    >
                      Order Stock
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
