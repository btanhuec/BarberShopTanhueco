
def get_barbers():
    barbers = db(db.auth_user.Barber == True).select()
    return response.json(dict(barbers=barbers))

@auth.requires_signature()
def make_appointment_api():
    print "hello"
    print request.vars.user_id

    db.appointments.insert(barber_id=request.vars.barber_id, appointment_date=request.vars.appointment_date, timeslot_id=request.vars.timeslot_id, user_id=request.vars.user_id)


    print request.vars.appointment_date
    response.flash=T("Created Appointment!")

    barber = db(db.auth_user.id == request.vars.barber_id).select().first()

    print request.vars.appointment_date

    customer = db(db.auth_user.id == request.vars.user_id).select().first()

    print customer

    print barber

    time = db(db.timeslots.id == request.vars.timeslot_id).select().first()
    print time

    mail = auth.settings.mailer
    # or 587
    mail.settings.server = 'smtp.gmail.com:465'
    mail.settings.sender = 'CMPS183BarberShop@gmail.com'
    mail.settings.login = 'CMPS183BarberShop@gmail.com:cmps183!'

    if mail.send(to=[barber.email],
                 subject='New Appointment',
                 message='You have an appointment on:'
                         '{}, at {} for {} {}'.format(request.vars.appointment_date, time.timeslot, customer.first_name, customer.last_name)):
        print "barber mail sent"
    else:
        print 'barber mail not sent'

    if mail.send(to=[customer.email],
                 subject='New Appointment',
                 message='Hello,\n'
                         'You have a haircut appointment with {} {} on {} at {}.'.format(barber.first_name, barber.last_name, request.vars.appointment_date, time.timeslot)):
        print "cust mail sent"
    else:
        print 'cust mail not sent'

    return "from api/make_appointment_api()"

def upload_pic():
    thing = db.barber_pics.update_or_insert(
        barber_id=request.vars.barber_id,
        b_pic=request.vars.picture
    )
    print "in api/upload_pic"
    return response.json(dict(thing=thing))

def refresh():
    print 'FUCK YOU WORK YOU PIECE OF SHIT'
    redirect(URL('index'))
    return 'yessir'

@auth.requires_signature() # this causes an issue if the user does NOT have a bio, is called when getBio is called
def get_current_bio():
    bio = db(db.barber_bio.barber_id == auth.user_id).select().first()
    print("get_current_bio:" ,bio.body)
    print("get_current_bio:" ,request.vars.body)
    print "someone FUCKING HELP ME"
    return response.json(dict(bio=bio))

@auth.requires_signature()
def save_edit_bio():
    sbio = db(db.barber_bio.barber_id == auth.user_id).select().first()
    print("save_edit_bio(request.vars.body):", request.vars.body)
    sbio.update_record(body=request.vars.body)
    return response.json({"body": request.vars.body})

@auth.requires_signature()
def create_bio():
    new_bio = db.barber_bio.insert(
        barber_id = auth.user_id,
        body = request.vars.body,
    )
    print("in create_bio (api.py)")
    print("in create bio", new_bio.body)
    print("in create bio", new_bio.id)
    print("in create bio", new_bio)
    bio = db(db.barber_bio.id == new_bio.id).select().first()
    print("in create bio", bio)
    return response.json(dict(bio = bio)) # returns an id

@auth.requires_signature()
def bio_exists():
    if db(db.barber_bio.barber_id == auth.user_id).select().first() == None:
        return response.json(dict(results=False))
    else:
        return response.json(dict(results=True))

def get_current_user():
    print "in api/get_current_user"
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
                print("current_bio.id: ", current_bio.id)
                print("current_bio.barber_id: ", current_bio.barber_id)
                print("current_bio.barber_email: ", current_bio.barber_email)
                print("current_bio.body: ", current_bio.body)
                barberbio_list.append(sendb)
    return response.json(dict(biolist = barberbio_list))

            #if it does exist

def get_appointments():
    results = []
    print "\n\n\n\n"
    print("ok")
    temp_times = []

    if db(db.appointments).select().first() != None:
        print "in != None statement"
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
        elif request.vars.appointment_date not in temp_times:
            print "displaying all times"
            times = db(db.timeslots).select()

            for time in times:
                results.append(time)

        return response.json(dict(time=results))

    elif db(db.appointments).select().first() == None:
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
