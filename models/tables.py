import datetime

db.define_table('barbers',
                Field('barber_name')
                )

db.define_table('timeslots',
                Field('timeslot'),
                )

db.define_table('appointments',
                Field('barber_id', 'reference auth_user'),
                Field('appointment_date', 'datetime'),
                Field('timeslot_id', 'reference timeslots'),
                Field('user_id', 'reference auth_user')
                )

db.define_table('barber_bio',
                Field('barber_id','reference auth_user'),
                Field('body', 'text')
                )
