var selectedMaterial : Material;
var defaultMaterial : Material;
var selected : boolean = false;
var Target : Transform = null;
var units = new Array();
defaultMaterial = renderer.material;

function OnMouseOver()
{
    if (Input.GetMouseButtonDown(1))
    {
    	Debug.LogError("Right Click!");
		GameObject.Find("Game").GetComponent(GameLogic).SetTarget(gameObject);
		Select();
    }
}



function OnMouseDown (){

	// on right click
//	if (Input.GetMouseButton(1)) {
//		// if user has already selected another node, right click signals a new target for that node
//		Debug.LogError("Right Click!");
//		GameObject.Find("Game").GetComponent(GameLogic).SetTarget(gameObject);
//	}
	
	if (Input.GetMouseButton(0)) {
		Debug.LogError("Left Click!");
		GameObject.Find("Game").GetComponent(GameLogic).SetSelection(gameObject);
		Select();
	}
//	
//	if (selected) {
//		
//		unSelect();
//	
//	} else {
//	
//		select();
//	
//	}
}

//function select() {
//	
//	for(var endzone : GameObject in GameObject.FindGameObjectsWithTag("Endzone"))
//	{
//    	endzone.GetComponent(Selectable).unSelect();
//	}
//	GameObject.Find("Game").GetComponent(GameLogic).target = this.transform;
//	for (var dropzone : GameObject in GameObject.FindGameObjectsWithTag("DropZone") ) {
//		dropzone.GetComponent(DropZone).Target = this.transform;
//	}
//	
//	renderer.material = selectedMaterial;
//	selected = true;
//}

function Select() {
	renderer.material = selectedMaterial;
	selected = true;
}

function DeSelect() {
	renderer.material = defaultMaterial;
	selected = false;
}

function SetTarget(target : Transform) {
	Target = target;
	// there is a race-condition here..
	// - just in case a number of units are added to the array as we set the target..
	while (units.length > 0) {
		var unit : GameObject = units.pop();
		unit.GetComponent( AIPath ).target = this.Target;
	}
}

function unitEntered(unit : GameObject) {
	if ( this.Target == null ) {
		this.units.push(unit);
		return;
	}
	unit.GetComponent( AIPath ).target = this.Target;
}

function OnTriggerEnter( collider : Collider ) {
	// only update the path of the troopers
	if (collider.gameObject.tag == "Trooper") {
		// only update target if the node that was just entered is actually the target
		// if not, allow the unit to proceed through the node with unchanged target
		if (collider.gameObject.GetComponent( AIPath ).target == transform ) {
			// enqueue unit if there is not target set for this node
			unitEntered(collider.gameObject);
		}
	}
}

//function OnTriggerExit(collider : Collider) { }