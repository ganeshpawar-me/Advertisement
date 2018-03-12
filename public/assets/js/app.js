
function booked(add ) {

 app.messageBox = true;
 app.message = 'This bus is booked on requested date';
 app.addBox = true;
}


function notBooked(busNo) {

console.log('not booked called');
console.log(busNo);
  const firestore = firebase.firestore();
  firestore.collection('busInfo').where("busNo", "==", busNo)
  .get()
  .then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      console.log(doc.id, " => ", doc.data());

      app.messageBox = true;
      app.message = 'Minimum traffic on this bus is ' + doc.data().traffic + ' Your total cost is '
      + doc.data().traffic * 20 + ' paise ';

      app.BookButton = true;



    });

  })
  .catch(function(error) {
    console.log("Error getting documents: ", error);
  });





}


 var app = new Vue({

  el : "#app",
  data : {
    user       : '',
    messageBox : false,
    addBox     : false,
    BookButton : false,
    message    : 'you can book the add',
    add        : 'this is add'
  },
  methods : {

    check : function (){

      $( "#check" ).addClass( "disabled" );
      app.messageBox = false;
      app.addBox    = false;
      app.add = '';

      var busNo = document.getElementById('busNo').value;
      var date = document.getElementById('date').value;
      var add = document.getElementById('add').value;
      console.log(date);
      const firestore = firebase.firestore();
      firestore.collection('bookings').where("busNo", "==", busNo).where("date", "==", date)
      .get()
      .then(function(querySnapshot) {
          $( "#check" ).removeClass( "disabled" );
        querySnapshot.forEach(function(doc) {
          console.log(doc.id, " => ", doc.data());
        app.add = doc.data().add;


        });


        if (app.add.length > 0) {
        booked(app.add);
        }else {
          notBooked(busNo);
        }

      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });


    },

    book : function (){
        $( "#book" ).addClass( "disabled" );
      var busNo = document.getElementById('busNo').value;
      var date = document.getElementById('date').value;
      var add = document.getElementById('add').value;
      const firestore = firebase.firestore();
      const docRef    = firestore.collection('bookings');
        docRef.add({
          add   : add ,
          busNo : busNo ,
          date : date ,
          user : app.user
        }).then(function (){
          console.log('booked');
            $( "#book" ).removeClass( "disabled" );
          alert("Booked");

        }).catch(function (){
          console.log(error);
        });

    }

  }



});

function logOut() {
   firebase.auth().signOut().then(() => {

         this.isUserLoggedIn = false;

       }, (error) => {
         //todo
       });

  console.log('log out');

}




initApp = function() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      app.user = user.email;
      console.log(app.user);

    } else {
      // User is signed out.
      location.href = './index.html';
    }
  }, function(error) {
    console.log(error);
  });
};

window.addEventListener('load', function() {
  initApp();

});
