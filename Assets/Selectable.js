var selectedMaterial : Material;
var defaultMaterial : Material;
var selected : boolean = false;

defaultMaterial = renderer.material;

function OnMouseDown (){
	if (selected) {
		unSelect();
	} else {
		select();
	}
}

function select() {
	
		for(var endzone : GameObject in GameObject.FindGameObjectsWithTag("Endzone"))
{
    endzone.GetComponent(Selectable).unSelect();
}
GameObject.Find("Game").GetComponent(GameLogic).target = this.transform;
		renderer.material = selectedMaterial;
		selected = true;
}

function unSelect() {
	renderer.material = defaultMaterial;
		selected = false;
}