const None = undefined;

//exists -> get -> save
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
  get_current_user();
  get_barbers();
  bioExists(get_current_user());
};

var redirect_home_page = function() {
    app.home_page = true;
    app.barber_page = false;
    app.appointment_page = false
};

var redirect_barber_page = function(){
    app.home_page = false;
    app.barber_page = true;
    app.appointment_page = false
};


var redirect_appointment_page = function() {
    app.home_page = false;
    app.barber_page = false;
    app.appointment_page = true
};

var editBio = function() {
    app.bio_editing = true;
    callback;

    console.log('editBio');
};

var saveBio = function() {
    app.bio_editing = false;
    editedBio = app.c_bio;
    /*edited_bio = bio of user we are editing, don't know if this is actually
    needed, probably not*/

    $.post(saveCurrentBio,{
      body:editedBio.body,
    }, function(response) {
      $("#my_bio").text(response.body);
    });
    console.log('saveBio');
    console.log('saveBio:' + editedBio.barber_id);
    console.log('saveBio:' + editedBio.barber_email);
    console.log('saveBio:' + editedBio.body);
};


var getBio = function(){ //assigns the current, existing bio to getBio, needs to run after bioExists
    if(app.bio_exists == true){
      $.getJSON(getCurrentBio, function(response) {
        app.c_bio = response.bio;
        console.log("getBio:" + response.bio.body);
      });
    }else{
      console.log("getBio: False");
    }
};

var toggleNewBio = function(){
  app.bio_creating = true;
};



var createBio = function(){
  app.bio_creating = false;
  console.log("createBio user:" + app.selected_user.email);
  console.log("createBio Body:" + app.newBioBody);
  var newBio = {
    barber_id:app.selected_user.id,
    body: app.newBioBody,
  };
  $.post(createBioUrl, newBio, function(response){

  });
  /*createBio pushes it into the database, but does not upload properly due to the way
  the html file is set, to fix this, we need to run the same functions we run when editing a bio,
  but somehow save c_bio to the newly created bio (possibly using getBio), and run saveBio
  */
  /* c_bio can literally be anything, right now, cBio has a */
  app.c_bio = newBio;
  console.log("in createBio():" +app.c_bio.body);
  app.bio_created = true;
  bioExists();
  saveBio();
};

var bioExists = function(callback){//determine if a bio exists for the current user
  callback;
  console.log("in bioExists");
  if (app.selected_user == null){
    console.log("bioExists(): selected_user_email"); // not an issue, works fine when there is user logged in
  }else{
    $.getJSON(bioExistsUrl, function(response){
      app.bio_exists = response.results;
    }); //somehow returning false, but when button is pressed a second time, returns true? maybe i could just reverse the logic lmfao
    console.log("leaving bioExists: " + app.bio_exists);
  }
};

var display_appt_table = function() {
    app.show_appt_table = !app.show_appt_table
};

var get_appointments = function() {
    var barber_id = app.selected_barber;
    var appointment_date = app.selected_date;
    // {} creates a request body and that is sent to api.py
    console.log(appointment_date);
    $.post(getAppointmentsUrl, {barber_id: barber_id, appointment_date: appointment_date}, function (response) {
        console.log(response);
        app.valid_times = response.time;
    });
    console.log("in get_appointments");
};

var get_barbers = function() {
      $.getJSON(getBarbersUrl, function(response) {
        app.barbers_list = response.barbers;
        console.log(app.barbers_list);
      });
};
var test_print = function() {
    console.log("testing!");
    $.post(getAppointmentsUrl, {}, function (response) {
        console.log('testing 2');
    });
};

var get_current_user = function(){
  console.log("in get_current_user");
    $.getJSON(getCurrentUserUrl, function(response) {
        app.selected_user = response.user;
    });
  if(app.selected_user==null){
    console.log("leaving get_current_user():null");
  }else{
    console.log("leaving get_current_user():" + app.selected_user.email);
  }
};

var make_appointment = function() {
    console.log('in make_appointment()');
    $.post(makeAppointmentUrl, {barber_id: app.selected_barber, appointment_date: app.selected_date, timeslot_id: app.selected_time, user_id: app.selected_user.id}, function (response) {
        console.log(response);
        console.log('made appointment')
    });
    console.log('hello')
};

    // Your code goes here. Remember, we need to set the id of the new comment!



