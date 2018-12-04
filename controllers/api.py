# condition 1
#appts = db((db.appointments.barber == requests.vars.barber) &

#condition 2
    #(db.appointments.day >= datetime.today)).select()

#times = db(db.time_slots.=).select()

# for time in times:
#   if time in appointments:
#       ignore
#   else:
#       send it
import datetime

# def move_barbers():
#     print("in api.py")
#     users = db().select(db.auth_user.ALL)
#     barbers_entered = db().select(db.barbers.barber_name)
#     for user in users:
#         print("LOOPITY LOOP") # this loop isn't working properly
#         if user.Barber == True:
#             if user.email not in barbers_entered:
#                 new_barber_id = db.barbers.insert(
#                     barber_name = user.email
#                 )
#             else:
#                 continue
#     return response.json(dict(new_barber_id = new_barber_id))

def get_barbers():
    barbers = db(db.auth_user.Barber == True).select()
    return response.json(dict(barbers=barbers))

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
    barber_id = 69
    for each in db(db.auth_user).select():
        pass

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
            print time
    return response.json(dict(time=results))


def time_is_available(appts, time):
    for appt in appts:
        print(type(appt.timeslot_id))
        print(type(time.id))
        if time.id == appt.timeslot_id:
            return False
    return True
