def get_barbers():
    barbers = db(db.auth_user.Barber == True).select()
    return response.json(dict(barbers=barbers))

def make_appointment():

    appt_date = request.vars.app_date
    appt_barber = request.vars.appt_barber
    appt_time = request.vars.appt_date



def get_appointments():
    results = []
    print "\n\n\n\n"
    print("ok")

    #print(type(db.appointments.appointment_date))
    date_string = request.vars.appointment_date

    print "################"
    print "from request.vars.barber_id"
    print request.vars.barber_id
    print type(request.vars.barber_id)
    print "################"

    print "from request.vars.appointment_date"
    print(date_string)
    print type(date_string)
    print "#################"

    #new_date = datetime.datetime.strptime(date_string, '%Y-%m-%d').date()

    # print(new_date)
    # print(type(new_date))

    appointment_temp = db(db.appointments).select().first()
    appointment = appointment_temp.appointment_date.date().strftime('%Y-%m-%d')
    print "from db(db.appointments).select().first()"
    print appointment
    print type(appointment)
    print "#################"


    #print (appointment.appointment_date == new_date)
    print(appointment == date_string)

    appts = db((db.appointments.barber_id == request.vars.barber_id) & (appointment == request.vars.appointment_date)).select() # choose the correct barber, and the correct date
    print("xD")
    # db(db.appointments.day.day == day)
    times = db(db.timeslots).select()

    for time in times:
        if time_is_available(appts, time):
            results.append(time)
    return response.json(dict(time=results))


def time_is_available(appts, time):
    for appt in appts:
        # print(type(appt.timeslot_id))
        # print(type(time.id))
        if time.id == appt.timeslot_id:
            return False
    return True
