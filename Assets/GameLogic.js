#pragma strict
//var seconds : float = 0.0;
//var interval : int = 5;
//var Soldier : Transform;
//var target : Transform;
var selected : GameObject;

function Start () {
	selected = null;
}

function SetSelection(newSelection : GameObject) {
	if ( selected == newSelection ) {
		return;
	}
	if ( selected != null ) {
		selected.GetComponent(Selectable).DeSelect();
	}
	selected = newSelection;
	Debug.LogError("Setting new target: "+ selected.name);
}

function GetSelection() {
	return selected;
}

function DeSelect() {
	selected.GetComponent(Selectable).DeSelect();
	selected = null;
}

function SetTarget(newTarget : GameObject) {
	Debug.LogError("Setting new target: "+ selected.name);
	if (selected == null) {
		return;
	}
	
	selected.GetComponent(Selectable).SetTarget(newTarget.transform);
}