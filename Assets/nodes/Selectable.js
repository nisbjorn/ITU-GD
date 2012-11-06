var selectedMaterial : Material;
var defaultMaterial : Material;
var selected : boolean = false;
var Target : Transform = null;

defaultMaterial = renderer.material;

function OnMouseOver()
{
    if (Input.GetMouseButtonDown(1))
    {
    	Debug.LogError("Right Click!");
		GameObject.Find("Game").GetComponent(GameLogic).SetTarget(gameObject);
    }

}


function OnMouseDown (){

	// on right click
	if (Input.GetMouseButton(1)) {
		// if user has already selected another node, right click signals a new target for that node
		Debug.LogError("Right Click!");
		GameObject.Find("Game").GetComponent(GameLogic).SetTarget(gameObject);
	}
	
	if (Input.GetMouseButton(0)) {
		Debug.LogError("Left Click!");
		GameObject.Find("Game").GetComponent(GameLogic).SetSelection(gameObject);
		this.Select();
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

function SetTarget(target : Transform) {
	Target = target;
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

function OnTriggerEnter( collider : Collider ) {
	if (collider.gameObject.tag == "Trooper") {
		//Destroy(gameObject);
		if (collider.gameObject.GetComponent( AIPath ).target == transform ) {
			Debug.LogError("update target!");
			collider.gameObject.GetComponent( AIPath ).target = this.Target;
		}
	}
}

function OnTriggerExit(collider : Collider) {
	
}