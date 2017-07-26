var file_txt = "";

var Partecipants = [];
var rounds = 0;

function changeImage(){ //not used
	document.getElementById("img_title").style.height="50%";
	document.getElementById("img_title").style.width="50%";
	return true;
}

function player (name,life,pow,name_pow){
	this.name = name;
	this.life = life;
	
	this.pow = pow; // array from 0 to 2
	
	this.name_pow = name_pow; // array from 0 to 2
}

//var p = new player();

document.getElementById("openFile").addEventListener('change',function(){ //get players from file
	var fr = new FileReader();
	fr.onload = function(){
		//document.getElementById("fileContents").textContent = this.result;
		file_txt = this.result;
		createPlayersFromFile(file_txt);
	}
	fr.readAsText(this.files[0]);
	document.getElementById("first_page").style.display = 'none';
	document.getElementById("names_page").style.display = 'block';
	document.getElementById("img_title").style.display = 'none';
	
});



function createPlayersFromFile(file_txt){ //load players in array
	
	var str = "";
	Partecipants = [];
	
	var array = file_txt.split(/\r?\n/);
	for(var i=0;i<array.length;i++){
		var pow123 = array[i+2].split(" ");
		var name_pow123 = array[i+3].split(" ");
		
		if (array[i] == 'undefined') array[i] = "unknown";
		if (array[i+1] == 'undefined') array[i] = 0;
		if (pow123[0] == 'undefined') array[i] = 0;
		if (pow123[1] == 'undefined') array[i] = 0;
		if (pow123[2] == 'undefined') array[i] = 0;
		if (name_pow123[0] == 'undefined') array[i] = "null";
		if (name_pow123[1] == 'undefined') array[i] = "null";
		if (name_pow123[2] == 'undefined') array[i] = "null";
		Partecipants.push(new player(array[i],array[i+1],pow123,name_pow123));
		
		str = str + "Name: " + array[i] + "<br>" + " Life: " + array[i+1] + " LP" + "<br>" + " Powers: " + name_pow123[0] + "("+pow123[0]+") " + name_pow123[1] + "("+pow123[1]+") " + name_pow123[2] + "("+pow123[2]+") " + "<br>" + "<br>";
		
		i = i + 3;
	}
	if (str != "") document.getElementById("members_print").innerHTML = str;
	return;
}

