#pragma strict
var seconds : float = 0.0;
var interval : int = 5;
var Soldier : Transform;
var target : Transform;

function Start () {

}

function Update () {
	seconds += Time.deltaTime;
	if (seconds>interval) {
		seconds = 0;
		var soldier : Transform = Instantiate(Soldier, Vector3(-38.58082,0,-15.87056), Quaternion.Euler(0,90,0)); 
		soldier.GetComponent(AIPath).target = target;
	}
}