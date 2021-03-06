$(document).ready(function(){
  $(window).scroll(function(){
      if(this.scrollY > 100){
          $('.navbar').addClass("sticky");
      }else{
          $('.navbar').removeClass("sticky");
      }
      if(this.scrollY > 750){
          $('.scrollup-btn').addClass("work");
      }else{
          $('.scrollup-btn').removeClass("work");
      }
  });

  
  // Switching the Navigation Bar 
  $('.menu-btn').click(function(){
      $('.navbar .menu').toggleClass("active");
      $('.menu-btn i').toggleClass("active");
  });
  

  // Sliding Feature
  $('.slide').owlCarousel({
      margin: 20,
      loop: true,
      autoplayTimeOut: 2000,
      autoplayHoverPause: true,
      responsive: {
          0:{
              items: 1,
              nav: false
          },
          600:{
              items: 2,
              nav: false
          },
          1000:{
              items: 2,
              nav: false
          }
      }
  });


// Typing Animation
   let type = new Typed(".type1", {
    strings: ["From COVID-19"],
    typeSpeed: 70,
    backSpeed: 50,
    loop: true
  });
});



//[STEP 0]: Make sure our document is A-OK
$(document).ready(function () {
  //what kind of interface we want at the start 
  const APIKEY = "620e43bb34fd621565858726";

  //animation
  $(".animation-loading").show();
  setTimeout(function (){
      $(".animation-loading").hide();
      getContacts();
  }, 4000);
  
  $("#update-contact-container").hide();
  $("#add-update-msg").hide();

  //[STEP 1]: Create our submit form listener
  $("#contact-submit").on("click", function (e) {
    //prevent default action of the button 
    e.preventDefault();

    //[STEP 2]: let's retrieve form data
    //for now we assume all information is valid
    //you are to do your own data validation
    let contactName = $("#contact-name").val();
    let contactEmail = $("#contact-email").val();
    let contactMessage = $("#contact-msg").val();


    //[STEP 3]: get form values when user clicks on send
    //Adapted from restdb api
    let jsondata = {
      "name": contactName,
      "email": contactEmail,
      "message": contactMessage
    };

    //[STEP 4]: Create our AJAX settings. Take note of API key
    let settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://idassignment-4a3f.restdb.io/rest/contact",
      "method": "POST", //[cher] we will use post to send info
      "headers": {
        "content-type": "application/json",
        "x-apikey": APIKEY,
        "cache-control": "no-cache"
      },
      "processData": false,
      "data": JSON.stringify(jsondata),
      "beforeSend": function(){
        //@TODO use loading bar instead
        //disable our button or show loading bar
        $("#contact-submit").prop( "disabled", true);
        //clear our form using the form id and triggering it's reset feature
        $("#add-contact-form").trigger("reset");
      }
    }

    //[STEP 5]: Send our ajax request over to the DB and print response of the RESTDB storage to console.
    $.ajax(settings).done(function (response) {
      console.log(response);

       //add lottie animation
       $(".animation-loading").show();
       setTimeout(function (){
           $("#contact-submit").prop( "disabled", false);
            
      //@TODO update frontend UI 
      $("#add-update-msg").show().fadeOut(3000);
      $(".animation-loading").hide();
  
      //update our table 
      getContacts();
      }, 4000);
    });
  });//end click 


  //[STEP] 6
  //let's create a function to allow you to retrieve all the information in your contacts
  //by default we only retrieve 10 results
  function getContacts(limit = 10, all = true) {

    //[STEP 7]: Create our AJAX settings
    let settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://idassignment-4a3f.restdb.io/rest/contact",
      "method": "GET", //[cher] we will use GET to retrieve info
      "headers": {
        "content-type": "application/json",
        "x-apikey": APIKEY,
        "cache-control": "no-cache"
      },
    }

    //[STEP 8]: Make our AJAX calls
    //Once we get the response, we modify our table content by creating the content internally. We run a loop to continously add on data
    //RESTDb/NoSql always adds in a unique id for each data, we tap on it to have our data and place it into our links 
    $.ajax(settings).done(function (response) {
      
      let content = "";

      for (var i = 0; i < response.length && i < limit; i++) {
        //console.log(response[i]);
        //[METHOD 1]
        //let's run our loop and slowly append content
        //we can use the normal string append += method
        /*
        content += "<tr><td>" + response[i].name + "</td>" +
          "<td>" + response[i].email + "</td>" +
          "<td>" + response[i].message + "</td>
          "<td>Del</td><td>Update</td</tr>";
        */

        //[METHOD 2]
        //using our template literal method using backticks
        //take note that we can't use += for template literal strings
        //we use ${content} because -> content += content 
        //we want to add on previous content at the same time
        content = `${content}<tr id='${response[i]._id}'><td>${response[i].name}</td>
        <td>${response[i].email}</td>
        <td>${response[i].message}</td>
        <td><a href='#' class='delete' data-id='${response[i]._id}'>Del</a></td><td><a href='#update-contact-container' class='update' data-id='${response[i]._id}' data-msg='${response[i].message}' data-name='${response[i].name}' data-email='${response[i].email}' data-email='${response[i].studentid}' data-email='${response[i].mentor}'data-email='${response[i].studentclass}'>Update</a></td></tr>`;

      }

      //[STEP 9]: Update our HTML content
      //let's dump the content into our table body
      $("#contact-list tbody").html(content);

      $("#total-contacts").html(response.length);
    });


  }

  //[STEP 10]: Create our update listener
  //here we tap onto our previous table when we click on update
  //this is a delegation feature of jquery
  //because our content is dynamic in nature, we listen in on the main container which is "#contact-list". For each row we have a class .update to help us
  $("#contact-list").on("click", ".update", function (e) {
    e.preventDefault();
    //update our update form values
    let contactName = $(this).data("name");
    let contactEmail = $(this).data("email");
    let contactId = $(this).data("id");
    let contactMsg = $(this).data("msg");
    console.log($(this).data("msg"));

    //[STEP 11]: Load in our data from the selected row and add it to our update contact form 
    $("#update-contact-name").val(contactName);
    $("#update-contact-email").val(contactEmail);
    $("#update-contact-id").val(contactId);
    $("#update-contact-msg").val(contactMsg);
    $("#update-contact-container").show();

  });//end contact-list listener for update function

  //[STEP 12]: Here we load in our contact form data
  //Update form listener
  $("#update-contact-submit").on("click", function (e) {
    e.preventDefault();
    //retrieve all my update form values
    let contactName = $("#update-contact-name").val();
    let contactEmail = $("#update-contact-email").val();
    let contactMsg = $("#update-contact-msg").val();
    let contactId = $("#update-contact-id").val();

    console.log($("#update-contact-msg").val());
    console.log(contactMsg);

    //[STEP 12a]: We call our update form function which makes an AJAX call to our RESTDB to update the selected information
    updateForm
    (contactId, 
    contactName, 
    contactEmail, 
    contactMsg);
  });//end updatecontactform listener

  //[STEP 13]: function that makes an AJAX call and process it 
  //UPDATE Based on the ID chosen
  function updateForm
  (id, 
  contactName, 
  contactEmail, 
  contactMsg) {

    //@TODO create validation methods for id etc. 

    var jsondata = { "name": contactName, "email": contactEmail, "message": contactMsg,};
    
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": `https://idassignment-4a3f.restdb.io/rest/contact/${id}`,//update based on the ID
      "method": "PUT",
      "headers": {
        "content-type": "application/json",
        "x-apikey": APIKEY,
        "cache-control": "no-cache"
      },
      "processData": false,
      "data": JSON.stringify(jsondata)
    }

    //[STEP 13a]: send our AJAX request and hide the update contact form
    $.ajax(settings).done(function (response) {
      console.log(response);

      //update our contacts table
      $(".animation-loading").show();
      setTimeout(function(){
        $(".animation-loading").hide();
        $("#update-contact-container").fadeOut(3000);
      }, 4000);
      getContacts();
    });
  }//end updateform function

  
  //[Step 14]: delete 
  $("#contact-list").on("click", ".delete", function (e) {
    e.preventDefault();
    console.log("delete");
    let contactId = $(this).data("id");
    $("#delete-contact-container").show();
    deleteRecord(contactId);
    $(".animation-loading").show();
    setTimeout(function(){
    $(".animation-loading").hide();
    $("#delete-student-msg").show().fadeOut(3000);
    $("#delete-contact-container").fadeOut(5000);
    }, 4000)
    getContacts();
  });

  function deleteRecord(id) {
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": `https://idassignment-4a3f.restdb.io/rest/contact/${id}`,
      "method": "DELETE",
       "headers": {
        "content-type": "application/json",
        "x-apikey": APIKEY,
        "cache-control": "no-cache"
      },
    };

    $.ajax(settings).done(function (response){
      console.log(response);
    });
  }
});