function battle_begin(){ //Here we go!
	if(document.getElementById("names_page").style.display == 'block')  document.getElementById("names_page").style.display = 'none';
	if(document.getElementById("battle_page").style.display == 'none')  document.getElementById("battle_page").style.display = 'block';
	
	var str = "";
	
	var indexex=0;
	
	// REMOVE PLAYERS & VICTORY
	while (indexex < Partecipants.length){ //remove all dead players
		if(Partecipants[indexex].life <= 0){ 
			Partecipants.splice(indexex,1);
		} else indexex++;
	}
	
	//CHECK WIN & PLAY
	if(Partecipants.length == 1){
		str = Partecipants[0].name + " won the Totally Random Battle Simulator Tournament!"
		document.getElementById("battle_page").style.display = 'none';
		document.getElementById("finish_page").style.display = 'block';
		document.getElementById("img_title").style.display = 'block';
		document.getElementById("battle_finish").innerHTML = str;
	}
	else if(Partecipants.length < 1){
		document.getElementById("battle_page").style.display = 'none';
		document.getElementById("finish_page").style.display = 'block';
		document.getElementById("img_title").style.display = 'block';
	}
	else {
		
		// CALCULATE
		var battle_case = Math.floor((Math.random() * 5) + 1); //numbers of cases, have fun! from 1 to x
		var pl1_number;
		var pl2_number;
		pl1_number = Math.floor((Math.random() * (Partecipants.length)) + 0); //random player
		do {
			pl2_number = Math.floor((Math.random() * (Partecipants.length)) + 0);
		} while (pl1_number == pl2_number);
		
		switch(battle_case){
			
			case 1: //counterattack mode
				var pow1 = Math.floor((Math.random() * 3) + 1);
				var pow2 = Math.floor((Math.random() * 3) + 1);
				str = Partecipants[pl1_number].name + " uses " + Partecipants[pl1_number].name_pow[pow1-1] + " against " + Partecipants[pl2_number].name + ", but the latter counterattacks with " + Partecipants[pl2_number].name_pow[pow2-1] + "!";
				Partecipants[pl1_number].life = parseInt(Partecipants[pl1_number].life) - parseInt(Partecipants[pl2_number].pow[pow2-1]);
				break;
				
			case 2: //attack mode
				var pow1 = Math.floor((Math.random() * 3) + 1);
				var pow2 = Math.floor((Math.random() * 3) + 1);
				str = Partecipants[pl1_number].name + " uses " + Partecipants[pl1_number].name_pow[pow1-1] + " against " + Partecipants[pl2_number].name + ", and it's effective!";
				Partecipants[pl2_number].life = parseInt(Partecipants[pl2_number].life) - parseInt(Partecipants[pl1_number].pow[pow1-1]);
				break;
				
			case 3: //autokills + recover
				var autokill = Math.floor((Math.random() * 104) + 1);
				if(autokill<15){
					str = Partecipants[pl1_number].name + " falls out of the arena and dies smashed! (oh god) [0.0]" ;
					Partecipants[pl1_number].life = 0;
				}
				else if(autokill>=15 && autokill<50){
					str = Partecipants[pl1_number].name + " is poisoned and loses " + autokill + " LP!";
					Partecipants[pl1_number].life = parseInt(Partecipants[pl1_number].life) - autokill;
				}
				else if(autokill>=50 && autokill<85){
					str = Partecipants[pl1_number].name + " tries to sleep a bit, to recover some energy. His life increases by 10!";
					Partecipants[pl1_number].life = parseInt(Partecipants[pl1_number].life) + 10;
				}
				else if(autokill>=85 && autokill<=100){
					str = Partecipants[pl1_number].name + " explodes! (randomly ._. ) and dies! (c'est la vie)";
					Partecipants[pl1_number].life = 0;
				}
				else str = Partecipants[pl1_number].name + " cries like a baby in a corner of a cave..."; //for debug
				break;
			
			case 4: //medikit & power-ups
				var cases = Math.floor((Math.random() * 100) + 1);
				
				if (cases<60){
					var medikit = Math.floor((Math.random() * 10) + 20);
					str = Partecipants[pl1_number].name + " finds a medikit and regains " + medikit + " LP!";
					Partecipants[pl1_number].life = parseInt(Partecipants[pl1_number].life) + medikit;
				}
				else if (cases>=60){
					var pow1 = Math.floor((Math.random() * 3) + 1);
					var powup = Math.floor((Math.random() * 15) + 10);
					str = Partecipants[pl1_number].name + " finds a power-up for the move " + Partecipants[pl1_number].name_pow[pow1-1] + " and gains " + powup +" ATK!";
					Partecipants[pl1_number].pow[pow1-1] = parseInt(Partecipants[pl1_number].pow[pow1-1]) + powup;
				}
				break;
				
			case 5: //objects!
				var n_obj = Math.floor((Math.random() * 3) + 1);
				var damage;
				if(n_obj==1){
					damage = Math.floor((Math.random() * 10) + 10);
					str = Partecipants[pl1_number].name + " finds a knife and uses it against " + Partecipants[pl2_number].name + "!" + " The latter loses " + damage + " LP!";
					Partecipants[pl2_number].life = parseInt(Partecipants[pl2_number].life) - damage;
				}
				else if(n_obj==2){
					damage = Math.floor((Math.random() * 30) + 20);
					str = Partecipants[pl1_number].name + " finds a RPG and uses it against " + Partecipants[pl2_number].name + "!" + " The latter loses " + damage + " LP!";
					Partecipants[pl2_number].life = parseInt(Partecipants[pl2_number].life) - damage;
				}
				else if(n_obj==3){
					damage = Math.floor((Math.random() * 2) + 5);
					str = Partecipants[pl1_number].name + " finds a cat... and uses it against " + Partecipants[pl2_number].name + "!" + " The latter loses " + damage + " LP!";
					Partecipants[pl2_number].life = parseInt(Partecipants[pl2_number].life) - damage;
				}
				break;
				
			default:
				str = "A game made by Marco Lo Pinto, if you see this line the game has a bug ('∩')";
				
		}
	}
	rounds++;
	document.getElementById("round_screen").innerHTML = "ROUND " + rounds;
	document.getElementById("battle_print").innerHTML = str;
	printLifePlayers();
	
	return;
}

function printLifePlayers(){
	var str="";
	str = "Player's Life:"+"&#10;&#10;" ;
	for (var i =0; i< Partecipants.length; i++){
		str = str + Partecipants[i].name+": ";
		if( Partecipants[i].life<=0) str = str + " &#9760;"
		else str = str + Partecipants[i].life;
		str = str + "&#10;";
	}
	
	document.getElementById("life_pl").innerHTML = str;
	return;
}

function toggle_visibility(id) { //not properly working(?)
    var e = document.getElementById(id);
    if(e.style.display == 'block')
        e.style.display = 'none';
    else
        e.style.display = 'block';
}
