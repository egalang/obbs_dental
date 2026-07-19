/** @odoo-module **/

export const TOOTH_PATHS = {
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

export const TOOTH_POSITIONS = {
    // Upper right (patient's right = viewer's left)
    18: { x: -510, y: 110 },
    17: { x: -450, y: 82 },
    16: { x: -385, y: 58 },
    15: { x: -315, y: 38 },
    14: { x: -245, y: 22 },
    13: { x: -175, y: 10 },
    12: { x: -100, y: 3 },
    11: { x: -30, y: 0 },
    // Upper left (patient's left = viewer's right)
    21: { x: 30, y: 0 },
    22: { x: 100, y: 3 },
    23: { x: 175, y: 10 },
    24: { x: 245, y: 22 },
    25: { x: 315, y: 38 },
    26: { x: 385, y: 58 },
    27: { x: 450, y: 82 },
    28: { x: 510, y: 110 },
    // Lower right (patient's right = viewer's left)
    48: { x: -510, y: 50 },
    47: { x: -450, y: 78 },
    46: { x: -385, y: 102 },
    45: { x: -315, y: 122 },
    44: { x: -245, y: 138 },
    43: { x: -175, y: 150 },
    42: { x: -100, y: 157 },
    41: { x: -30, y: 160 },
    // Lower left (patient's left = viewer's right)
    31: { x: 30, y: 160 },
    32: { x: 100, y: 157 },
    33: { x: 175, y: 150 },
    34: { x: 245, y: 138 },
    35: { x: 315, y: 122 },
    36: { x: 385, y: 102 },
    37: { x: 450, y: 78 },
    38: { x: 510, y: 50 },
};

export const CONDITION_COLORS = {
    PR: '#4CAF50',
    D: '#F44336',
    Am: '#9E9E9E',
    Co: '#81C784',
    JC: '#FFA000',
    In: '#FFB74D',
    S: '#4FC3F7',
    M: '#212121',
    MO: '#757575',
    X: '#B71C1C',
    XO: '#795548',
    Rf: '#8D6E63',
    Im: '#E91E63',
    Un: '#90A4AE',
    Sp: '#CE93D8',
    BR: '#7E57C2',
    ABR: '#26A69A',
    ABF: '#EF5350',
    Imp: '#FFD54F',
    Abu: '#A1887F',
    Att: '#FFCC80',
    Po: '#BDBDBD',
    Rm: '#78909C',
};

export const CONDITION_LABELS = {
    PR: 'Present Tooth',
    D: 'Decayed (Caries)',
    Am: 'Amalgam Filling',
    Co: 'Composite Filling',
    JC: 'Jacket Crown',
    In: 'Inlay',
    S: 'Sealant',
    M: 'Missing due to Caries',
    MO: 'Missing due to Other Cause',
    X: 'Extraction due to Caries',
    XO: 'Extraction due to Other Cause',
    Rf: 'Root Fragment',
    Im: 'Impacted Tooth',
    Un: 'Unerupted',
    Sp: 'Supernumerary Tooth',
    BR: 'Bruxism',
    ABR: 'Abrasion',
    ABF: 'Abfraction',
    Imp: 'Implant',
    Abu: 'Abutment',
    Att: 'Attachment',
    Po: 'Pontic',
    Rm: 'Removable Denture',
};

export function getToothType(toothNumber) {
    const n = parseInt(toothNumber);
    for (const [type, numbers] of Object.entries(TOOTH_TYPE_MAP)) {
        if (numbers.includes(n)) return type;
    }
    return 'incisor';
}

export function isUpper(toothNumber) {
    const n = parseInt(toothNumber);
    return (n >= 11 && n <= 28) || (n >= 51 && n <= 65);
}

export function getToothPath(toothNumber) {
    const type = getToothType(toothNumber);
    const upper = isUpper(toothNumber);
    return TOOTH_PATHS[type] ? TOOTH_PATHS[type][upper ? 'upper' : 'lower'] : TOOTH_PATHS.incisor.lower;
}

export function getToothPosition(toothNumber) {
    return TOOTH_POSITIONS[parseInt(toothNumber)] || { x: 0, y: 0 };
}
