/** @odoo-module **/
import { Component, useState, onWillUpdateProps } from "@odoo/owl";
import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";
import { standardFieldProps } from "@web/views/fields/standard_field_props";

const TOOTH_PATHS = {
    incisor: {
        upper: 'M22,5 Q12,8 12,28 Q12,45 16,50 L16,65 Q16,73 22,77 Q26,79 28,79 Q30,79 34,77 Q40,73 40,65 L40,50 Q44,45 44,28 Q44,8 34,5 Q30,4 28,4 Q26,4 22,5 Z',
        lower: 'M22,75 Q12,72 12,52 Q12,35 16,30 L16,15 Q16,7 22,3 Q26,1 28,1 Q30,1 34,3 Q40,7 40,15 L40,30 Q44,35 44,52 Q44,72 34,75 Q30,76 28,76 Q26,76 22,75 Z',
    },
    lateral: {
        upper: 'M24,6 Q14,9 14,28 Q14,44 17,49 L17,63 Q17,71 23,75 Q26,77 28,77 Q30,77 33,75 Q39,71 39,63 L39,49 Q42,44 42,28 Q42,9 33,6 Q30,5 28,5 Q26,5 24,6 Z',
        lower: 'M24,74 Q14,71 14,52 Q14,36 17,31 L17,17 Q17,9 23,5 Q26,3 28,3 Q30,3 33,5 Q39,9 39,17 L39,31 Q42,36 42,52 Q42,71 33,74 Q30,75 28,75 Q26,75 24,74 Z',
    },
    canine: {
        upper: 'M22,5 Q13,7 13,25 Q13,40 16,45 L16,60 Q16,70 22,75 Q26,78 28,78 Q30,78 34,75 Q40,70 40,60 L40,45 Q43,40 43,25 Q43,7 34,5 Q30,4 28,4 Q26,4 22,5 Z',
        lower: 'M22,75 Q13,73 13,55 Q13,40 16,35 L16,20 Q16,10 22,5 Q26,2 28,2 Q30,2 34,5 Q40,10 40,20 L40,35 Q43,40 43,55 Q43,73 34,75 Q30,76 28,76 Q26,76 22,75 Z',
    },
    premolar: {
        upper: 'M16,5 Q10,7 10,22 Q10,35 13,40 Q13,48 10,52 Q8,56 10,62 Q12,70 18,75 Q22,78 28,78 Q34,78 38,75 Q44,70 46,62 Q48,56 46,52 Q43,48 43,40 Q46,35 46,22 Q46,7 40,5 Q34,3 28,3 Q22,3 16,5 Z',
        lower: 'M16,75 Q10,73 10,58 Q10,45 13,40 Q13,32 10,28 Q8,24 10,18 Q12,10 18,5 Q22,2 28,2 Q34,2 38,5 Q44,10 46,18 Q48,24 46,28 Q43,32 43,40 Q46,45 46,58 Q46,73 40,75 Q34,77 28,77 Q22,77 16,75 Z',
    },
    molar: {
        upper: 'M10,5 Q6,8 6,20 Q6,32 8,36 Q8,42 6,46 Q4,50 6,58 Q8,66 14,72 Q18,76 24,77 Q28,78 28,78 Q28,78 32,77 Q38,76 42,72 Q48,66 50,58 Q52,50 50,46 Q48,42 48,36 Q50,32 50,20 Q50,8 46,5 Q40,3 28,3 Q16,3 10,5 Z',
        lower: 'M10,75 Q6,72 6,60 Q6,48 8,44 Q8,38 6,34 Q4,30 6,22 Q8,14 14,8 Q18,4 24,3 Q28,2 28,2 Q28,2 32,3 Q38,4 42,8 Q48,14 50,22 Q52,30 50,34 Q48,38 48,44 Q50,48 50,60 Q50,72 46,75 Q40,77 28,77 Q16,77 10,75 Z',
    },
};

const TOOTH_TYPE_MAP = {
    incisor: [11, 21, 31, 41, 51, 61, 71, 81],
    lateral: [12, 22, 32, 42, 52, 62, 72, 82],
    canine: [13, 23, 33, 43, 53, 63, 73, 83],
    premolar: [14, 15, 24, 25, 34, 35, 44, 45],
    molar: [16, 17, 18, 26, 27, 28, 36, 37, 38, 46, 47, 48],
};

