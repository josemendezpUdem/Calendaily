function setUp()
{
	// Initialize Firebase
	var config = 
	{
	apiKey: "AIzaSyAyqZDxev-pf1-Y1IYqvp5H2SK8B3dnFO4",
	authDomain: "calendaily-4bdfe.firebaseapp.com",
	databaseURL: "https://calendaily-4bdfe.firebaseio.com",
	projectId: "calendaily-4bdfe",
	storageBucket: "",
	messagingSenderId: "348420926173"
	};
	firebase.initializeApp(config);

	firebase.auth().onAuthStateChanged(function(user)
	{
		if (user)
		{
			var url = window.location.href.split("/");
			if(url[url.length - 1] == "landing.html" || url[url.length - 1] == "SignUp.html" )
			{
				setTimeout(function()
				{
					
					changeWindow("index.html");
				},2500);
			}
			else{
			console.log(user.uid + " logged in");
			}
		}
	});
}
setUp();

function login()
 {
	var userEmail = document.getElementById("email_field").value;
	var userPass = document.getElementById("password_field").value;

	firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error)
	{
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		window.alert("Error : " + errorMessage);
	});
	
	setTimeout(function()
	{
		var user = firebase.auth().currentUser;
		if(user != null)
		{
			changeWindow("index.html");
		}
		else
		{
			//changeWindow("index.html");
		}
	},500);
}

function logout()
{
	firebase.auth().signOut();
	window.location.replace("./landing.html");
}


function signup()
{		
	var userEmail = document.getElementById("email_field_su").value;
	var userPass = document.getElementById("password_field_su").value;
	if(userPass.length <= 5)
	{
		window.alert("The password needs to be more than 5 characters");
		return;
	}
	
	firebase.auth().createUserWithEmailAndPassword(userEmail, userPass).catch(function(error)
	{
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
	});
	console.log("signup1");
	
	setTimeout(function()
	{
		if (firebase.auth().currentUser !== null)
		{
			var userUID = firebase.auth().currentUser.uid;
				
			var friendsUID = [
			];
			
			var materias = [
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
			];
			
			var database = firebase.database();
			var ref = database.ref('users/' + userUID);
			
			ref.set(
			{
				userUID: userUID,
				userEmail: userEmail,
				materias: materias,
				friendsUID : friendsUID
			});
			
		}
		else
		{
			console.log("No user");
		}
	},2000);
	
}

function changeWindow(newWindow)
{
	var url = window.location.href.split("/");
	var docName = url[url.length - 1];
	if(docName  != newWindow)
	{
		window.location.replace("./" + newWindow);
	}
}

function addFriend()
{
	var friendEmail = document.getElementById("add_friend").value;

	var user = firebase.auth().currentUser;
	if(user == null)
	{
		window.alert("No user");
		return;
	}

	var database = firebase.database();
	var ref = database.ref('users');
	var friendUID = "";
	var friendFlag = false;
	
	ref.on('value',
	function(snapshot)
	{
		var keys = Object.keys(snapshot.val());
		for(var i = 0; i < keys.length; i++)
		{
			var refUser = database.ref('users/' + keys[i]);  
			refUser.on('value',
			function(snapshot)
			{
				if(friendEmail == snapshot.val().userEmail)
				{
					friendUID = snapshot.val().userUID;
					//console.log(friendUID);
					friendFlag = true;
				}
			});
		}
	});
	setTimeout(function()
	{
		if(friendFlag == true)
		{
			var myRef = database.ref('users/' + user.uid); 
			var friends  = [
				];
			myRef.on('value',
			function(snapshot)
			{
				friends = snapshot.val().friendsUID;
			});
			
			var index = 0;
			if(friends != null)
			{
				index = friends.length;
			}
			else
			{
				console.log("no existe");
			}
			console.log(index);
			
			
			
			var myRefFriends = database.ref('users/' + user.uid + '/friendsUID/' + index);
			myRefFriends.set(friendUID);
			window.alert(friendEmail + " ha sido agregado");
			
			
			location.reload();
			/*
			for(var i = 0; i < index; i++)
			{
				var element = document.getElementById("username" + (i + 1));
				element.parentNode.removeChild(element);
				element = document.getElementById("boton" + (i + 1));
				element.parentNode.removeChild(element);
			}
			
			//Anadir amigo
			for(var i = 0; i < index + 1; i++)
			{
				var j = i + 1;
				var friendRef = database.ref('users/' + friends[i]); 
				friendRef.on('value',
				function(snapshot)
				{
					console.log(snapshot.val().userEmail);
					document.getElementById("username" + j).innerHTML = snapshot.val().userEmail;
				});
				document.getElementById("boton" + j).innerHTML = '<button type="button" class="btn btn-danger">Erase</button>';
			}
			*/
		}
		else
		{
			window.alert(friendEmail + " no es un usuario valido");
		}
	},1000);
}