var display_barber_chooser = function () {
    app.display_barber_chooser = true;
};
var show_date_chooser = function (){
    app.display_date_chooser = true;
};
var show_time_chooser = function() {
    app.display_time_chooser = true;
};
var show_create_appt_btn = function () {
    app.display_create_appt_btn = true;
};
var appoint_success = function (){
    app.appt_success = true;
};




var restart_appt = function() {
    app.appt_success = false;
};
var hide_date_chooser = function (){
    app.display_date_chooser = false;
};
var hide_time_chooser = function () {
    app.display_time_chooser = false;
};
var hide_create_appt_button = function () {
    app.display_create_appt_btn = false;
};

var hide_choosers = function() {
    hide_date_chooser();
    hide_time_chooser();
    hide_create_appt_button();
    restart_appt();
};

var upload_pic = function(){
    $.post(uploadPicUrl, {barber_id: app.selected_user.id, picture: app.barber_picture}, function(response) {
        console.log(response)
    });
};

var file_changed = function(event) {
    var input = event.target;
    var file = input.files[0];
    if (file) {
        var reader = new FileReader();
        reader.addEventListener('load', () => {
            app.barber_picture = reader.result
        }, false);
        reader.readAsDataURL(file);
    }
};

var clear_appt_fields = function () {
    app.selected_date = undefined;
    app.selected_barber = undefined;
    app.selected_time = undefined;
};


var redirect_refresh = function () {
    $.getJSON(redirectUrl, function (response) {
        console.log('redirecting and refreshing');
    });
    app.home_page = false;
    app.barber_page = false;
    app.appointment_page = true;
    console.log('shit');
    clear_appt_fields();

    hide_choosers();

};

var print_shit = function() {
    console.log(app.second_barber);
};

var app = new Vue({
    el: '#app',
    delimiters: ['${', '}'],
    unsafeDelimiters: ['!{', '}'],
    data: {
        haircuts: [],
        home_page: true,
        barber_page: false,
        appointment_page: false,
        selected_date: undefined,
        selected_barber: undefined,
        selected_time: undefined,
        selected_user: undefined,
        c_bio:undefined,
        newBioBody:"",
        valid_times: [],
        barbers_list: [],
        show_appt_table: false,
        bio_editing: false,
        bio_exists: false,
        bio_creating: false,
        display_barber_chooser: false,
        display_date_chooser: false,
        display_time_chooser: false,
        display_create_appt_btn: false,
        appt_success: false,
        barber_picture: undefined,
        bio_created: false,
    },
    methods: {
        redirect_home_page: self.redirect_home_page,
        redirect_barber_page: self.redirect_barber_page,
        redirect_appointment_page: self.redirect_appointment_page,
        get_appointments: self.get_appointments,
        test_print: self.test_print,
        get_current_user: self.get_current_user,
        make_appointment: self.make_appointment,
        display_appt_table: self.display_appt_table,
        editBio: self.editBio,
        saveBio: self.saveBio,
        getBio: self.getBio,
        createBio: self.createBio,
        toggleNewBio: self.toggleNewBio,
        bioExists: self.bioExists,
        onPageLoad: self.onPageLoad,
        display_barber_chooser: self.display_barber_chooser,
        show_date_chooser: self.show_date_chooser,
        show_time_chooser: self.show_time_chooser,
        show_create_appt_btn: self.show_create_appt_btn,
        appoint_success: self.appoint_success,
        restart_appt: self.restart_appt,
        hide_date_chooser: self.hide_date_chooser,
        hide_time_chooser: self.hide_time_chooser,
        hide_create_appt_button: self.hide_create_appt_button,
        clear_appt_fields: self.clear_appt_fields,
        redirect_refresh: self.redirect_refresh,
        file_changed: self.file_changed,
        upload_pic: self.upload_pic,
        display_date_chooser: self.display_date_chooser,
        print_shit: self.print_shit
    }
});


onPageLoad();
//get_appointments();
