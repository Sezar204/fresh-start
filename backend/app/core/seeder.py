from datetime import datetime, timedelta
from sqlalchemy import select
from app.models import (
    Factory, ProductionLine, Machine, Shift, Product, BOMHeader, BOMLine,
    RawMaterial, InventoryRawMaterial, InventoryFinishedGoods, InventoryWIP,
    Customer, SalesOrder, SalesOrderLine, DemandForecast,
    Supplier, SupplierMaterial, PurchaseOrder, PurchaseOrderLine,
    Warehouse, QualityCheck, NonConformanceReport, CAPARecord,
    MaintenanceSchedule, MaintenanceWorkOrder, MachineBreakdown,
    Worker, ShiftAssignment, AttendanceRecord,
    ProductCost, KPIDefinition, KPIValue, Alert, Decision, AppSetting
)

def seed_demo_data(db):
    # Check if factory already exists
    existing_factory = db.scalar(select(Factory).limit(1))
    if existing_factory:
        return

    today = datetime.utcnow().date()
    today_str = today.strftime("%Y-%m-%d")

    # 1. Factory
    factory = Factory(
        code="CMP-01",
        name="Cairo Manufacturing Plant",
        type="hybrid",
        status="active",
        location="10th of Ramadan City, Industrial Zone A3, Egypt",
        currency="USD",
        timezone="Africa/Cairo",
        working_start="08:00",
        working_end="17:00",
        notes="Primary automated FMCG and pharmaceutical packaging hub."
    )
    db.add(factory)
    db.flush()
    fid = factory.id

    # 2. Production Lines
    lines_data = [
        ("LINE-01", "High-Speed Packaging Line 1", "discrete", 500.0, "units/hr", "active", 15),
        ("LINE-02", "Automated Assembly Line 2", "discrete", 200.0, "units/hr", "active", 30),
        ("LINE-03", "Bulk Chemical Processing Line", "process", 1000.0, "kg/hr", "idle", 45),
    ]
    lines = []
    for code, name, ltype, cap, unit, status, chg in lines_data:
        l = ProductionLine(
            factory_id=fid, code=code, name=name, type=ltype,
            capacity_per_hour=cap, capacity_unit=unit, status=status,
            changeover_minutes=chg
        )
        db.add(l)
        lines.append(l)
    db.flush()

    # 3. Machines
    machines_data = [
        ("MAC-101", "Rotary Filler A1", lines[0].id, "Filling", 550, "units/hr", "critical", "active"),
        ("MAC-102", "Laser Capper C2", lines[0].id, "Capping", 520, "units/hr", "high", "active"),
        ("MAC-103", "Automated Labeler L1", lines[0].id, "Labeling", 500, "units/hr", "medium", "maintenance"),
        ("MAC-201", "Robotic Arm Palletizer", lines[1].id, "Packaging", 220, "units/hr", "high", "active"),
        ("MAC-202", "Pneumatic Press P5", lines[1].id, "Pressing", 250, "units/hr", "medium", "active"),
        ("MAC-203", "Conveyor Motor Unit M3", lines[1].id, "Conveyor", 300, "units/hr", "low", "down"),
        ("MAC-301", "Stainless Steel Reactor R101", lines[2].id, "Reactor", 1200, "kg/hr", "critical", "idle"),
        ("MAC-302", "Centrifugal Separator S2", lines[2].id, "Separation", 1000, "kg/hr", "high", "active"),
    ]
    machines = []
    for code, name, lid, mtype, cap, unit, crit, status in machines_data:
        m = Machine(
            factory_id=fid, line_id=lid, code=code, name=name, type=mtype,
            capacity=cap, capacity_unit=unit, criticality=crit, status=status,
            purchase_date="2022-01-15", warranty_expiry="2025-01-15"
        )
        db.add(m)
        machines.append(m)
    db.flush()

    # 4. Shifts
    shifts_data = [
        ("Morning Shift", "06:00", "14:00", 30, [1, 2, 3, 4, 5], 15),
        ("Afternoon Shift", "14:00", "22:00", 30, [1, 2, 3, 4, 5], 12),
        ("Night Shift", "22:00", "06:00", 45, [1, 2, 3, 4, 5], 8),
    ]
    for name, st, et, brk, days, hc in shifts_data:
        s = Shift(
            factory_id=fid, name=name, start_time=st, end_time=et,
            break_minutes=brk, days_of_week=days, headcount=hc, is_active=True
        )
        db.add(s)

    # 5. Products & BOMs
    products_data = [
        ("SKU-P100", "Premium Liquid Detergent 1L", "Cleaning", "bottle", 2.50, 4.50, 100, 2, "finished"),
        ("SKU-P101", "Industrial Disinfectant 5L", "Cleaning", "can", 8.00, 14.00, 50, 3, "finished"),
        ("SKU-P102", "Hand Sanitizer Gel 500ml", "Hygiene", "bottle", 1.20, 2.80, 200, 1, "finished"),
        ("SKU-P103", "Multi-Surface Spray 750ml", "Cleaning", "bottle", 1.80, 3.20, 150, 2, "finished"),
        ("SKU-P104", "Glass Cleaner Formula X", "Cleaning", "bottle", 1.10, 2.20, 150, 2, "finished"),
        ("SKU-P200", "Concentrated Active Surfactant", "Chemicals", "drum", 45.00, 75.00, 10, 5, "semi-finished"),
        ("SKU-P201", "Purified Water Pre-Blend", "Chemicals", "ton", 5.00, 12.00, 5, 1, "semi-finished"),
        ("SKU-P202", "Fragrance Polymer Solution", "Chemicals", "kg", 18.00, 30.00, 25, 4, "semi-finished"),
        ("SKU-P105", "Antibacterial Hand Soap 250ml", "Hygiene", "bottle", 0.90, 1.95, 300, 1, "finished"),
        ("SKU-P106", "Heavy Duty Degreaser 20L", "Industrial", "drum", 22.00, 38.00, 20, 3, "finished"),
    ]
    products = []
    for sku, name, cat, uom, cost, price, moq, lt, ptype in products_data:
        p = Product(
            factory_id=fid, sku=sku, name=name, category=cat, unit_of_measure=uom,
            standard_cost=cost, selling_price=price, min_order_qty=moq, lead_time_days=lt, type=ptype
        )
        db.add(p)
        products.append(p)
    db.flush()

    # 6. Raw Materials
    materials_data = [
        ("RM-001", "PET Bottle Shell 1L", "Packaging", "pcs", 0.15, 5000.0, 8000.0, 5, 2500.0), # Below safety
        ("RM-002", "Plastic Screw Cap 28mm", "Packaging", "pcs", 0.03, 10000.0, 15000.0, 3, 18000.0),
        ("RM-003", "Sodium Lauryl Ether Sulfate (SLES)", "Chemicals", "kg", 1.80, 2000.0, 3000.0, 7, 0.0), # Zero stock
        ("RM-004", "Citric Acid Anhydrous", "Chemicals", "kg", 1.20, 1000.0, 1500.0, 10, 800.0), # Below safety
        ("RM-005", "Ethanol 96% Pure", "Chemicals", "L", 0.90, 3000.0, 4500.0, 4, 1200.0), # Below safety
        ("RM-006", "Deionized Process Water", "Water", "L", 0.01, 20000.0, 30000.0, 1, 45000.0),
        ("RM-007", "Lemon Fresh Fragrance Oil", "Additives", "kg", 25.00, 100.0, 150.0, 14, 250.0),
        ("RM-008", "Blue Colorant Dye D-12", "Additives", "kg", 15.00, 50.0, 80.0, 7, 120.0),
        ("RM-009", "HDPE Can 5L Heavy Duty", "Packaging", "pcs", 0.85, 2000.0, 3000.0, 5, 4500.0),
        ("RM-010", "Trigger Spray Nozzle 28/410", "Packaging", "pcs", 0.22, 4000.0, 6000.0, 8, 9000.0),
        ("RM-011", "Glycerin USP 99.5%", "Chemicals", "kg", 2.10, 800.0, 1200.0, 6, 1500.0),
        ("RM-012", "Carbomer Gel Thickener", "Chemicals", "kg", 12.00, 200.0, 350.0, 12, 500.0),
        ("RM-013", "Front/Back Adhesive Label 1L", "Packaging", "pcs", 0.05, 8000.0, 12000.0, 4, 14000.0),
        ("RM-014", "Cardboard Shipping Master Box", "Packaging", "pcs", 0.60, 1500.0, 2500.0, 5, 3200.0),
        ("RM-015", "Stretch Wrap Film 20mic", "Packaging", "roll", 8.50, 100.0, 150.0, 3, 210.0),
    ]
    materials = []
    for code, name, cat, uom, cost, safety, reorder, lt, onhand in materials_data:
        rm = RawMaterial(
            factory_id=fid, code=code, name=name, category=cat, unit_of_measure=uom,
            standard_cost=cost, safety_stock_qty=safety, reorder_point_qty=reorder, lead_time_days=lt
        )
        db.add(rm)
        materials.append((rm, onhand))
    db.flush()

    # BOM creation for first 5 finished products
    for p in products[:5]:
        bom = BOMHeader(
            factory_id=fid, product_id=p.id, version="1.0",
            name=f"Standard BOM for {p.name}", status="active", yield_pct=98.5
        )
        db.add(bom)
        db.flush()
        line1 = BOMLine(bom_id=bom.id, material_id=materials[0][0].id, quantity_required=1.0, unit="pcs", sequence_no=1)
        line2 = BOMLine(bom_id=bom.id, material_id=materials[1][0].id, quantity_required=1.0, unit="pcs", sequence_no=2)
        line3 = BOMLine(bom_id=bom.id, material_id=materials[2][0].id, quantity_required=0.15, unit="kg", sequence_no=3)
        db.add_all([line1, line2, line3])

    # 7. Warehouse & Inventories
    wh = Warehouse(
        factory_id=fid, code="WH-MAIN", name="Central Plant Warehouse",
        type="general", total_capacity=5000.0, capacity_unit="sqm", location="Building 4"
    )
    db.add(wh)
    db.flush()

    for rm, onhand in materials:
        inv = InventoryRawMaterial(
            factory_id=fid, material_id=rm.id, warehouse_id=wh.id,
            qty_on_hand=onhand, qty_reserved=onhand * 0.1, qty_available=onhand * 0.9,
            batch_number="BAT-2026-001"
        )
        db.add(inv)

    for p in products[:5]:
        inv_fg = InventoryFinishedGoods(
            factory_id=fid, product_id=p.id, warehouse_id=wh.id,
            qty_on_hand=1200.0, qty_reserved=300.0, qty_available=900.0,
            batch_number="FG-2026-A"
        )
        db.add(inv_fg)

    # 8. Suppliers & Customers
    suppliers_data = [
        ("SUP-001", "Al-Ahram Packaging Materials Co.", "Ahmed Hassan", "ahmed@alahrampack.com", "+201001234567", 30, 5),
        ("SUP-002", "Delta Chemical Industries", "Mona Zaki", "m.zaki@deltachem.eg", "+201119876543", 45, 4),
        ("SUP-003", "Nile Polymer & Resins", "Tarek Omar", "tomar@nilepolymer.com", "+201223334444", 30, 4),
        ("SUP-004", "Middle East Fragrance Supplies", "Sara Samir", "sara@mefragrance.com", "+201005556667", 15, 3),
        ("SUP-005", "Global Container Solutions", "Karim Adel", "kadel@gcs-global.com", "+201147778889", 60, 5),
    ]
    suppliers = []
    for code, name, cname, cemail, cphone, pterms, rat in suppliers_data:
        sup = Supplier(
            factory_id=fid, code=code, name=name, contact_name=cname,
            contact_email=cemail, contact_phone=cphone, payment_terms_days=pterms, rating=rat
        )
        db.add(sup)
        suppliers.append(sup)
    db.flush()

    customers_data = [
        ("CUST-101", "HyperOne Supermarkets Egypt", "b2b", 5, 50000.0, 30, "Mohamed Said", "m.said@hyperone.com.eg"),
        ("CUST-102", "Carrefour Egypt Distribution", "distributor", 5, 120000.0, 45, "Sherif Mahmoud", "s.mahmoud@maf.com"),
        ("CUST-103", "Kazyon Discount Stores", "b2b", 4, 35000.0, 30, "Ayman Fathy", "ayman@kazyon.com"),
        ("CUST-104", "Metro Markets FMCG Group", "b2b", 4, 40000.0, 30, "Laila Nour", "laila@metromarkets.com.eg"),
        ("CUST-105", "PharmaCare Regional Logistics", "distributor", 3, 25000.0, 15, "Hassan Radwan", "hassan@pharmacare.eg"),
    ]
    customers = []
    for code, name, ctype, prio, cred, pterms, cname, cemail in customers_data:
        cust = Customer(
            factory_id=fid, code=code, name=name, type=ctype, priority=prio,
            credit_limit=cred, payment_terms_days=pterms, contact_name=cname, contact_email=cemail
        )
        db.add(cust)
        customers.append(cust)
    db.flush()

    # 9. Sales Orders & Purchase Orders
    so1 = SalesOrder(
        factory_id=fid, customer_id=customers[0].id, order_number="ORD-20260718-001",
        order_date=today_str, required_delivery=(today + timedelta(days=5)).strftime("%Y-%m-%d"),
        status="confirmed", total_value=12500.0, currency="USD", is_rush_order=True, priority=5
    )
    db.add(so1)
    db.flush()
    db.add(SalesOrderLine(order_id=so1.id, product_id=products[0].id, quantity=2500, unit_price=4.50, line_total=11250.0))

    po1 = PurchaseOrder(
        factory_id=fid, supplier_id=suppliers[1].id, po_number="PO-20260710-003",
        order_date=(today - timedelta(days=8)).strftime("%Y-%m-%d"),
        expected_delivery=(today - timedelta(days=2)).strftime("%Y-%m-%d"), # Overdue
        status="issued", total_value=3600.0, currency="USD"
    )
    db.add(po1)
    db.flush()
    db.add(PurchaseOrderLine(po_id=po1.id, material_id=materials[2][0].id, qty_ordered=2000, unit_price=1.80))

    # 10. Quality Checks, NCR, CAPA
    qc1 = QualityCheck(
        factory_id=fid, check_type="iqc", material_id=materials[0][0].id,
        status="failed", checked_at=today_str, sample_size=200, defects_found=18,
        defect_rate_pct=9.0, decision="REJECTED", notes="Dimensional variance in PET bottle neck."
    )
    db.add(qc1)
    db.flush()

    ncr = NonConformanceReport(
        factory_id=fid, ncr_number="NCR-2026-001", title="PET Bottle Neck Mold Defect",
        severity="critical", quality_check_id=qc1.id, status="open",
        description="Supplier shipment batch B-902 showed 9% defect rate exceeding allowable 2% tolerance."
    )
    db.add(ncr)
    db.flush()

    capa = CAPARecord(
        factory_id=fid, capa_number="CAPA-2026-001", type="corrective", ncr_id=ncr.id,
        description="Require supplier to recalibrate Mold Machine #4 and issue re-inspection certificate.",
        responsible_person="Quality Manager - Eng. Gamal", due_date=(today + timedelta(days=7)).strftime("%Y-%m-%d"),
        status="in_progress"
    )
    db.add(capa)

    # 11. Maintenance WOs
    wo1 = MaintenanceWorkOrder(
        factory_id=fid, machine_id=machines[2].id, wo_number="WO-2026-089",
        type="preventive", status="in_progress", priority="high",
        description="Quarterly overhaul and optic sensor cleaning on Automated Labeler L1.",
        assigned_to="Senior Technician Mahmoud", downtime_hours=4.5
    )
    db.add(wo1)

    # 12. Workers & Attendance
    for i in range(1, 11):
        w = Worker(
            factory_id=fid, employee_id=f"EMP-100{i}", name=f"Worker {i}",
            department="Operations", role="Operator", skills=["Packaging", "QC Basic"], status="active"
        )
        db.add(w)
        db.flush()
        att = AttendanceRecord(
            factory_id=fid, worker_id=w.id, record_date=today_str, status="present", ot_hours=1.5
        )
        db.add(att)

    # 13. KPIs
    kpis_def = [
        ("OEE-GLOBAL", "Overall Equipment Effectiveness (OEE)", "Production", "%", 85.0, 75.0, 65.0, True, "percentage"),
        ("OTIF-DELIVERY", "On-Time In-Full Delivery Rate", "Sales", "%", 95.0, 90.0, 80.0, True, "percentage"),
        ("FPY-QUALITY", "First Pass Yield (FPY)", "Quality", "%", 98.0, 95.0, 90.0, True, "percentage"),
        ("INV-DAYS", "Inventory Days of Supply", "Inventory", "Days", 14.0, 21.0, 30.0, False, "number"),
    ]
    for code, name, cat, unit, target, warn, crit, hbetter, fmt in kpis_def:
        kpi = KPIDefinition(
            factory_id=fid, code=code, name=name, category=cat, unit=unit,
            target_value=target, warning_threshold=warn, critical_threshold=crit,
            higher_is_better=hbetter, display_format=fmt
        )
        db.add(kpi)
        db.flush()

        val = KPIValue(
            kpi_id=kpi.id, factory_id=fid, period_type="daily", period_date=today_str,
            value=target * 0.95, status="good", trend_json=[82, 84, 81, 85, 83, 86, 84]
        )
        db.add(val)

    # 14. Alerts & Decisions
    a1 = Alert(
        factory_id=fid, alert_type="RAW_MATERIAL_ZERO", severity="emergency",
        title="CRITICAL: SLES Raw Material Out of Stock",
        message="SLES chemical inventory is at 0 kg. Production Line 3 detergent batches halted.",
        source_module="Inventory", is_read=False, is_resolved=False
    )
    a2 = Alert(
        factory_id=fid, alert_type="PO_OVERDUE", severity="critical",
        title="Overdue Purchase Order PO-20260710-003",
        message="Supplier Delta Chemical is 2 days late on PO-20260710-003 delivery.",
        source_module="Procurement", is_read=False, is_resolved=False
    )
    a3 = Alert(
        factory_id=fid, alert_type="MACHINE_DOWN", severity="warning",
        title="Conveyor Motor Unit M3 Offline",
        message="Conveyor Motor Unit M3 is currently in DOWN status on Assembly Line 2.",
        source_module="Maintenance", is_read=True, is_resolved=False
    )
    db.add_all([a1, a2, a3])

    d1 = Decision(
        factory_id=fid, decision_type="EMERGENCY_PO", title="Approve Emergency SLES Chemical Order",
        description="SLES stock is depleted. Preferred supplier Delta Chemical has open stock available.",
        recommendation="Approve immediate spot PO for 3,000 kg SLES at $1.85/kg with expedited air freight.",
        priority="urgent", status="pending", impact_summary={"Cost": "+$150 freight", "Downtime Prevented": "36 hrs"}
    )
    d2 = Decision(
        factory_id=fid, decision_type="RESCHEDULE_LINE", title="Reschedule Order ORD-20260718-001 to Line 1",
        description="Packaging Line 2 downtime requires moving rush order ORD-20260718-001.",
        recommendation="Shift 2,500 units to Line 1 starting tomorrow at 08:00 AM.",
        priority="high", status="pending", impact_summary={"OTD Risk": "Cleared", "Line 1 Capacity Used": "92%"}
    )
    db.add_all([d1, d2])

    # 15. Default Settings
    db.add(AppSetting(key="language", value="en"))
    db.add(AppSetting(key="theme", value="dark"))
    db.add(AppSetting(key="auto_backup", value="true"))

    db.commit()
