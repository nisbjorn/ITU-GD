#pragma strict
var spawnTimer : float = 3;
var Unit : Transform;
var Target : Transform;

function Start () {
	SpawnUnits();
}

function SpawnUnits() {
	while (true) {
		Debug.Log("SPAWNING!");
  		var unit : Transform = Instantiate(Unit, transform.position, Quaternion.Euler(0,90,0)); 
		unit.GetComponent(AIPath).target = Target;
		yield WaitForSeconds(spawnTimer);
	}
	
}


function Update () {
}