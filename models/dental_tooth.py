from odoo import models, fields, api


class DentalTooth(models.Model):
    _name = 'dental.tooth'
    _description = 'Dental Tooth'
    _rec_name = 'display_name'

    patient_id = fields.Many2one('dental.patient', string='Patient', required=True, ondelete='cascade')
    tooth_number = fields.Char(string='Tooth Number (FDI)', required=True)

    surface_ids = fields.One2many('dental.tooth.surface', 'tooth_id', string='Surfaces')

    display_name = fields.Char(string='Name', compute='_compute_display_name', store=True)

    _sql_constraints = [
        ('unique_patient_tooth', 'unique(patient_id, tooth_number)',
         'A tooth record for this patient and tooth number already exists.'),
    ]

    @api.depends('patient_id', 'tooth_number')
    def _compute_display_name(self):
        for rec in self:
            name = rec.patient_id.display_name or ''
            rec.display_name = f'{name} - Tooth #{rec.tooth_number}'
