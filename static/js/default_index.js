const None = undefined;

var enumerate = function(arr) {
    var k=0; return arr.map(function(e) {
        e._idx = k++;
    });
};

var processAppointments = function() {
    enumerate(app.haircut);
};

var processBarbers = function(){
  enumerate(app.barbers);
};

var onPageLoad = function() {
    $.getJSON(getHaircutsUrl,
        function(response) {
            app.haircuts = response.haircuts;
            processAppointments();
            processBarbers();
        }
    );
};

var redirect_home_page = function() {
    app.home_page = true;
    app.barber_page = false;
    app.haircut_page = false;
    app.appointment_page = false
};

var redirect_barber_page = function(){
    app.home_page = false;
    app.barber_page = true;
    app.haircut_page = false;
    app.appointment_page = false
};

var redirect_haircut_page = function() {
    app.home_page = false;
    app.barber_page = false;
    app.haircut_page = true;
    app.appointment_page = false
};

var redirect_appointment_page = function() {
    app.home_page = false;
    app.barber_page = false;
    app.haircut_page = false;
    app.appointment_page = true
};

var display_appt_table = function() {
    app.show_appt_table = true
};

var get_appointments = function() {
    var barber_id = app.selected_barber;
    var appointment_date = app.selected_date;
    // {} creates a request body and that is sent to api.py
    $.post(getAppointmentsUrl, {barber_id: barber_id, appointment_date: appointment_date}, function (response) {
        console.log(response);
        app.valid_times = response.time;
    });
    console.log("in get_appointments");
};

var get_barbers = function() {
    $.getJSON(getBarbersUrl, function(response) {
        app.barbers_list = response.barbers;
        console.log(app.barbers_list)
    });
};
var test_print = function() {
    console.log("testing!");
    $.post(getAppointmentsUrl, {}, function (response) {
        console.log('testing 2');
    });
};

var get_current_user = function(){
    $.getJSON(getCurrentUserUrl, function(response) {
        app.selected_user = response.user;
        console.log(app.selected_user.email)
    });
};

var make_appointment = function() {
    console.log('in make_appointment()');
<<<<<<< HEAD
    $.post(makeAppointmentUrl, {barber_id: app.selected_barber, appointment_date: app.selected_date, timeslot_id: app.selected_time, user_id: app.selected_user}, function (response) {
=======
    $.post(makeAppointmentUrl, {barber_id: app.selected_barber, appointment_date: app.selected_date, timeslot_id: app.selected_time, user_id: app.selected_user.id}, function (response) {
>>>>>>> 0c73e1c130d1cb9efb0d85b5d7d7af5ea6487dbf
        console.log(response);
        console.log('made appointment')
    });
    console.log('hello')
};

    // Your code goes here. Remember, we need to set the id of the new comment!

var app = new Vue({
    el: '#app',
    delimiters: ['${', '}'],
    unsafeDelimiters: ['!{', '}'],
    data: {
        haircuts: [],
        home_page: true,
        barber_page: false,
        haircut_page: false,
        appointment_page: false,
        selected_date: undefined,
        selected_barber: undefined,
        selected_time: undefined,
        selected_user: undefined,
        valid_times: [],
        barbers_list: [],
        show_appt_table: false
    },
    methods: {
        redirect_home_page: self.redirect_home_page,
        redirect_barber_page: self.redirect_barber_page,
        redirect_haircut_page: self.redirect_haircut_page,
        redirect_appointment_page: self.redirect_appointment_page,
        get_appointments: self.get_appointments,
        test_print: self.test_print,
        get_current_user: self.get_current_user,
        make_appointment: self.make_appointment,
        display_appt_table: self.display_appt_table
    }
});

//get_appointments();
get_current_user();
get_barbers();
