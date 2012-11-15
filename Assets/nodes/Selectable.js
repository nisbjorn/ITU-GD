var selectedMaterial : Material;
var defaultMaterial : Material;
var selected : boolean = false;

var Capacity : int = 10;
var CurrentTrooperCount : int = 0;
var CurrentBugCount : int = 0;

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
			//Select();
		} else {
			Debug.LogError("Setting Trooper Target!");	
			GameObject.Find("Game").GetComponent(GameLogic).SetTargetTrooper(gameObject);
			//Select();
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

// 1) render SelectPlate
// 2) disable targetRender
// 2) render TargetPlate (if not null)
function Select() {
	transform.Find("SelectPlate").GetComponent(MeshRenderer).enabled = true;
	transform.Find("TargetPlate").GetComponent(MeshRenderer).enabled = false;
	// if node has a target, show that target!
	if (this.TrooperTarget != null) {
		//TrooperTarget.GetComponent(Selectable).DeSelect();
		TrooperTarget.GetComponent(Selectable).TargetRenderOn();
	}
	//renderer.material = selectedMaterial;
	//selected = true;
}

// 1) remove SelectPlate
// 2) remove TargetPlate
function DeSelect() {
	// disable selectPlate
	transform.Find("SelectPlate").GetComponent(MeshRenderer).enabled = false;
	//transform.Find("TargetPlate").GetComponent(MeshRenderer).enabled = false;
	if (this.TrooperTarget != null) {
		TrooperTarget.GetComponent(Selectable).DeSelect();
		TrooperTarget.GetComponent(Selectable).TargetRenderOff();
	}
	//TrooperTarget.GetComponent(Selectable).RenderAsTarget();
	//renderer.material = defaultMaterial;
	//selected = false;
}



function SetTargetTrooper(target : Transform) {
	// Disable old targetRender
	if (this.TrooperTarget != null) {
		TrooperTarget.GetComponent(Selectable).TargetRenderOff();
	}
	TrooperTarget = target;
	
	TrooperTarget.GetComponent(Selectable).TargetRenderOn();
	//target.gameObject.GetComponent(Selectable).
	
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
	BugTarget.GetComponent(Selectable).TargetRenderOn();
	while (BugUnits.length > 0) {
		var unit : GameObject = BugUnits.pop();
		unit.GetComponent( AIPath ).target = this.BugTarget;
	}
}

function TargetRenderOn() {
	transform.Find("TargetPlate").GetComponent(MeshRenderer).enabled = true;
}

function TargetRenderOff() {
	transform.Find("TargetPlate").GetComponent(MeshRenderer).enabled = false;
}


//function HasRoom() {
//	if (  )
//}

// set trooper target


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