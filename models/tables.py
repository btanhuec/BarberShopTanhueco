import datetime

def get_user_email():
    return None if auth.user is None else auth.user.email

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
                Field('barber_email', default=get_user_email()),
                Field('body', 'text', default ='no bio'),
                )