def migrate(cr, version):
    # Remap legacy string codes to the new dental.condition records, then drop the legacy column.
    cr.execute(
        """
        UPDATE dental_tooth_surface s
        SET condition = c.id
        FROM dental_condition c
        WHERE s.condition_legacy = c.code
          AND s.condition IS NULL
        """
    )
    cr.execute(
        """
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = 'dental_tooth_surface'
          AND column_name = 'condition_legacy'
        """
    )
    if cr.fetchone():
        cr.execute("ALTER TABLE dental_tooth_surface DROP COLUMN condition_legacy")

    # Remove stale 'ir.model.fields.selection' records left over from the old
    # Selection field, along with their ir.model.data references. The ORM would
    # otherwise try to unlink them during '_process_end', which reads the now
    # Many2one field's 'ondelete' (a string) as a dict and crashes.
    cr.execute(
        """
        SELECT s.id
        FROM ir_model_fields_selection s
        JOIN ir_model_fields f ON f.id = s.field_id
        WHERE f.model = 'dental.tooth.surface' AND f.name = 'condition'
        """
    )
    stale_selection_ids = [r[0] for r in cr.fetchall()]
    if stale_selection_ids:
        cr.execute(
            """
            DELETE FROM ir_model_data
            WHERE model = 'ir.model.fields.selection'
              AND res_id IN %s
            """,
            (tuple(stale_selection_ids),),
        )
        cr.execute(
            "DELETE FROM ir_model_fields_selection WHERE id IN %s",
            (tuple(stale_selection_ids),),
        )