const TOOTH_POSITIONS = {
    18: { x: -480, y: 187 }, 17: { x: -420, y: 177 }, 16: { x: -360, y: 166 },
    15: { x: -300, y: 152 }, 14: { x: -240, y: 135 }, 13: { x: -180, y: 116 },
    12: { x: -110, y: 96 }, 11: { x: -35, y: 85 },
    21: { x: 35, y: 85 }, 22: { x: 110, y: 96 }, 23: { x: 180, y: 116 },
    24: { x: 240, y: 135 }, 25: { x: 300, y: 152 }, 26: { x: 360, y: 166 },
    27: { x: 420, y: 177 }, 28: { x: 480, y: 187 },
    48: { x: -480, y: 313 }, 47: { x: -420, y: 323 }, 46: { x: -360, y: 334 },
    45: { x: -300, y: 348 }, 44: { x: -240, y: 365 }, 43: { x: -180, y: 384 },
    42: { x: -110, y: 404 }, 41: { x: -35, y: 415 },
    31: { x: 35, y: 415 }, 32: { x: 110, y: 404 }, 33: { x: 180, y: 384 },
    34: { x: 240, y: 365 }, 35: { x: 300, y: 348 }, 36: { x: 360, y: 334 },
    37: { x: 420, y: 323 }, 38: { x: 480, y: 313 },
};

const CONDITION_COLORS = {
    PR: '#4CAF50', D: '#C0392B', Am: '#E67E22', Co: '#2ECC71',
    JC: '#FFA000', In: '#FFB74D', S: '#4FC3F7', M: '#212121',
    MO: '#7F8C8D', X: '#B71C1C', XO: '#D35400', Rf: '#E91E63',
    Im: '#9C27B0', Un: '#90A4AE', Sp: '#CE93D8', BR: '#7E57C2',
    ABR: '#26A69A', ABF: '#EF5350', Imp: '#F1C40F', Abu: '#8E44AD',
    Att: '#FFCC80', Po: '#1ABC9C', Rm: '#3498DB',
};

const CONDITION_LABELS = {
    PR: 'Present Tooth', D: 'Decayed (Caries)', Am: 'Amalgam Filling',
    Co: 'Composite Filling', JC: 'Jacket Crown', In: 'Inlay',
    S: 'Sealant', M: 'Missing due to Caries', MO: 'Missing due to Other Cause',
    X: 'Extraction due to Caries', XO: 'Extraction due to Other Cause',
    Rf: 'Root Fragment', Im: 'Impacted Tooth', Un: 'Unerupted',
    Sp: 'Supernumerary Tooth', BR: 'Bruxism', ABR: 'Abrasion',
    ABF: 'Abfraction', Imp: 'Implant', Abu: 'Abutment',
    Att: 'Attachment', Po: 'Pontic', Rm: 'Removable Denture',
};

function getToothType(toothNumber) {
    const n = parseInt(toothNumber);
    for (const [type, numbers] of Object.entries(TOOTH_TYPE_MAP)) {
        if (numbers.includes(n)) return type;
    }
    return 'incisor';
}

function isUpper(toothNumber) {
    const n = parseInt(toothNumber);
    return (n >= 11 && n <= 28) || (n >= 51 && n <= 65);
}

function getToothPath(toothNumber) {
    const type = getToothType(toothNumber);
    const upper = isUpper(toothNumber);
    return TOOTH_PATHS[type] ? TOOTH_PATHS[type][upper ? 'upper' : 'lower'] : TOOTH_PATHS.incisor.lower;
}

function getToothPosition(toothNumber) {
    return TOOTH_POSITIONS[parseInt(toothNumber)] || { x: 0, y: 0 };
}

const FDI_NUMBERS = [
    18, 17, 16, 15, 14, 13, 12, 11,
    21, 22, 23, 24, 25, 26, 27, 28,
    48, 47, 46, 45, 44, 43, 42, 41,
    31, 32, 33, 34, 35, 36, 37, 38,
];

export class DentalChart extends Component {
    static template = "obbs_dental.DentalChart";
    static props = {
        ...standardFieldProps,
    };

    setup() {
        this.orm = useService("orm");
        this.state = useState({
            teeth: [],
            _data: {},
            selectedTooth: null,
            editCondition: "",
            editTreatment: "",
            editNotes: "",
            conditionOptions: Object.entries(CONDITION_LABELS)
                .sort((a, b) => a[1].localeCompare(b[1])),
            legendItems: [],
            viewBox: "0 0 1180 500",
            viewBoxWidth: 1180,
            archCenterY: 250,
        });
        console.log('DentalChart: setup() DAN');
        onWillUpdateProps(() => {
            this._loadFromRecord();
        });
        this._loadFromRecord();
    }

