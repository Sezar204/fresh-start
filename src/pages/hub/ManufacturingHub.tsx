import React, { useEffect, useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Factory as FactoryIcon,
  Plus,
  Building,
  AlertTriangle,
  Activity,
  ArrowRight,
  Globe,
} from "lucide-react"
import { factoriesApi } from "@/api/factories"
import { useAppStore } from "@/stores/appStore"
import { Factory } from "@/types"
import { StatCard } from "@/components/ui/StatCard"
import { HealthGauge } from "@/components/ui/HealthGauge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/Modal"
import { Input } from "@/components/ui/Input"
import { Select } from "@/components/ui/Select"
import { EmptyState } from "@/components/ui/EmptyState"
import { FACTORY_TYPES, CURRENCIES } from "@/constants"

const addFactorySchema = z.object({
  name: z.string().min(2, "Factory name is required"),
  code: z.string().min(2, "Factory code is required"),
  type: z.enum(["b2b", "b2c", "hybrid"]),
  location: z.string().optional(),
  currency: z.string().min(1, "Currency is required"),
  working_start: z.string().min(1, "Start time required"),
  working_end: z.string().min(1, "End time required"),
  notes: z.string().optional(),
})

type AddFactoryFormValues = z.infer<typeof addFactorySchema>

export default function ManufacturingHub() {
  const [factories, setFactoriesList] = useState<Factory[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { setCurrentFactory, setFactories, notify } = useAppStore()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AddFactoryFormValues>({
    resolver: zodResolver(addFactorySchema),
    defaultValues: {
      type: "hybrid",
      currency: "USD",
      working_start: "08:00",
      working_end: "17:00",
    },
  })

  const loadFactories = useCallback(async () => {
    setLoading(true)
    try {
      const res = await factoriesApi.getAll()
      if (res.success && res.data) {
        setFactoriesList(res.data)
        setFactories(res.data)
      }
    } catch (err) {
      notify("Failed to load manufacturing hub data", "error")
    } finally {
      setLoading(false)
    }
  }, [setFactories, notify])

  useEffect(() => {
    loadFactories()
  }, [loadFactories])

  const onSubmit = async (values: AddFactoryFormValues) => {
    setIsSubmitting(true)
    try {
      const res = await factoriesApi.create(values)
      if (res.success) {
        notify("Factory created successfully", "success")
        setIsModalOpen(false)
        reset()
        loadFactories()
      } else {
        notify(res.message || "Failed to create factory", "error")
      }
    } catch (e) {
      notify("Error creating factory", "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEnterWorkspace = (f: Factory) => {
    setCurrentFactory(f)
    navigate(`/factory/${f.id}/dashboard`)
  }

  const activeCount = factories.filter((f) => f.status === "active").length

  return (
    <div className="page-container bg-slate-50 space-y-8 select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-800 flex items-center justify-center text-white shadow-md">
            <FactoryIcon className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Manufacturing Hub
            </h1>
            <p className="text-xs font-medium text-slate-500">
              Enterprise Manufacturing Intelligence & Coordination Platform
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            leftIcon={<Globe className="w-4 h-4 text-slate-600" />}
            onClick={() => navigate("/corporate")}
          >
            Corporate View
          </Button>
          <Button
            type="button"
            variant="default"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsModalOpen(true)}
          >
            Add Factory
          </Button>
        </div>
      </div>

      {/* Group Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Facilities"
          value={factories.length}
          icon={<Building className="w-5 h-5 text-blue-700" />}
          color="blue"
        />
        <StatCard
          label="Active Plants"
          value={activeCount}
          icon={<Activity className="w-5 h-5 text-emerald-700" />}
          color="green"
        />
        <StatCard
          label="Critical Alerts"
          value={2}
          icon={<AlertTriangle className="w-5 h-5 text-red-700" />}
          color="red"
        />
        <StatCard
          label="Avg Health Score"
          value="88 / 100"
          icon={<Activity className="w-5 h-5 text-purple-700" />}
          color="purple"
        />
      </div>

      {/* Factory Cards Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Manufacturing Facilities</h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-64 bg-white rounded-xl border border-slate-200 p-6 skeleton" />
            ))}
          </div>
        ) : factories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {factories.map((f) => (
              <div
                key={f.id}
                onClick={() => handleEnterWorkspace(f)}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-400">
                        {f.code}
                      </span>
                      <Badge variant={f.status === "active" ? "success" : "warning"} size="sm" dot>
                        {f.status.toUpperCase()}
                      </Badge>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-1">{f.name}</h3>
                    {f.location && (
                      <p className="text-xs text-slate-500 mt-0.5 truncate">{f.location}</p>
                    )}
                  </div>
                  <HealthGauge score={88} size="sm" showLabel={false} />
                </div>

                {/* Plant Metrics */}
                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg text-xs border border-slate-100">
                  <div>
                    <p className="text-slate-400 font-medium">Type</p>
                    <p className="font-bold text-slate-800 uppercase">{f.type}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-medium">Plan Adherence</p>
                    <p className="font-bold text-emerald-600">92.5%</p>
                  </div>
                </div>

                {/* Enter Workspace Button */}
                <Button
                  type="button"
                  variant="default"
                  className="w-full justify-between"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEnterWorkspace(f)
                  }}
                >
                  Enter Workspace
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
            <EmptyState
              icon={<FactoryIcon className="w-10 h-10 text-slate-400" />}
              title="No Manufacturing Facilities Yet"
              description="Create your first manufacturing plant workspace to start analyzing capacity, demand, and quality."
              actionLabel="Add First Factory"
              onAction={() => setIsModalOpen(true)}
            />
          </div>
        )}
      </div>

      {/* Add Factory Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Manufacturing Facility"
        description="Configure a new manufacturing plant instance and workspace."
        size="md"
        footer={
          <>
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="default"
              size="sm"
              loading={isSubmitting}
              onClick={handleSubmit(onSubmit)}
            >
              Create Facility
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Factory Name"
              required
              placeholder="e.g. Cairo Plant #1"
              error={errors.name?.message}
              {...register("name")}
            />
            <Input
              label="Factory Code"
              required
              placeholder="e.g. CMP-01"
              error={errors.code?.message}
              {...register("code")}
              onChange={(e) => setValue("code", e.target.value.toUpperCase())}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Operating Model"
              required
              options={FACTORY_TYPES}
              error={errors.type?.message}
              {...register("type")}
            />
            <Select
              label="Base Currency"
              required
              options={CURRENCIES}
              error={errors.currency?.message}
              {...register("currency")}
            />
          </div>

          <Input
            label="Location / Address"
            placeholder="e.g. 10th of Ramadan Industrial Zone"
            error={errors.location?.message}
            {...register("location")}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Shift Start Time"
              type="time"
              required
              error={errors.working_start?.message}
              {...register("working_start")}
            />
            <Input
              label="Shift End Time"
              type="time"
              required
              error={errors.working_end?.message}
              {...register("working_end")}
            />
          </div>
        </form>
      </Modal>
    </div>
  )
}
