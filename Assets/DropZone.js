#pragma strict
var spawnTimer : float = 3;
var Soldier : Transform;
var Target : Transform;

function Start () {
	
}

function Update () {
	if	( spawnTimer > 0 ) {
		spawnTimer -= Time.deltaTime;
		return;
 	}
 	spawnTimer = 3;
  	Debug.Log("SPAWNING!");
  	var soldier : Transform = Instantiate(Soldier, transform.position, Quaternion.Euler(0,90,0)); 
	soldier.GetComponent(AIPath).target = Target;
 	
 	return;
}