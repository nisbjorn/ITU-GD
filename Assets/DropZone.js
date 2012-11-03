#pragma strict
var spawnTimer : float = 3;
var Soldier : Transform;
var Target : Transform;

function Start () {
	InvokeRepeating("SpawnUnit", 3.0, 3.0);
}

function SpawnUnit() {
	Debug.Log("SPAWNING!");
  	var soldier : Transform = Instantiate(Soldier, transform.position, Quaternion.Euler(0,90,0)); 
	soldier.GetComponent(AIPath).target = Target;
}


function Update () {
}