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
	// only update selection if the newselection is different from the current
	if ( selected == newSelection ) {
		return;
	}
	// call deselect on the old selected node
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
	// global deselect for last selected object
	selected.GetComponent(Selectable).DeSelect();
	selected = null;
}

function SetTarget(newTarget : GameObject) {
	if (selected == null || selected == newTarget) {
		return;
	}
	Debug.LogError("Setting new target: "+ selected.name);
	selected.GetComponent(Selectable).SetTarget(newTarget.transform);
}