    _loadFromRecord() {
        const raw = this.props.record.data[this.props.name];
        console.log('DentalChart: _loadFromRecord(), raw =', raw);
        if (!raw) return;
        try {
            this._applyData(JSON.parse(raw));
        } catch {
            // ignore parse errors
        }
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
            const toothInfo = data[String(num)] || {};
            const condition = toothInfo.condition || null;
            const missing = condition
                ? ["M", "MO", "X", "XO"].includes(condition)
                : false;

            if (condition) usedConditions.add(condition);

            teeth.push({
                number: num,
                x: pos.x + 590,
                y: pos.y,
                path: getToothPath(num),
                color: condition
                    ? CONDITION_COLORS[condition] || "#fff"
                    : "#fff",
                label: condition
                    ? (CONDITION_LABELS[condition] || condition)
                    : "",
                missing,
                condition,
            });
        }

        return teeth;
    }

    _buildLegend(data) {
        const conditions = new Set();
        for (const info of Object.values(data)) {
            if (info.condition) conditions.add(info.condition);
        }
        return Array.from(conditions)
            .map((c) => ({
                value: c,
                color: CONDITION_COLORS[c] || "#ccc",
                label: CONDITION_LABELS[c] || c,
            }))
            .sort((a, b) => a.label.localeCompare(b.label));
    }

    onSvgClick(ev) {
        const svg = ev.currentTarget;
        const rect = svg.getBoundingClientRect();
        const vb = svg.getAttribute('viewBox').split(' ').map(Number);
        const vx = (ev.clientX - rect.left) / rect.width * vb[2] + vb[0];
        const vy = (ev.clientY - rect.top) / rect.height * vb[3] + vb[1];
        console.log('DentalChart: onSvgClick at viewBox coords', vx.toFixed(0), vy.toFixed(0));
        for (const t of this.state.teeth) {
            const tx = t.x, ty = t.y;
            if (vx >= tx && vx <= tx + 56 && vy >= ty && vy <= ty + 90) {
                this.onToothClick(t.number);
                return;
            }
        }
    }

    onToothClick(toothNumber) {
        console.log('DentalChart: onToothClick(', toothNumber, ')');
        const info = this.state._data[String(toothNumber)] || {};
        this.state.selectedTooth = toothNumber;
        this.state.editCondition = info.condition || "";
        this.state.editTreatment = info.treatment || "";
        this.state.editNotes = info.notes || "";
    }

    closeDialog() {
        this.state.selectedTooth = null;
    }

    onConditionChange(ev) { this.state.editCondition = ev.target.value; }
    onTreatmentChange(ev) { this.state.editTreatment = ev.target.value; }
    onNotesChange(ev) { this.state.editNotes = ev.target.value; }

    async saveTooth() {
        const toothNumber = this.state.selectedTooth;
        if (!toothNumber) return;

        const condition = this.state.editCondition;
        if (!condition) return;

        const treatment = this.state.editTreatment;
        const notes = this.state.editNotes;
        const resId = this.props.record.resId;

        if (!resId) return;

        try {
            const result = await this.orm.call(
                "dental.history",
                "create_from_chart",
                [
                    {
                        patient_id: resId,
                        tooth_number: String(toothNumber),
                        condition: condition,
                        treatment: treatment || false,
                        notes: notes || false,
                    },
                ]
            );
            console.log('DentalChart: save result', result);

            this.closeDialog();

            const [updated] = await this.orm.read(
                "dental.patient",
                [resId],
                [this.props.name]
            );
            console.log('DentalChart: read result', updated);

            const jsonStr = updated[this.props.name] || "{}";
            console.log('DentalChart: tooth_conditions', jsonStr);

            // Persist into the record so tab switching keeps the new data
            this.props.record.data[this.props.name] = jsonStr;
            this._applyData(JSON.parse(jsonStr));
        } catch (err) {
            console.error("DentalChart: Failed to save tooth condition:", err);
        }
    }
}

export const dentalChartField = {
    component: DentalChart,
    supportedTypes: ["text"],
};

registry.category("fields").add("dental_chart", dentalChartField);
