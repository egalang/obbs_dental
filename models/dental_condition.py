from odoo import models, fields, api


class DentalCondition(models.Model):
    _name = 'dental.condition'
    _description = 'Dental Tooth Condition'
    _order = 'code'
    _rec_name = 'display_name'

    code = fields.Char(string='Code', required=True)
    name = fields.Char(string='Condition', required=True)
    color = fields.Char(string='Color', required=True, default='#CCCCCC')
    apply_to_whole_tooth = fields.Boolean(
        string='Apply to Whole Tooth',
        help='When set, this condition applies to all surfaces of the tooth.',
    )

    display_name = fields.Char(string='Name', compute='_compute_display_name', store=True)

    _code_uniq = models.Constraint(
        'unique (code)',
        'Condition code must be unique.',
    )

    @api.depends('code', 'name')
    def _compute_display_name(self):
        for rec in self:
            rec.display_name = f'{rec.code} - {rec.name}'