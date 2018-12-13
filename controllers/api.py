
def get_barbers():
    barbers = db(db.auth_user.Barber == True).select()
    return response.json(dict(barbers=barbers))

#pass my_date in
@auth.requires_signature()
def get_day_appointments():
        print('yaga')
        times = []
        customers = []
        #pass rawdate
        someval = request.vars.selected_date_barber
        appointments = db((db.auth_user.id == db.appointments.user_id) & (auth.user_id == db.appointments.barber_id)).select()
        print appointments
        print someval
        for appt in appointments:
            print('hey!')
            my_date = someval
            print ('date input' + my_date)
            customer = db(db.auth_user.id == appt.auth_user.id).select().first()
            time = db(db.timeslots.id == appt.appointments.timeslot_id).select().first()
            appoint_date = appt.appointments.appointment_date

            appoint_date_string = appoint_date.strftime('%Y-%m-%d')
            print appoint_date_string
            print(type(appoint_date_string))
            if my_date == appoint_date_string:
                times.append(time)
                customers.append(customer)
        results = [times,customers]
        print("0:")
        print(results[0])
        print("0:")
        print(results[1])
        print("0:")
        return response.json(dict(results=results))



@auth.requires_signature()
def make_appointment_api():


    db.appointments.insert(barber_id=request.vars.barber_id, appointment_date=request.vars.appointment_date, timeslot_id=request.vars.timeslot_id, user_id=request.vars.user_id)


    response.flash=T("Created Appointment!")

    barber = db(db.auth_user.id == request.vars.barber_id).select().first()


    customer = db(db.auth_user.id == request.vars.user_id).select().first()

    time = db(db.timeslots.id == request.vars.timeslot_id).select().first()

    mail = auth.settings.mailer
    # or 587
    mail.settings.server = 'smtp.gmail.com:465'
    mail.settings.sender = 'CMPS183BarberShop@gmail.com'
    mail.settings.login = 'CMPS183BarberShop@gmail.com:cmps183!'

    vreturn = None
    if mail.send(to=[barber.email],
                 subject='New Appointment',
                 message='You have an appointment on:'
                         '{}, at {} for {} {}'.format(request.vars.appointment_date, time.timeslot, customer.first_name, customer.last_name)):
        print "barber mail sent"
        vreturn = 1
    else:
        print 'barber mail not sent'
        vreturn = 0

    if mail.send(to=[customer.email],
                 subject='New Appointment',
                 message='Hello,\n'
                         'You have a haircut appointment with {} {} on {} at {}.'.format(barber.first_name, barber.last_name, request.vars.appointment_date, time.timeslot)):
        print "customer mail sent"
        vreturn = 1
    else:
        print "customer mail not sent"
        vreturn = 0
    return response.json(dict(vreturn=vreturn))


def upload_pic():
    thing = db.barber_pics.update_or_insert(
        barber_id=request.vars.barber_id,
        b_pic=request.vars.picture
    )
    return response.json(dict(thing=thing))

def refresh():
    redirect(URL('index'))
    return 'yessir'

@auth.requires_signature() # this causes an issue if the user does NOT have a bio, is called when getBio is called
def get_current_bio():
    bio = db(db.barber_bio.barber_id == auth.user_id).select().first()

    return response.json(dict(bio=bio))

@auth.requires_signature()
def save_edit_bio():
    sbio = db(db.barber_bio.barber_id == auth.user_id).select().first()
    sbio.update_record(body=request.vars.body)
    return response.json({"body": request.vars.body})

@auth.requires_signature()
def create_bio():
    new_bio = db.barber_bio.insert(
        barber_id = auth.user_id,
        body = request.vars.body,
    )

    bio = db(db.barber_bio.id == new_bio.id).select().first()
    return response.json(dict(bio = bio)) # returns an id

@auth.requires_signature()
def bio_exists():
    if db(db.barber_bio.barber_id == auth.user_id).select().first() == None:
        return response.json(dict(results=False))
    else:
        return response.json(dict(results=True))

def get_current_user():
    return response.json(dict(user=auth.user if auth.user is not None else None))

def get_all_bios():
    barberbios = db(db.barber_bio).select()
    barberbio_list = []
    barbers = db().select(db.auth_user.ALL)
    for b in barbers:
        if b.Barber == True:
            current_bio = db(db.barber_bio.barber_id == b.id).select().first()
            # if it doesn't exists, differs from posts because sometimes a user will not have bio
            if current_bio == None:
                print("no current bio for: ", b.email)
            else:
                sendb = dict(
                    id = current_bio.id,
                    barber_id = current_bio.barber_id,
                    barber_email = current_bio.barber_email,
                    body = current_bio.body
                )

                barberbio_list.append(sendb)
    return response.json(dict(biolist = barberbio_list))

            #if it does exist

def get_appointments():
    results = []

    temp_times = []

    if db(db.appointments).select().first() != None:
        appointment_temp = db().select(db.appointments.ALL)
        for each in appointment_temp:
            appointment = each.appointment_date.date().strftime('%Y-%m-%d')
            if appointment not in temp_times:
                temp_times.append(appointment)
            else:
                print 'skip'

        if request.vars.appointment_date in temp_times:
            input_date = request.vars.appointment_date
            if temp_times[temp_times.index(input_date)] == input_date:
                appts = db(db.appointments.appointment_date == input_date).select()
                times = db(db.timeslots).select()
                for time in times:
                    if time_is_available(appts, time):
                        results.append(time)
        elif request.vars.appointment_date not in temp_times:
            times = db(db.timeslots).select()

            for time in times:
                results.append(time)

        return response.json(dict(time=results))

    elif db(db.appointments).select().first() == None:
        times = db(db.timeslots).select()

        for time in times:
            results.append(time)
        return response.json(dict(time=results))


def time_is_available(appts, time):
    for appt in appts:
        if time.id == appt.timeslot_id:
            return False
    return True
