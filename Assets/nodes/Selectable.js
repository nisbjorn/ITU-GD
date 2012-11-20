var selectedMaterial : Material;
var targetMaterial : Material;

var Capacity : int = 10;
var TrooperCapacity : int = 10;

var CurrentTrooperCount : int = 0;
var CurrentBugCount : int = 0;

var TrooperTarget : Transform = null;
var TrooperUnits = new Array();

var BugTarget : Transform = null;
var BugUnits = new Array();

// set to true if the node is selected by a user
var isSelected : boolean = false;

// node is blocked
var isBlocked : boolean = false;

// for displaying the target-node-number relative to selected node
var isTarget : boolean = false;
var targetNumber : int = -1;

defaultMaterial = renderer.material;

function Start() {
	InvokeRepeating("releaseTheTroops",1.0f,1.0f);
}

/*
*****************************************************
** MOUSE CONTROLS
*****************************************************
*/
function OnMouseOver() {
    if (Input.GetMouseButtonDown(1)) {
    	if (this.isSelected) {
    		if ( this.isBlocked ) {
    			Debug.LogError("now unblocked!!");
    			this.isBlocked = false;	
    		} else {
    			Debug.LogError("now blocked!");
    			this.isBlocked = true;
    		}
    	}
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

/*
*****************************************************
** FLOW CONTROL
*****************************************************
*/
function SetTargetTrooper(target : Transform) {
	// Disable old targetRender
	if (this.TrooperTarget != null) {
		TrooperTarget.GetComponent(Selectable).TargetRenderOff();
	}
	this.TrooperTarget = target;
	this.TrooperTarget.gameObject.GetComponent(Selectable).TargetRenderOn(1);
	
	// release the hounds!
	releaseTheTroops();
}

// CurrentTrooperCount is increased thorugh PermissionToBoard()
function EnqeueUnit(unit : GameObject) {
	this.TrooperUnits.push(unit);
	unit.GetComponent(AIPath).target = null;
	//this.CurrentTrooperCount += 1;
}

function DeployUnitFromQueue() {
	// 2) pop unit from list
	var unit : GameObject = TrooperUnits.pop();
	// 3) reduce currentTrooperCount
	this.CurrentTrooperCount -= 1;
	// 4)	update target to new node
	unit.GetComponent( AIPath ).target = this.TrooperTarget;
}

function DeployUnit(unit : GameObject) {
	// 3) reduce currentTrooperCount
	this.CurrentTrooperCount -= 1;
	// 4)	update target to new node
	unit.GetComponent( AIPath ).target = this.TrooperTarget;
}

function releaseTheTroops() {	
	// only release units if the node has been unblocked
	if ( this.isBlocked || this.TrooperTarget == null) return;
	
	while (TrooperUnits.length > 0 ) {
		//Debug.LogError("TrooperUnits length: " + this.TrooperUnits.length);
		// 1) reserve space on the node
		if ( this.TrooperTarget.GetComponent(Selectable).PermissionToBoard() ) {
			DeployUnitFromQueue();
		}
		return;		
	}
}

// handles: enemies entering the node
// - either passing through or spawning into
function OnTriggerEnter( collider : Collider ) {
	// simple wrapper
	//Debug.LogError("Collission!");
	unitEntered(collider.gameObject);
}

// called by dropzone.js when a unit is spawned
// and when a node's collision is triggered
function unitEntered(unit : GameObject) {
	// if unit is freshly spawned or has this node as a target (meaning it's not passing through)
	if ( unit.GetComponent( AIPath ).target == null || unit.GetComponent( AIPath ).target == transform ) {
		// trooper logic
		if (unit.tag == "Trooper") {
			if ( this.TrooperTarget != null && !this.isBlocked ) {
				if ( TrooperTarget.GetComponent(Selectable).PermissionToBoard() ) {
					DeployUnit(unit);
					return;
				}
			}
			
			//unit.GetComponent( AIPath ).target = transform;
			//this.CurrentTrooperCount += 1;
			this.EnqeueUnit(unit);
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

/*****************************
 ** AI 
 ******************************/

// set bug target
function SetTargetBug(target : Transform) {
	BugTarget = target;
	// there is a race-condition here..
	// - just in case a number of units are added to the array as we set the target..
	//BugTarget.GetComponent(Selectable).TargetRenderOn();
	while (BugUnits.length > 0 ) {
		var unit : GameObject = BugUnits.pop();
		this.CurrentBugCount--;
		unit.GetComponent( AIPath ).target = this.BugTarget;
	}
}

/*
*****************************************************
** UNIT HELPER FUNCTIONS
*****************************************************
*/

// returns 'true' if node is below capacity
function AtMaxCapacity() {
	if ( this.TrooperCapacity - this.CurrentTrooperCount <= 0 ) {
		return true;
	} else {
		return false;
	}
}

// called by units with the node as their target as they die
function ApproachingOrArrivedTrooperDied() {
	
	this.CurrentTrooperCount -= 1;
	//Debug.LogError("Reducing troopercount: " + this.CurrentTrooperCount);
}

// if the node has capacity, reserve a space (increase troopercount) and return 'true'
// - oelse return 'false'
function PermissionToBoard() {
	if ( this.TrooperCapacity - this.CurrentTrooperCount <= 0 ) 
		return false;
	
	this.CurrentTrooperCount += 1;
	return true;
}

/*
*****************************************************
** HEADS UP DISPLAY
*****************************************************
*/

// handles marking nodes as targets or "next nodes" from a given node
// - nodes with a targetNode != null are sequentially called to mark and label the redirect path
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