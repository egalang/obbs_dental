{
    'name': 'OBBS Dental Management System',

    'summary': 'Comprehensive Dental Practice Management System',

    'description': """
A comprehensive Dental Practice Management System built on Odoo 19 Community Edition,
designed to replace paper-based patient records with a modern, tablet-optimized
Electronic Dental Record (EDR).
    """,

    'author': 'OBBS',
    'website': 'https://obbs.com',

    'category': 'Medical',
    'version': '1.0.0',

    'depends': ['base', 'contacts', 'mail'],

    'data': [
        'security/security.xml',
        'security/ir.model.access.csv',
        'data/sequence_data.xml',
        'views/dental_patient_views.xml',
        'views/dental_medical_history_views.xml',
        'views/dental_history_views.xml',
        'views/dental_consent_views.xml',
        'views/dental_tooth_views.xml',
        'views/menus.xml',
    ],

    'assets': {
        'web.assets_backend': [
            'obbs_dental/static/src/js/tooth_palette.js',
            'obbs_dental/static/src/js/tooth_layout.js',
            'obbs_dental/static/src/js/tooth_dialog.js',
            'obbs_dental/static/src/js/odontogram.js',
            'obbs_dental/static/src/xml/**/*',
            'obbs_dental/static/src/scss/dental_chart.scss',
        ],
    },

    'installable': True,
    'application': True,
    'auto_install': False,
    'license': 'LGPL-3',
}

