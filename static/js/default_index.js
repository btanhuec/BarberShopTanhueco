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

var get_appointments = function() {
    var barber_id = app.selected_barber;
    console.log(barber_id);
    //var appointment_date = new Date();
    //date_string = appointment_date.toISOString().slice(0,10);
    var appointment_date = app.selected_date;
    // var appointment_date = self.vue.selected_date
    // {} creates a request body and that is sent to api.py
    $.post(getAppointmentsUrl, {barber_id: barber_id, appointment_date: appointment_date}, function (response) {
        console.log(response)
    });
    console.log("in get_appointments");
};

var get_barbers = function() {
    $.getJSON(getBarbersUrl, function(response) {
        console.log(response.barbers)
    });
};
var test_print = function() {
    console.log("testing!")
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
        selected_time: undefined
    },
    methods: {
        redirect_home_page: self.redirect_home_page,
        redirect_barber_page: self.redirect_barber_page,
        redirect_haircut_page: self.redirect_haircut_page,
        redirect_appointment_page: self.redirect_appointment_page,
        get_appointments: self.get_appointments,
        test_print: self.test_print
    }
});

get_appointments();
get_barbers();
