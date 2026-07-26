from odoo import models, fields, api


class DentalToothSurface(models.Model):
    _name = 'dental.tooth.surface'
    _description = 'Dental Tooth Surface'
    _rec_name = 'display_name'
    _order = 'tooth_id, surface, date desc, id desc'

    tooth_id = fields.Many2one('dental.tooth', string='Tooth', required=True, ondelete='cascade')
    patient_id = fields.Many2one(related='tooth_id.patient_id', store=True)

    surface = fields.Selection([
        ('T', 'Top (Occlusal/Incisal)'),
        ('B', 'Bottom (Cervical)'),
        ('L', 'Left (Mesial/Distal)'),
        ('R', 'Right (Distal/Mesial)'),
        ('C', 'Center (Central)'),
    ], string='Surface', required=True)

    condition = fields.Selection([
        ('PR', 'Present Tooth'),
        ('D', 'Decayed (Caries)'),
        ('Am', 'Amalgam Filling'),
        ('Co', 'Composite Filling'),
        ('JC', 'Jacket Crown'),
        ('In', 'Inlay'),
        ('S', 'Sealant'),
        ('M', 'Missing due to Caries'),
        ('MO', 'Missing due to Other Cause'),
        ('X', 'Extraction due to Caries'),
        ('XO', 'Extraction due to Other Cause'),
        ('Rf', 'Root Fragment'),
        ('Im', 'Impacted Tooth'),
        ('Un', 'Unerupted'),
        ('Sp', 'Supernumerary Tooth'),
        ('BR', 'Bruxism'),
        ('ABR', 'Abrasion'),
        ('ABF', 'Abfraction'),
        ('Imp', 'Implant'),
        ('Abu', 'Abutment'),
        ('Att', 'Attachment'),
        ('Po', 'Pontic'),
        ('Rm', 'Removable Denture'),
    ], string='Condition', required=True)

    treatment = fields.Char(string='Treatment')
    notes = fields.Text(string='Notes')
    date = fields.Date(string='Date', default=fields.Date.today)

    display_name = fields.Char(string='Name', compute='_compute_display_name', store=True)

    @api.depends('tooth_id', 'surface')
    def _compute_display_name(self):
        surface_labels = dict(self._fields['surface'].selection)
        for rec in self:
            label = surface_labels.get(rec.surface, rec.surface)
            rec.display_name = f'{rec.tooth_id.display_name} - {label}'

    @api.model
    def create_from_chart(self, vals):
        tooth = self.env['dental.tooth'].search([
            ('patient_id', '=', vals['patient_id']),
            ('tooth_number', '=', vals['tooth_number']),
        ], limit=1)
        if not tooth:
            tooth = self.env['dental.tooth'].create({
                'patient_id': vals['patient_id'],
                'tooth_number': vals['tooth_number'],
            })

        record = self.create({
            'tooth_id': tooth.id,
            'surface': vals['surface'],
            'condition': vals['condition'],
            'treatment': vals.get('treatment') or False,
            'notes': vals.get('notes') or False,
        })

        tooth.patient_id.invalidate_recordset()
        return {'id': record.id, 'success': True}
