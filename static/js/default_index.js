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
  // get_current_user();
  // get_barbers();
  // getBio(bioExists(get_current_user()));
    $.getJSON(getAllBios,
    function(response){
      app.barberbio_list = response.biolist;
      processBios();
      get_barbers();
      get_current_user();
      get_current_user_barber();
      bioExists();
      bioExists();
      getBio(bioExists(get_current_user_barber()));
    }
  );
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

var processBios = function(){
  enumerate(app.barberbio_list);
};


var redirect_appointment_page = function() {
    app.home_page = false;
    app.barber_page = false;
    app.appointment_page = true
};

var editBio = function(callback) {
    app.bio_editing = true;
    callback;
};

var saveBio = function(callback) {
    callback;

    app.bio_editing = false;
    if(app.c_bio==None){
      editedBio = app.c_bio;
    }else{
      editedBio = app.c_bio;
    }
 //c_bio for SURE has to be something prior
    /*edited_bio = bio of user we are editing, don't know if this is actually
    needed, probably not,
    Normally, c_bio is a reference to the barber_bio object, but when a new
    bio is being created, it's not referencing correctly.
    */

    $.post(saveCurrentBio,{
      body:editedBio.body,
    }, function(response) {
      $("#my_bio").text(response.body);
      app.bio_created = true;
    });
};


var getBio = function(callback){ //assigns the current, existing bio to getBio, needs to run after bioExists
    callback;
    if(app.bio_exists == true){
      $.getJSON(getCurrentBio, function(response) {
        app.c_bio = response.bio;
       app.bio_created = true;

      });
    }else{
      console.log("getBio: False");
    };
};

var toggleNewBio = function(){

  app.bio_creating = true;
  app.bio_editing = true;

};



var createBio = function(){
  app.bio_creating = false;

  var newBio = {
    barber_id:app.selected_user.id,
    body: app.newBioBody,
  };
  //error occurs when this post addition runs AFTER saveBio() runs lmfao what the yeet
  $.post(createBioUrl, newBio, function(response){
    //newBio['id'] = response.new_bio; //recall the api.py function is going to return an id
    //self.getBio(bioExists(get_current_user));
    //self.saveBio();
    newBio['idx'] = response.new_bio;
    app.barberbio_list.push(newBio);
    app.c_bio = response.bio;
    self.processBios();
    //newBio returns the id for the post
    //link c_bio to the newly added item
    /*self.processBios();
    self.bioExists();
    self.getBio();
    self.saveBio();*/
    if(app.c_bio != undefined){
      saveBio();
    }
  });
  /*createBio pushes it into the database, but does not upload properly due to the way
  the html file is set, to fix this, we need to run the same functions we run when editing a bio,
  but somehow save c_bio to the newly created bio (possibly using getBio), and run saveBio
  */
  /* c_bio can literally be anything, right now, cBio has a */

};

var bioExists = function(callback){//determine if a bio exists for the current user, not working properly
  callback;
  if (app.selected_user == null){
    console.log("bioExists(): " + self.selected_user); // not an issue, works fine when there is user logged in
  }else{
    $.getJSON(bioExistsUrl, function(response){
      app.bio_exists = response.results;
    }); //somehow returning false, but when button is pressed a second time, returns true? maybe i could just reverse the logic lmfao
    console.log("leaving bioExists: " + app.bio_exists);
  }
};

var valBioCreated = function(){
  app.bio_created = true;
};

var display_appt_table = function() {
    app.show_appt_table = !app.show_appt_table
};

var get_appointments = function() {
    var barber_id = app.selected_barber;
    var appointment_date = app.selected_date;
    // {} creates a request body and that is sent to api.py
    $.post(getAppointmentsUrl, {barber_id: barber_id, appointment_date: appointment_date}, function (response) {
        app.valid_times = response.time;
    });
    console.log("in get_appointments");
};

var get_barbers = function() {
      $.getJSON(getBarbersUrl, function(response) {
        app.barbers_list = response.barbers;
      });
};
var test_print = function() {
    $.post(getAppointmentsUrl, {}, function (response) {
        console.log('testing 2');
    });
};

var get_current_user_barber = function(){
  console.log("in get_current_user_barber");
  //   $.getJSON(getCurrentUserUrl, function(response) {
  //       app.selected_user = response.user;
  //   });
  // if(app.selected_user==null){
  //   console.log("leaving get_current_user():null");
  // }else{
  //   console.log("leaving get_current_user():" + app.selected_user.email);
  // }
    app.selected_user = user_prof;
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
    $.post(makeAppointmentUrl, {barber_id: app.selected_barber, appointment_date: app.selected_date, timeslot_id: app.selected_time, user_id: app.selected_user.id}, function (response) {
        console.log(response);
        app.apptreturn = response.vreturn;
        console.log('made appointment')
    });
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
    clear_appt_fields();

    hide_choosers();

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
        barberbio_list: [],
        display_barber_chooser: false,
        display_date_chooser: false,
        display_time_chooser: false,
        display_create_appt_btn: false,
        appt_success: false,
        barber_picture: undefined,
        bio_created: false,
        createdBio: undefined,
        apptreturn: undefined
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
        valBioCreated: self.valBioCreated,
        get_current_user_barber: self.get_current_user_barber
    }
});


app.onPageLoad();
//get_appointments();
