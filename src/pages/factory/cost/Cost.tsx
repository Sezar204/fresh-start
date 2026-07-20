import React, { useEffect, useState, useCallback } from "react"
import { useParams } from "react-router-dom"
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react"
import { api } from "@/api/client"
import { useAppStore } from "@/stores/appStore"
import { StatCard } from "@/components/ui/StatCard"
import { Card } from "@/components/ui/card"

export default function Cost() {
  const { factoryId } = useParams<{ factoryId: string }>()
  const fid = factoryId || "1"
  const { notify } = useAppStore()

  const [costs, setCosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get<any>(`/factories/${fid}/product-costs`)
      if (res.success && res.data) setCosts(res.data)
    } catch {
      notify("Failed to load costing and variance details", "error")
    } finally {
      setLoading(false)
    }
  }, [fid, notify])

  useEffect(() => { loadData() }, [loadData])

  return (
    <div className="page-container space-y-6 select-none bg-slate-50 pb-12">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Cost Control & Product Profitability</h1>
          <p className="text-xs text-slate-500">Standard vs Actual material & labor variances, overhead absorption and SKU gross margins.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Plant Gross Revenue" value="$42,800" icon={<DollarSign className="w-5 h-5 text-blue-700" />} color="blue" />
        <StatCard label="Average Product Gross Margin" value="38.4%" icon={<TrendingUp className="w-5 h-5 text-emerald-700" />} color="green" />
        <StatCard label="Material Cost Variance" value="+2.1%" icon={<TrendingDown className="w-5 h-5 text-amber-700" />} color="amber" />
      </div>

      <Card title="Product Line Costing & Margin Analysis">
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-slate-500 font-semibold bg-slate-50">
                <th className="p-3">Product Name</th>
                <th className="p-3">Std Material</th>
                <th className="p-3">Act Material</th>
                <th className="p-3">Std Labor</th>
                <th className="p-3">Act Labor</th>
                <th className="p-3">Total Std Cost</th>
                <th className="p-3">Total Act Cost</th>
                <th className="p-3 font-bold">Variance %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50">
                <td className="p-3 font-bold text-slate-900">Liquid Detergent 1L</td>
                <td className="p-3">$1.80</td>
                <td className="p-3">$1.85</td>
                <td className="p-3">$0.40</td>
                <td className="p-3">$0.42</td>
                <td className="p-3 font-semibold">$2.50</td>
                <td className="p-3 font-semibold text-slate-900">$2.57</td>
                <td className="p-3 font-bold text-amber-600">+2.8%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
