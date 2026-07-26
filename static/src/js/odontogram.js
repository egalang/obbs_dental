/** @odoo-module **/
import { Component, useState, onWillUpdateProps } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";
import { standardFieldProps } from "@web/views/fields/standard_field_props";

import { ToothDialog, buildConditionOptions } from "./tooth_dialog";
import {
    SURFACES, SURFACE_PATHS, SURFACE_BBOX, FDI_NUMBERS,
    getToothPosition, hitTestSurface, VIEWBOX, MIDLINE_X,
} from "./tooth_layout";
import { CONDITION_COLORS, CONDITION_LABELS } from "./tooth_palette";

class Odontogram extends Component {
    static template = "obbs_dental.Odontogram";
    static components = { ToothDialog };
    static props = { ...standardFieldProps };

    setup() {
        this.orm = useService("orm");
        this.state = useState({
            teeth: [],
            _data: {},
            selectedTooth: null,
            selectedSurface: null,
            editCondition: "",
            editTreatment: "",
            editNotes: "",
            conditionOptions: buildConditionOptions(),
            legendItems: [],
            viewBox: VIEWBOX,
            midlineX: MIDLINE_X,
            viewBoxHeight: parseInt(VIEWBOX.split(' ')[3], 10),
        });
        onWillUpdateProps(() => this._loadFromRecord());
        this._loadFromRecord();
    }

    _loadFromRecord() {
        const raw = this.props.record.data[this.props.name];
        if (!raw) return;
        try {
            this._applyData(JSON.parse(raw));
        } catch (_) {}
    }

    _applyData(data) {
        this.state._data = data;
        this.state.teeth = this._buildTeeth(data);
        this.state.legendItems = this._buildLegend(data);
    }

    _buildTeeth(data) {
        const teeth = [];
        const usedConditions = new Set();
        for (const num of FDI_NUMBERS) {
            const pos = getToothPosition(num);
            const toothData = data[String(num)] || { surfaces: {} };
            const surfaces = {};
            for (const srf of SURFACES) {
                const info = (toothData.surfaces || {})[srf] || {};
                const cond = info.condition || null;
                if (cond) {
                    usedConditions.add(cond);
                    surfaces[srf] = {
                        condition: cond,
                        treatment: info.treatment || "",
                        notes: info.notes || "",
                        color: CONDITION_COLORS[cond] || "#fff",
                    };
                } else {
                    surfaces[srf] = {
                        condition: null,
                        treatment: "",
                        notes: "",
                        color: "#fff",
                    };
                }
            }
            teeth.push({
                number: num,
                x: pos.x,
                y: pos.y,
                surfaces,
            });
        }
        return teeth;
    }

    _buildLegend(data) {
        const conditions = new Set();
        for (const info of Object.values(data)) {
            if (info.surfaces) {
                for (const srf of Object.values(info.surfaces)) {
                    if (srf.condition) conditions.add(srf.condition);
                }
            }
        }
        return Array.from(conditions)
            .map(c => ({
                value: c,
                color: CONDITION_COLORS[c] || "#ccc",
                label: CONDITION_LABELS[c] || c,
            }))
            .sort((a, b) => a.label.localeCompare(b.label));
    }

    onSvgClick(ev) {
        const svg = ev.currentTarget;
        const rect = svg.getBoundingClientRect();
        const vb = svg.getAttribute("viewBox").split(" ").map(Number);
        const vx = (ev.clientX - rect.left) / rect.width * vb[2] + vb[0];
        const vy = (ev.clientY - rect.top) / rect.height * vb[3] + vb[1];
        for (const tooth of this.state.teeth) {
            const lx = vx - tooth.x;
            const ly = vy - tooth.y;
            const srf = hitTestSurface(lx, ly);
            if (srf) {
                this._onSurfaceClick(tooth.number, srf);
                return;
            }
        }
    }

    _onSurfaceClick(toothNumber, surface) {
        const td = this.state._data[String(toothNumber)] || { surfaces: {} };
        const info = (td.surfaces || {})[surface] || {};
        this.state.selectedTooth = toothNumber;
        this.state.selectedSurface = surface;
        this.state.editCondition = info.condition || "";
        this.state.editTreatment = info.treatment || "";
        this.state.editNotes = info.notes || "";
    }

    closeDialog() {
        this.state.selectedTooth = null;
        this.state.selectedSurface = null;
    }

    onConditionChange(ev) {
        this.state.editCondition = ev.target.value;
    }

    onTreatmentChange(ev) {
        this.state.editTreatment = ev.target.value;
    }

    onNotesChange(ev) {
        this.state.editNotes = ev.target.value;
    }

    async saveTooth() {
        const toothNumber = this.state.selectedTooth;
        const surface = this.state.selectedSurface;
        if (!toothNumber || !surface) return;
        const condition = this.state.editCondition;
        if (!condition) return;
        const treatment = this.state.editTreatment;
        const notes = this.state.editNotes;
        const resId = this.props.record.resId;
        if (!resId) return;
        try {
            await this.orm.call(
                "dental.tooth.surface", "create_from_chart", [{
                    patient_id: resId,
                    tooth_number: String(toothNumber),
                    surface: surface,
                    condition: condition,
                    treatment: treatment || false,
                    notes: notes || false,
                }]
            );
            this.closeDialog();
            const [updated] = await this.orm.read(
                "dental.patient", [resId], [this.props.name, "tooth_surface_ids"]
            );
            if (updated) {
                const changes = {};
                if (updated[this.props.name]) {
                    changes[this.props.name] = updated[this.props.name];
                    this._applyData(JSON.parse(updated[this.props.name]));
                }
                if (updated.tooth_surface_ids !== undefined) {
                    changes.tooth_surface_ids = updated.tooth_surface_ids;
                }
                this.props.record.update(changes);
            }
        } catch (err) {
            console.error("Odontogram: Failed to save surface condition:", err);
        }
    }

    srfPath(surface) {
        return SURFACE_PATHS[surface] || '';
    }

    get dialogProps() {
        return {
            toothNumber: this.state.selectedTooth,
            surface: this.state.selectedSurface,
            condition: this.state.editCondition,
            treatment: this.state.editTreatment,
            notes: this.state.editNotes,
            conditionOptions: this.state.conditionOptions,
            onClose: () => this.closeDialog(),
            onSave: () => this.saveTooth(),
            onConditionChange: (ev) => this.onConditionChange(ev),
            onTreatmentChange: (ev) => this.onTreatmentChange(ev),
            onNotesChange: (ev) => this.onNotesChange(ev),
        };
    }
}

export const dentalChartField = {
    component: Odontogram,
    supportedTypes: ["text"],
};

registry.category("fields").add("dental_chart", dentalChartField);
