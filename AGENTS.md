# Agent Conventions

## Odoo 19 Specifics

- **Security groups**: Use `res.groups.privilege` pattern — `ir.module.category` → `res.groups.privilege` (via `category_id`) → `res.groups` (via `privilege_id`). Groups no longer have `category_id`/`category_ids` fields.
- **Search views**: Use `<group name="group_by">` with `<filter domain="[]" ...>` inside. No `expand`/`string` attributes on group element.
- **Commands**: Use `Command.link(ref(...))` or `eval="[(4, ref(...))]"` syntax.

## Dental Chart Widget (Milestone 3 — Completed)

- **Field widget**: `dental_chart` registered in `static/src/js/dental_chart.js` via `registry.category("fields").add("dental_chart", dentalChartField)` with `supportedTypes: ["text"]`
- **Template**: `obbs_dental.DentalChart` in `static/src/xml/dental_chart.xml` — SVG with viewBox `0 0 1180 500`, rendered inside `<div class="o_dental_chart">`
- **SVG sizing**: Use `width="100%"` as SVG attribute (not inline style). Parent wrapper must have `width: 100%; min-width: 100%` CSS
- **Click handling**: OWL's `t-on-click` on SVG children does NOT work. Instead use `t-on-click="onSvgClick"` on the `<svg>` root and compute which tooth was hit from mouse coordinates mapped through `getBoundingClientRect()` + viewBox math
- **Tooth data**: 32 FDI teeth (11-48) with positions in `TOOTH_POSITIONS` constant. Each tooth is a `<g transform="translate(x,y)">` containing `<path>` (the shape), `<text class="tooth-number">` (FDI number), and optionally `<text class="tooth-label">` (condition name)
- **Tooth paths**: Buccal-view silhouettes in `TOOTH_PATHS` constant — keys `incisor/lateral/canine/premolar/molar` each with `upper`/`lower` variants. Path viewBox is ~56×90 internal units
- **Conditions**: 23 codes (`PR/D/Am/Co/JC/In/S/M/MO/X/XO/Rf/Im/Un/Sp/BR/ABR/ABF/Imp/Abu/Att/Po/Rm`) with unique colors in `CONDITION_COLORS` and labels in `CONDITION_LABELS`
- **Dialog**: Custom `position: fixed` overlay (not Bootstrap modal) with `z-index: 10000`. Uses `<select>` with `t-att-selected` on matching `<option>`, `<input>` and `<textarea>` with `t-att-value`. All change handlers are individual methods (`onConditionChange`, `onTreatmentChange`, `onNotesChange`) — DO NOT use arrow function expressions in `t-on-change`
- **Save flow**: `saveTooth()` calls `orm.call("dental.history", "create_from_chart", [params])` then `orm.read("dental.patient", [resId], [fieldName])`. Writes `this.props.record.data[this.props.name] = jsonStr` to persist across tab switches
- **Data model**: `dental.patient.tooth_conditions` is a non-stored computed Text field (`compute='_compute_tooth_conditions'`, `store=False`). Method `create_from_chart` on `dental.history` creates records and recomputes the field
- **Error prevention**: Load assets cache: `DELETE FROM ir_attachment WHERE url LIKE '/web/assets/%'` followed by module upgrade

## Workflow Requirements

- Every completed milestone MUST include a test procedure so the user can verify functionality.
- Test procedures should be practical steps the user can follow in the Odoo UI, not automated tests.
- After the user confirms a milestone test is successful, update README.md's Development Roadmap to mark that milestone as completed.
