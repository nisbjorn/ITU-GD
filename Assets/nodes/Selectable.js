var selectedMaterial : Material;
var defaultMaterial : Material;
var selected : boolean = false;
var Target : Transform = null;
var units = new Array();
defaultMaterial = renderer.material;

// handles: selecting- and targeting nodes
function OnMouseOver()
{
    if (Input.GetMouseButtonDown(1)) {
    	Debug.LogError("Right Click!");
		GameObject.Find("Game").GetComponent(GameLogic).SetTarget(gameObject);
		Select();
    }
}

function OnMouseDown (){
	if (Input.GetMouseButton(0)) {
		Debug.LogError("Left Click!");
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

function SetTarget(target : Transform) {
	Target = target;
	// there is a race-condition here..
	// - just in case a number of units are added to the array as we set the target..
	while (units.length > 0) {
		var unit : GameObject = units.pop();
		unit.GetComponent( AIPath ).target = this.Target;
	}
}

// handles: enemies entering the node
// - either passing through or spawning into
function OnTriggerEnter( collider : Collider ) {
	// simple wrapper
	unitEntered(collider.gameObject);
}

function unitEntered(unit : GameObject) {
	if (unit.tag != "Trooper") {
		return;
	}
	
	if ( unit.GetComponent( AIPath ).target == null || unit.GetComponent( AIPath ).target == transform ) {
		if ( this.Target == null ) {
			this.units.push(unit);
			return;
		}
		unit.GetComponent( AIPath ).target = this.Target;
	}
}