import React, { useEffect, useState, useCallback } from "react"
import { useParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ColumnDef } from "@tanstack/react-table"
import { Plus, Download, Upload, Activity } from "lucide-react"
import { api } from "@/api/client"
import { useAppStore } from "@/stores/appStore"
import { ProductionLine } from "@/types"
import { StatCard } from "@/components/ui/StatCard"
import { SearchBar } from "@/components/ui/SearchBar"
import { Table } from "@/components/ui/Table"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { SlideOver } from "@/components/ui/SlideOver"
import { Modal } from "@/components/ui/Modal"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"

const schema = z.object({
  code: z.string().min(2, "Code is required"),
  name: z.string().min(2, "Name is required"),
  type: z.enum(["discrete", "process", "batch"]),
  capacity_per_hour: z.coerce.number().min(1, "Capacity must be > 0"),
  capacity_unit: z.string().min(1, "Unit required"),
  changeover_minutes: z.coerce.number().min(0),
  status: z.enum(["active", "idle", "maintenance", "down"]),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export default function ProductionLines() {
  const { factoryId } = useParams<{ factoryId: string }>()
  const fid = factoryId || "1"
  const { notify } = useAppStore()

  const [items, setItems] = useState<ProductionLine[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [isSlideOpen, setIsSlideOpen] = useState(false)
  const [isImportOpen, setIsImportOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: "discrete",
      capacity_per_hour: 500,
      capacity_unit: "units/hr",
      changeover_minutes: 30,
      status: "active",
    },
  })

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get<any>(`/factories/${fid}/lines`)
      if (res.success && res.data) {
        setItems(res.data)
      }
    } catch {
      notify("Failed to load production lines", "error")
    } finally {
      setLoading(false)
    }
  }, [fid, notify])

  useEffect(() => {
    loadData()
  }, [loadData])

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true)
    try {
      const res = await api.post<any>(`/factories/${fid}/lines`, values)
      if (res.success) {
        notify("Production line added successfully", "success")
        setIsSlideOpen(false)
        reset()
        loadData()
      }
    } catch {
      notify("Error creating production line", "error")
    } finally {
      setSubmitting(false)
    }
  }

  const columns: ColumnDef<ProductionLine, any>[] = [
    { accessorKey: "code", header: "Code", cell: (info) => <span className="font-mono font-bold text-slate-800">{info.getValue()}</span> },
    { accessorKey: "name", header: "Line Name", cell: (info) => <span className="font-semibold text-slate-900">{info.getValue()}</span> },
    { accessorKey: "type", header: "Type", cell: (info) => <span className="uppercase text-xs font-medium text-slate-500">{info.getValue()}</span> },
    { accessorKey: "capacity_per_hour", header: "Cap / Hr", cell: (info) => <span className="font-bold text-slate-800">{info.getValue()} {info.row.original.capacity_unit}</span> },
    { accessorKey: "changeover_minutes", header: "Changeover", cell: (info) => <span>{info.getValue()} mins</span> },
    {
      accessorKey: "status",
      header: "Status",
      cell: (info) => {
        const val = info.getValue() as string
        return (
          <Badge variant={val === "active" ? "success" : val === "idle" ? "warning" : "danger"} size="sm" dot>
            {val.toUpperCase()}
          </Badge>
        )
      },
    },
  ]

  const filtered = items.filter(
    (i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.code.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="page-container space-y-6 select-none bg-slate-50 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Production Lines</h1>
          <p className="text-xs font-medium text-slate-500">Manage manufacturing lines and hourly rated throughputs.</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" leftIcon={<Upload className="w-3.5 h-3.5" />} onClick={() => setIsImportOpen(true)}>
            Import Excel
          </Button>
          <Button variant="default" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={() => setIsSlideOpen(true)}>
            Add Line
          </Button>
        </div>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Lines" value={items.length} icon={<Activity className="w-5 h-5 text-blue-700" />} color="blue" />
        <StatCard label="Active" value={items.filter((i) => i.status === "active").length} icon={<Activity className="w-5 h-5 text-emerald-700" />} color="green" />
        <StatCard label="Idle" value={items.filter((i) => i.status === "idle").length} icon={<Activity className="w-5 h-5 text-amber-700" />} color="amber" />
        <StatCard label="Down / Maintenance" value={items.filter((i) => i.status === "down" || i.status === "maintenance").length} icon={<Activity className="w-5 h-5 text-red-700" />} color="red" />
      </div>

      {/* Search & Table */}
      <div className="space-y-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by line code or name..." />
        <Table data={filtered} columns={columns} isLoading={loading} emptyMessage="No production lines registered." />
      </div>

      {/* Add Line SlideOver */}
      <SlideOver
        open={isSlideOpen}
        onClose={() => setIsSlideOpen(false)}
        title="Add Production Line"
        subtitle="Configure line throughput and changeover properties."
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsSlideOpen(false)}>Cancel</Button>
            <Button variant="default" size="sm" loading={submitting} onClick={handleSubmit(onSubmit)}>Save Line</Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Line Code" required placeholder="LINE-01" error={errors.code?.message} {...register("code")} onChange={(e) => setValue("code", e.target.value.toUpperCase())} />
          <Input label="Line Name" required placeholder="High-Speed Packaging Line" error={errors.name?.message} {...register("name")} />
          <Select label="Line Type" options={[{ value: "discrete", label: "Discrete Assembly" }, { value: "process", label: "Continuous Process" }, { value: "batch", label: "Batch Mixing" }]} error={errors.type?.message} {...register("type")} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Capacity / Hour" type="number" required error={errors.capacity_per_hour?.message} {...register("capacity_per_hour")} />
            <Input label="Capacity Unit" required placeholder="units/hr" error={errors.capacity_unit?.message} {...register("capacity_unit")} />
          </div>
          <Input label="Changeover Duration (Minutes)" type="number" error={errors.changeover_minutes?.message} {...register("changeover_minutes")} />
          <Select label="Status" options={[{ value: "active", label: "Active" }, { value: "idle", label: "Idle" }, { value: "maintenance", label: "Maintenance" }, { value: "down", label: "Down" }]} error={errors.status?.message} {...register("status")} />
        </form>
      </SlideOver>

      {/* Import Modal */}
      <Modal open={isImportOpen} onClose={() => setIsImportOpen(false)} title="Import Production Lines" description="Upload excel template to bulk import production lines.">
        <div className="space-y-4 text-xs">
          <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>Download Excel Template</Button>
          <div className="p-8 border-2 border-dashed border-slate-300 rounded-xl text-center">
            <p className="text-slate-500">Drag & drop template file here, or click to browse.</p>
          </div>
        </div>
      </Modal>
    </div>
  )
}
