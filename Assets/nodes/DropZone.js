#pragma strict
var spawnTimer : float = 3;
var Unit : Transform;
//var Target : Transform;

function Start () {
	SpawnUnits();
}

function SpawnUnits() {
	while (true) {
		Debug.Log("SPAWNING!");
  		var unit : Transform = Instantiate(Unit, 
  			Vector3(transform.position.x, transform.position.y+1, transform.position.z), 
  			Quaternion.Euler(0,90,0));
		
		// singal that we've just added a gameobject
		gameObject.GetComponent(Selectable).unitEntered(unit.gameObject);
		yield WaitForSeconds(spawnTimer);
	}
}