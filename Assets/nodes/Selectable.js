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

var isSelected : boolean = false;
function Select() {
	isSelected = true;
	transform.Find("SelectPlate").GetComponent(MeshRenderer).enabled = true;
	//transform.Find("TargetPlate").GetComponent(MeshRenderer).enabled = false;
	// if node has a target, show that target!
	if (this.TrooperTarget != null) {
		//TrooperTarget.GetComponent(Selectable).DeSelect();
		TrooperTarget.GetComponent(Selectable).TargetRenderOn(1);
	}
	//renderer.material = selectedMaterial;
	//selected = true;
}

// 1) remove SelectPlate
// 2) remove TargetPlate
function DeSelect() {
	isSelected = false;
	// disable selectPlate
	transform.Find("SelectPlate").GetComponent(MeshRenderer).enabled = false;
	//transform.Find("TargetPlate").GetComponent(MeshRenderer).enabled = false;
	if (this.TrooperTarget != null) {
		//TrooperTarget.GetComponent(Selectable).DeSelect();
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
	TrooperTarget.gameObject.GetComponent(Selectable).TargetRenderOn(1);
	
	// there is a race-condition here..
	// - just in case a number of units are added to the array as we set the target..
	while (TrooperUnits.length > 0) {
		var unit : GameObject = TrooperUnits.pop();
		unit.GetComponent( AIPath ).target = this.TrooperTarget;
	}
	//Select();
}

// set bug target
function SetTargetBug(target : Transform) {
	BugTarget = target;
	// there is a race-condition here..
	// - just in case a number of units are added to the array as we set the target..
	//BugTarget.GetComponent(Selectable).TargetRenderOn();
	while (BugUnits.length > 0) {
		var unit : GameObject = BugUnits.pop();
		unit.GetComponent( AIPath ).target = this.BugTarget;
	}
}
var isTarget : boolean = false;
var targetNumber : int = -1;
function TargetRenderOn(val : int) {
	if (isTarget == true || isSelected == true) return;
	isTarget = true;
	targetNumber = val;
	transform.Find("TargetPlate").GetComponent(MeshRenderer).enabled = true;
	if ( TrooperTarget == null ) return;
	val = val + 1;
	TrooperTarget.GetComponent(Selectable).TargetRenderOn(val);
}

function TargetRenderOff() {
	if (isTarget == false) return;
	isTarget = false;
	targetNumber = -1;
	transform.Find("TargetPlate").GetComponent(MeshRenderer).enabled = false;
	if ( TrooperTarget == null ) return;
	TrooperTarget.GetComponent(Selectable).TargetRenderOff();
}

function OnGUI() {
	if ( !isTarget ) return;
    var pos = transform.position;
	pos.y += 15;
	pos = Camera.main.WorldToScreenPoint(pos); 
	var rect = new Rect(pos.x - 10, Screen.height - pos.y - 15, 100, 22);
	GUI.color = Color.black;
    GUI.Label(rect, targetNumber.ToString() );
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