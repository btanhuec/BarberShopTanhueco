def get_barbers():
    barbers = db(db.auth_user.Barber == True).select()
    return response.json(dict(barbers=barbers))

<<<<<<< HEAD

def make_appointment_api():
    print "hello"
    db.appointments.insert(barber_id=request.vars.barber_id, appointment_date=request.vars.appointment_date, timeslot_id=request.vars.timeslot_id, user_id=request.vars.user_id)
=======
@auth.requires_signature()
def make_appointment_api():
    print "hello"
    print request.vars.user_id

    db.appointments.insert(barber_id=request.vars.barber_id, appointment_date=request.vars.appointment_date, timeslot_id=request.vars.timeslot_id, user_id=request.vars.user_id)


>>>>>>> 0c73e1c130d1cb9efb0d85b5d7d7af5ea6487dbf
    print request.vars.appointment_date

    return "from make_appointment()"

@auth.requires_signature()
def testing_api():
    print "fuck"
    return "fuckkkk"

def get_current_user():
    return response.json(dict(user=auth.user if auth.user is not None else None))

def get_appointments():
    results = []
    print "\n\n\n\n"
    print("ok")

    #print(type(db.appointments.appointment_date))
    date_string = request.vars.appointment_date

    # print "################"
    # print "from request.vars.barber_id"
    # print request.vars.barber_id
    # print type(request.vars.barber_id)
    # print "################"
    #
    # print "from request.vars.appointment_date"
    # print(date_string)
    # print type(date_string)
    # print "#################"

    #new_date = datetime.datetime.strptime(date_string, '%Y-%m-%d').date()

    # print(new_date)
    # print(type(new_date))

<<<<<<< HEAD
    appointment_temp = db(db.appointments).select().first()
    appointment = appointment_temp.appointment_date.date().strftime('%Y-%m-%d')
    # print "from db(db.appointments).select().first()"
    # print appointment
    # print type(appointment)
    # print "#################"


    #print (appointment.appointment_date == new_date)
    # print(appointment == date_string)

    appts = db((db.appointments.barber_id == request.vars.barber_id) & (appointment == request.vars.appointment_date)).select() # choose the correct barber, and the correct date
    # print("xD")
    # db(db.appointments.day.day == day)
    times = db(db.timeslots).select()

    for time in times:
        print time["appointments.timeslot"]
        if time_is_available(appts, time):
            results.append(time)
    return response.json(dict(time=results))
=======
    if db(db.appointments).select().first() != None:
        appointment_temp = db(db.appointments).select().first()
        appointment = appointment_temp.appointment_date.date().strftime('%Y-%m-%d')
        # print "from db(db.appointments).select().first()"
        # print appointment
        # print type(appointment)
        # print "#################"


        #print (appointment.appointment_date == new_date)
        # print(appointment == date_string)

        appts = db((db.appointments.barber_id == request.vars.barber_id) & (appointment == request.vars.appointment_date)).select() # choose the correct barber, and the correct date
        # print("xD")
        # db(db.appointments.day.day == day)
        times = db(db.timeslots).select()

        for time in times:
            print time["appointments.timeslot"]
            if time_is_available(appts, time):
                results.append(time)
        return response.json(dict(time=results))

    else:

        times = db(db.timeslots).select()

        for time in times:
            print time
            results.append(time)
        return response.json(dict(time=results))
>>>>>>> 0c73e1c130d1cb9efb0d85b5d7d7af5ea6487dbf


def time_is_available(appts, time):
    for appt in appts:
        # print(type(appt.timeslot_id))
        # print(type(time.id))
        if time.id == appt.timeslot_id:
            return False
    return True
