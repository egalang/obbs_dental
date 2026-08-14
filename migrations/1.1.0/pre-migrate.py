def migrate(cr, version):
    # Convert dental.tooth.surface.condition from Selection (varchar) to Many2one (int).
    # Rename the legacy varchar column so the ORM can create the new integer column,
    # then post-migrate remaps codes to the seeded dental.condition records.
    cr.execute(
        """
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = 'dental_tooth_surface'
          AND column_name = 'condition'
        """
    )
    if cr.fetchone():
        cr.execute(
            "ALTER TABLE dental_tooth_surface RENAME COLUMN condition TO condition_legacy"
        )