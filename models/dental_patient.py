from odoo import models, fields, api
from odoo.exceptions import ValidationError
import re


class DentalPatient(models.Model):
    _name = 'dental.patient'
    _description = 'Dental Patient'
    _inherit = ['mail.thread', 'mail.activity.mixin']
    _rec_name = 'display_name'
    _order = 'patient_number desc'

    patient_number = fields.Char(
        string='Patient Number',
        required=True,
        copy=False,
        readonly=True,
        default=lambda self: self._default_patient_number(),
    )

    partner_id = fields.Many2one('res.partner', string='Contact', ondelete='restrict')

    last_name = fields.Char(string='Last Name', required=True, tracking=True)
    first_name = fields.Char(string='First Name', required=True, tracking=True)
    middle_name = fields.Char(string='Middle Name')

    display_name = fields.Char(string='Name', compute='_compute_display_name', store=True)

    birthdate = fields.Date(string='Birthdate', tracking=True)
    age = fields.Integer(string='Age', compute='_compute_age', store=True)

    sex = fields.Selection([
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
    ], string='Sex', required=True, tracking=True)

    blood_type = fields.Selection([
        ('A+', 'A+'),
        ('A-', 'A-'),
        ('B+', 'B+'),
        ('B-', 'B-'),
        ('AB+', 'AB+'),
        ('AB-', 'AB-'),
        ('O+', 'O+'),
        ('O-', 'O-'),
    ], string='Blood Type')

    nationality = fields.Char(string='Nationality')
    religion = fields.Char(string='Religion')
    occupation = fields.Char(string='Occupation')

    home_address = fields.Text(string='Home Address')
    mobile = fields.Char(string='Mobile Number')
    email = fields.Char(string='Email Address')

    dental_insurance = fields.Char(string='Dental Insurance')
    guardian = fields.Char(string='Guardian')
    emergency_contact = fields.Char(string='Emergency Contact')

    signature = fields.Binary(string='Signature', attachment=True)
    signature_name = fields.Char(string='Signature Name')

    medical_history_ids = fields.One2many('dental.medical.history', 'patient_id', string='Medical History')
    dental_history_ids = fields.One2many('dental.history', 'patient_id', string='Dental History')
    tooth_ids = fields.One2many('dental.tooth', 'patient_id', string='Teeth')
    tooth_surface_ids = fields.One2many(
        'dental.tooth.surface',
        compute='_compute_tooth_surface_ids',
        string='Tooth Surfaces',
        readonly=True,
    )
    consent_ids = fields.One2many('dental.consent', 'patient_id', string='Consents')

    active = fields.Boolean(string='Active', default=True)

    tooth_conditions = fields.Text(
        string='Tooth Conditions',
        compute='_compute_tooth_conditions',
        store=False,
    )

    _sql_constraints = [
        ('unique_patient_number', 'unique(patient_number)', 'Patient Number must be unique.'),
    ]

    @api.model
    def _default_patient_number(self):
        seq = self.env['ir.sequence'].next_by_code('dental.patient') or '/'
        return seq

    @api.depends('last_name', 'first_name', 'middle_name')
    def _compute_display_name(self):
        for rec in self:
            parts = [rec.first_name, rec.middle_name, rec.last_name]
            rec.display_name = ' '.join(p for p in parts if p)

    @api.depends('birthdate')
    def _compute_age(self):
        from datetime import date
        for rec in self:
            if rec.birthdate:
                today = date.today()
                age = today.year - rec.birthdate.year - (
                    (today.month, today.day) < (rec.birthdate.month, rec.birthdate.day)
                )
                rec.age = age
            else:
                rec.age = 0

    @api.constrains('mobile')
    def _check_mobile(self):
        for rec in self:
            if rec.mobile and not re.match(r'^\+?[\d\s\-()]{7,20}$', rec.mobile):
                raise ValidationError('Invalid mobile number format.')

    @api.constrains('email')
    def _check_email(self):
        for rec in self:
            if rec.email and not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', rec.email):
                raise ValidationError('Invalid email address format.')

    @api.depends('tooth_ids', 'tooth_ids.surface_ids', 'tooth_ids.surface_ids.condition', 'tooth_ids.surface_ids.treatment', 'tooth_ids.surface_ids.notes')
    def _compute_tooth_conditions(self):
        import json
        for rec in self:
            data = {}
            for tooth in rec.tooth_ids:
                tn = tooth.tooth_number
                latest = {}
                for srf in tooth.surface_ids.sorted('date', reverse=True):
                    if srf.surface not in latest:
                        latest[srf.surface] = {
                            'condition': srf.condition,
                            'treatment': srf.treatment,
                            'notes': srf.notes,
                            'date': str(srf.date) if srf.date else None,
                        }
                if latest:
                    data[tn] = {'surfaces': latest}
            rec.tooth_conditions = json.dumps(data)

    @api.depends('tooth_ids', 'tooth_ids.surface_ids')
    def _compute_tooth_surface_ids(self):
        for rec in self:
            rec.tooth_surface_ids = rec.mapped('tooth_ids.surface_ids')
