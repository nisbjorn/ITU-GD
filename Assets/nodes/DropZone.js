#pragma strict
var spawnTimer : float = 3;
var Unit : Transform;
//var Target : Transform;

function Start () {
	SpawnUnits();
}

function SpawnUnits() {
	while (true) {
		if ( Unit.name == "Soldier" ) {
			if ( gameObject.GetComponent(Selectable).PermissionToBoard() ) {
			//Debug.Log("SPAWNING!");
  			var unit : Transform = Instantiate(Unit, 
  				Vector3(transform.position.x, transform.position.y+1, transform.position.z), 
  				Quaternion.Euler(0,90,0));
  			//gameObject.GetComponent(Selectable).unitEntered(unit.gameObject);
  			}
		} else {
				var unit2 : Transform = Instantiate(Unit, 
  				Vector3(transform.position.x, transform.position.y+1, transform.position.z), 
  					Quaternion.Euler(0,90,0));
  				gameObject.GetComponent(Selectable).unitEntered(unit2.gameObject);
		}
		yield WaitForSeconds(spawnTimer);
	}
}