function showCurrntFriends()
{
	setTimeout(function()
	{
		var userUID;
		if(firebase.auth().currentUser == null)
		{
			changeWindow("landing.html");
			return;
		}
		else
		{
			userUID = firebase.auth().currentUser.uid;
		}

		var database = firebase.database();
		
		setTimeout(function()
		{
				var myRef = database.ref('users/' + userUID ); 
				var friends;
				var index = 0;
				var friendsEmail = [
				];
				myRef.on('value',
				function(snapshot)
				{
					friends = snapshot.val().friendsUID;
					index = friends.length;
					
					//Anadir amigo
					for(var j = 0; j < index; j++)
					{
						var friendRef = database.ref('users/' + friends[j] + "/userEmail");
						var userEmail = "";
						friendRef.on('value',
						function(snapshot)
						{	
							friendsEmail[friendsEmail.length] = snapshot.val();
							
						});
					}
					
					setTimeout(function()
					{
						var j = 0;
						for(var i = 0; i < friendsEmail.length; i++)
						{
							j = i + 1;
							document.getElementById("boton" + j).innerHTML = '<button type="button" class="btn btn-danger">Erase</button>';
							document.getElementById("username" + j).innerHTML = '' + friendsEmail[i];
						}
					},500);
				});
		},1000);
	},500);
}
function getCurrentUser()
{
	if(currentUser != null)
	{
		return currentUser;
	}	
	else
	{
		window.alert("No user");
	}
}

function updateMaterias(mats)
{
	console.log(mats);
	
	setTimeout(function()
	{
		if (firebase.auth().currentUser !== null)
		{
			var userUID = firebase.auth().currentUser.uid;
			var database = firebase.database();
			var ref = database.ref('users/' + userUID + "/materias");
			
			ref.set(mats);
			
			setTimeout(function()
			{
				changeWindow("index.html");
			},1500);
		}
		else
		{
			console.log("No user");
		}
		
	},500);
}

function loadIndex() 
{
	setTimeout(function()
	{
		
		var userUID;
		if(firebase.auth().currentUser == null)
		{
			changeWindow("landing.html");
			return;
		}
		else
		{
			userUID = firebase.auth().currentUser.uid;
		}
		
		var database = firebase.database();
		var friends = [];
		var arregloUsuario = [[]];
		var arreglo3dAmigos = [];
		
		var userRef = database.ref('users/' + userUID);
		userRef.on('value',
		function(snapshot)
		{	
			arregloUsuario = snapshot.val().materias;
			friends = snapshot.val().friendsUID;
							
		});
		
		//Get all friend's schedule
		setTimeout(function()
		{
			for (i = 0; i < friends.length; i++)
			{
				var friendRef = database.ref('users/' + friends[i] + "/materias");
				friendRef.on('value',
				function(snapshot)
				{	
					arreglo3dAmigos[arreglo3dAmigos.length] = snapshot.val();
				});
			}
		}, 750);
		setTimeout(function()
		{
			
			//Display user's schedule
			for(var a = 0; a < arregloUsuario.length; a++)
			{
				for(var b = 0; b < arregloUsuario[a].length; b++)
				{
					if(arregloUsuario[a][b] === 1)
					{
						document.getElementById(a + "" + b).classList.add('setFondoNegro');
					}
				}
			}
			
			//Display friend's schedule
			var cantidadAmigos = friends.length;
			var disponibilidad = 0;
			var porcentaje = 0;
			console.log(arreglo3dAmigos);
			for(var a = 0; a < arregloUsuario.length; a++)
			{
				for(var b = 0; b < arregloUsuario[a].length; b++)
				{
					disponibilidad = 0;
					if(arregloUsuario[a][b] === 0)
					{
						for(var c = 0; c < cantidadAmigos; c++)
						{
							if(arreglo3dAmigos[c][a][b] == 1)
							{
								disponibilidad ++;
							}	
						}
						porcentaje = disponibilidad / cantidadAmigos;
						//console.log(porcentaje);
						if(porcentaje >= 0.75)
						{
							document.getElementById(a + "" + b).classList.add('setFondoRojo');
						}
						else if(porcentaje >= 0.5)
						{
							document.getElementById(a + "" + b).classList.add('setFondoOrange');
						}
						else if(porcentaje >= 0.25)
						{
							document.getElementById(a + "" + b).classList.add('setFondoAmarillo');
						}
						else{
							document.getElementById(a + "" + b).classList.add('setFondoVerde');
						}
					}
				}
			}
		}, 1000);
	},500);
}