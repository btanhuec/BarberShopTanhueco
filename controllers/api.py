def get_barbers():
    barbers = db(db.auth_user.Barber == True).select()
    return response.json(dict(barbers=barbers))

@auth.requires_signature()
def make_appointment_api():
    print "hello"
    print request.vars.user_id

    db.appointments.insert(barber_id=request.vars.barber_id, appointment_date=request.vars.appointment_date, timeslot_id=request.vars.timeslot_id, user_id=request.vars.user_id)


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
    temp_times = []

    if db(db.appointments).select().first() != None:
        print "in != None statement"
        # this line is the problem. .first()
        #appointment_temp = db(db.appointments).select().first()
        appointment_temp = db().select(db.appointments.ALL)
        for each in appointment_temp:
            appointment = each.appointment_date.date().strftime('%Y-%m-%d')
            print appointment
            if appointment not in temp_times:
                temp_times.append(appointment)
            else:
                print 'skip'
        print "now for temp_times..."
        for each in temp_times:
            print each
        print "now for request..."
        print request.vars.appointment_date
        print request.vars.appointment_date in temp_times
        if request.vars.appointment_date in temp_times:
            input_date = request.vars.appointment_date
            print "hello"
            if temp_times[temp_times.index(input_date)] == input_date:
                appts = db(db.appointments.appointment_date == input_date).select()
                print appts

                times = db(db.timeslots).select()
                for time in times:
                    if time_is_available(appts, time):
                        results.append(time)

        return response.json(dict(time=results))

    else:
        print "in else statement"
        times = db(db.timeslots).select()

        for time in times:
            print time
            results.append(time)
        return response.json(dict(time=results))


def time_is_available(appts, time):
    for appt in appts:
        if time.id == appt.timeslot_id:
            return False
    return True
