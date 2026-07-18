import React, { useEffect, useState, useCallback } from "react"
import { useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ColumnDef } from "@tanstack/react-table"
import { Plus, Package } from "lucide-react"
import { api } from "@/api/client"
import { useAppStore } from "@/stores/appStore"
import { Product } from "@/types"
import { StatCard } from "@/components/ui/StatCard"
import { SearchBar } from "@/components/ui/SearchBar"
import { Table } from "@/components/ui/Table"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { SlideOver } from "@/components/ui/SlideOver"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"

const schema = z.object({
  sku: z.string().min(2, "SKU required"),
  name: z.string().min(2, "Name required"),
  unit_of_measure: z.string().min(1),
  standard_cost: z.coerce.number().min(0),
  selling_price: z.coerce.number().min(0),
  type: z.enum(["finished", "semi-finished"]),
})

type FormValues = z.infer<typeof schema>

export default function Products() {
  const { factoryId } = useParams<{ factoryId: string }>()
  const fid = factoryId || "1"
  const { notify } = useAppStore()

  const [items, setItems] = useState<Product[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [isSlideOpen, setIsSlideOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { unit_of_measure: "pcs", type: "finished" },
  })

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get<any>(`/factories/${fid}/products`)
      if (res.success && res.data) setItems(res.data)
    } catch {
      notify("Failed to load product catalog", "error")
    } finally {
      setLoading(false)
    }
  }, [fid, notify])

  useEffect(() => { loadData() }, [loadData])

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true)
    try {
      const res = await api.post<any>(`/factories/${fid}/products`, values)
      if (res.success) {
        notify("Product added", "success")
        setIsSlideOpen(false)
        reset()
        loadData()
      }
    } catch {
      notify("Error creating product", "error")
    } finally {
      setSubmitting(false)
    }
  }

  const columns: ColumnDef<Product, any>[] = [
    { accessorKey: "sku", header: "SKU", cell: (info) => <span className="font-mono font-bold text-slate-800">{info.getValue()}</span> },
    { accessorKey: "name", header: "Product Name", cell: (info) => <span className="font-semibold text-slate-900">{info.getValue()}</span> },
    { accessorKey: "standard_cost", header: "Std Cost", cell: (info) => <span>${Number(info.getValue()).toFixed(2)}</span> },
    { accessorKey: "selling_price", header: "Price", cell: (info) => <span className="font-bold text-slate-900">${Number(info.getValue()).toFixed(2)}</span> },
    {
      id: "margin",
      header: "Gross Margin",
      cell: (info) => {
        const p = info.row.original
        const margin = p.selling_price > 0 ? ((p.selling_price - p.standard_cost) / p.selling_price) * 100 : 0
        return <span className={margin >= 30 ? "text-emerald-600 font-bold" : "text-amber-600 font-bold"}>{margin.toFixed(1)}%</span>
      },
    },
    { accessorKey: "type", header: "Type", cell: (info) => <Badge variant={info.getValue() === "finished" ? "info" : "muted"} size="sm">{info.getValue().toUpperCase()}</Badge> },
  ]

  const filtered = items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()) || i.sku.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="page-container space-y-6 select-none bg-slate-50 pb-12">
      <div className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Products & SKUs</h1>
          <p className="text-xs text-slate-500">Master finished goods and semi-finished component list.</p>
        </div>
        <Button variant="default" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={() => setIsSlideOpen(true)}>Add Product</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total SKUs" value={items.length} icon={<Package className="w-5 h-5 text-blue-700" />} color="blue" />
        <StatCard label="Finished Goods" value={items.filter((i) => i.type === "finished").length} color="green" />
        <StatCard label="Semi-Finished Goods" value={items.filter((i) => i.type === "semi-finished").length} color="purple" />
      </div>

      <div className="space-y-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by SKU or name..." />
        <Table data={filtered} columns={columns} isLoading={loading} emptyMessage="No products found." />
      </div>

      <SlideOver open={isSlideOpen} onClose={() => setIsSlideOpen(false)} title="Add Product SKU" footer={<><Button variant="outline" size="sm" onClick={() => setIsSlideOpen(false)}>Cancel</Button><Button variant="default" size="sm" loading={submitting} onClick={handleSubmit(onSubmit)}>Save</Button></>}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="SKU Code" required placeholder="SKU-P100" error={errors.sku?.message} {...register("sku")} onChange={(e) => setValue("sku", e.target.value.toUpperCase())} />
          <Input label="Product Name" required placeholder="Liquid Detergent 1L" error={errors.name?.message} {...register("name")} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Standard Cost ($)" type="number" step="0.01" error={errors.standard_cost?.message} {...register("standard_cost")} />
            <Input label="Selling Price ($)" type="number" step="0.01" error={errors.selling_price?.message} {...register("selling_price")} />
          </div>
          <Select label="Type" options={[{ value: "finished", label: "Finished Product" }, { value: "semi-finished", label: "Semi-Finished Compound" }]} {...register("type")} />
        </form>
      </SlideOver>
    </div>
  )
}
