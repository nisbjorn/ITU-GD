var selectedMaterial : Material;
var defaultMaterial : Material;
var selected : boolean = false;


var TrooperTarget : Transform = null;
var TrooperUnits = new Array();

var BugTarget : Transform = null;
var BugUnits = new Array();





defaultMaterial = renderer.material;

// handles: selecting- and targeting nodes
function OnMouseOver() {
    if (Input.GetMouseButtonDown(1)) {
    	//Debug.LogError("Right Click!");
    	if ( Input.GetKey( KeyCode.LeftShift ) ) {
    		Debug.LogError("Setting Bug Target!");	
			GameObject.Find("Game").GetComponent(GameLogic).SetTargetBug(gameObject);
			Select();
		} else {
			Debug.LogError("Setting Bug Target!");	
			GameObject.Find("Game").GetComponent(GameLogic).SetTargetTrooper(gameObject);
			Select();
		}
    }
}

function OnMouseDown () {
	if (Input.GetMouseButton(0)) {
		//Debug.LogError("Left Click!");
		GameObject.Find("Game").GetComponent(GameLogic).SetSelection(gameObject);
		Select();
	}
}

function Select() {
	renderer.material = selectedMaterial;
	selected = true;
}

function DeSelect() {
	renderer.material = defaultMaterial;
	selected = false;
}

// set trooper target
function SetTargetTrooper(target : Transform) {
	TrooperTarget = target;
	// there is a race-condition here..
	// - just in case a number of units are added to the array as we set the target..
	while (TrooperUnits.length > 0) {
		var unit : GameObject = TrooperUnits.pop();
		unit.GetComponent( AIPath ).target = this.TrooperTarget;
	}
}

// set bug target
function SetTargetBug(target : Transform) {
	BugTarget = target;
	// there is a race-condition here..
	// - just in case a number of units are added to the array as we set the target..
	while (BugUnits.length > 0) {
		var unit : GameObject = BugUnits.pop();
		unit.GetComponent( AIPath ).target = this.BugTarget;
	}
}

// handles: enemies entering the node
// - either passing through or spawning into
function OnTriggerEnter( collider : Collider ) {
	// simple wrapper
	unitEntered(collider.gameObject);
}

// called by dropzone.js when a unit is spawned
// and when a node's collision is triggered
function unitEntered(unit : GameObject) {
	
	// if unit is freshly spawned or has this node as a target (meaning it's not passing through)
	if ( unit.GetComponent( AIPath ).target == null || unit.GetComponent( AIPath ).target == transform ) {
		// trooper logic
		if (unit.tag == "Trooper") {
			if ( this.TrooperTarget == null ) {
				this.TrooperUnits.push(unit);
				return;
			}
			unit.GetComponent( AIPath ).target = this.TrooperTarget;
		// bug logic
		} else {
			if ( this.BugTarget == null ) {
				this.BugUnits.push(unit);
				return;
			}
			unit.GetComponent( AIPath ).target = this.BugTarget;
		}
	}
}