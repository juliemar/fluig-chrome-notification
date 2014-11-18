// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/*
  Displays a notification with the current time. Requires "notifications"
  permission in the manifest file (or calling
  "Notification.requestPermission" beforehand).
*/
function show() {



  
  

  getLastNotification();
}

function getLastNotification(){

  var jqxhr = $.ajax( localStorage.server+"/api/public/alert/service/findAll?limit=1" )
  .done(function(data) {
    getMessage(data);

  })
  .fail(function() {
    //alert( "error" );
  })
  .always(function() {
    //alert( "complete" );
  });
 
// Perform other work here ...
 
// Set another completion function for the request above
jqxhr.always(function() {
  //alert( "second complete" );
});
  
}

function getMessage(data){
  var idNotification = data[0].id;
  var sender = data[0].senders[0]; 
  sender = sender.user;
  sender = sender.fisrtName;
  var action = data[0].event.singleDescription;  
  var place =  data[0].place.description;

  var message =  sender+" "+action+" em "+place;

  var time = /(..)(:..)/.exec(new Date());     // The prettyprinted time.
    var hour = time[1] % 12 || 12;               // The prettyprinted hour.
    var period = time[1] < 12 ? 'a.m.' : 'p.m.'; // The period of the day.
    if (idNotification>localStorage.idNotification) {
      localStorage.idNotification = idNotification; 
      new Notification(hour + time[2] + ' ' + period, {
        icon: '48.png',
        body:message
      });
    }
}


// Conditionally initialize the options.
if (!localStorage.isInitialized) {
  localStorage.server = "http://fluig.totvs.com";   // The display activation.
  localStorage.isActivated = true;   // The display activation.
  localStorage.frequency = 1;        // The display frequency, in minutes.
  localStorage.isInitialized = true; // The option initialization.
  localStorage.idNotification = 0; 
}

// Test for notification support.
if (window.Notification) {
  // While activated, show notifications at the display frequency.
  if (JSON.parse(localStorage.isActivated)) { show(); }

  var interval = 0; // The display interval, in minutes.

  setInterval(function() {
    interval++;

    if (
      JSON.parse(localStorage.isActivated) &&
        localStorage.frequency <= interval
    ) {
      show();
      interval = 0;
    }
  }, 60000);
}
