/** @odoo-module **/
import { Component } from "@odoo/owl";
import { CONDITION_LABELS, CONDITION_COLORS } from "./tooth_palette";
import { SURFACE_LABELS } from "./tooth_layout";

export class ToothDialog extends Component {
    static template = "obbs_dental.ToothDialog";

    static props = {
        toothNumber: { type: Number },
        surface: { type: String },
        condition: { type: String, optional: true },
        treatment: { type: String, optional: true },
        notes: { type: String, optional: true },
        conditionOptions: { type: Array },
        onClose: { type: Function },
        onSave: { type: Function },
        onConditionChange: { type: Function },
        onTreatmentChange: { type: Function },
        onNotesChange: { type: Function },
    };

    get surfaceLabel() {
        return SURFACE_LABELS[this.props.surface] || this.props.surface;
    }
}

export function buildConditionOptions() {
    return Object.entries(CONDITION_LABELS)
        .sort((a, b) => a[1].localeCompare(b[1]));
}
