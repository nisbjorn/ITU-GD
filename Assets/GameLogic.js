#pragma strict

var selected : GameObject;

// game stats
var TrooperKills : int;
var BugKills : int;

// when numberOfBugs = 0 OR numberOfTroopers = 0 ==> gameOver!
var numberOfBugs : int;
var numberOfTroopers : int;

function Start () {
	selected = null;
	numberOfBugs = 0;
	numberOfTroopers = 0;
	TrooperKills = 0;
	BugKills = 0;
}

function Update() {
	if ( numberOfBugs < 0 ) {
		// troopes win!
	}
	if ( numberOfTroopers < 0 ) {
		// bugs win!
	}
}

function AddUnit( unitType : String ) {
	if (unitType == "Trooper") {
		numberOfTroopers++;
	} else {
		numberOfBugs++;
	}
}

function AddingBug() {
	numberOfBugs++;
}


function AddingTroper() {
	numberOfTroopers++;
}

function UnitDied(type : String) {
	if (type == "Trooper") TrooperDied();
	else BugDied();
}

//TODO: race condition
function TrooperDied() {
	BugKills++;
	numberOfTroopers--;
	if ( numberOfTroopers < 0 ) {
		numberOfTroopers = 0;
	}
}

//TODO: race condition
function BugDied() {
	TrooperKills++;
	numberOfBugs--;
	if ( numberOfBugs < 0 ) {
		numberOfBugs = 0;
	}
}

function SetSelection(newSelection : GameObject) {
	// only update selection if the newselection is different from the current
	if ( selected == newSelection ) {
		return;
	}
	// call deselect on the old selected node
	if ( selected != null ) {
		selected.GetComponent(Selectable).DeSelect();
	}
	selected = newSelection;
	Debug.LogError("Selection: " + selected.name);
}

function GetSelection() {
	return selected;
}

function DeSelect() {
	// global deselect for last selected object
	selected.GetComponent(Selectable).DeSelect();
	selected = null;
}

function SetTargetTrooper(newTarget : GameObject) {
	if (selected == null || selected == newTarget) {
		return;
	}
	Debug.LogError("Setting new target: "+ newTarget.name);
	selected.GetComponent(Selectable).SetTargetTrooper(newTarget.transform);
}

function SetTargetBug(newTarget : GameObject) {
	if (selected == null || selected == newTarget) {
		return;
	}
	Debug.LogError("Setting new target: "+ newTarget.name);
	selected.GetComponent(Selectable).SetTargetBug(newTarget.transform);
}