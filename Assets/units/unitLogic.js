#pragma strict
var observeTimer : float = 0.1;
var enemySightedMat : Material;

// raceSpecifics


// unitStats
// needs more comments
var ScanRadius : float = 3;
var ScanFrequency : float = 0.1;
var unitAccuracy : float = 70.0;
var baseHealth : float = 10;
var baseDamage : float = 5;
var enemyTag : String;
var firingFrequency : float = 0.7;

function Start() {
	if (gameObject.tag == "Trooper") {
		enemyTag = "Bug";
	} else {
		enemyTag = "Trooper";
	}
	ScanForEnemies();
}

function ScanForEnemies() {	

	while ( true ) {
		var objectsInRange : Collider[] = Physics.OverlapSphere(transform.position, ScanRadius);
	    
	    // identify closest enemy and shoot!
	    var maxDistance : int = 1000;
	    var closestEnemy : GameObject;
	    for (var col : Collider in objectsInRange)
	    {
	    	// only check items that respoond to enemyTag
	        if ( col.gameObject.tag == enemyTag ) {
	        	
	        	var distance = Vector3.Distance( col.transform.position, transform.position);
	        	if ( distance < maxDistance ) {
	        		closestEnemy = col.gameObject;
	        		maxDistance = distance;
	        	}
	        }
	    }
	    
	    if ( closestEnemy != null ) { 
	    	//Debug.LogError("Engaging enemy!");
	    	this.GetComponent(AIPath).canMove = false;
	    	EngageEnemy(closestEnemy);
	    } else {
	    	this.GetComponent(AIPath).canMove = true;
	    }
	    
	    yield WaitForSeconds(ScanFrequency);
	}
}

function EngageEnemy(enemy : GameObject) {
	// make sure the scanner doesn't run while we're engaging
	//EnemyInRange = enemy;
	
	// only shoot at enemy while he is within scan radius
	while ( enemy != null  && gameObject != null &&
		Vector3.Distance(enemy.transform.position, transform.position) < ScanRadius ) 
	{
		var prob : float = Random.Range(0,100.0);
		if ( prob <= unitAccuracy ) {
		//baseDamage can be altered as unit is promoted
		//Debug.LogError("Direct Hit! (" + prob + ")");
		enemy.GetComponent(unitLogic).SetDamage(baseDamage);
		} else {
		//logic.DidDodge();
		}
		
		yield WaitForSeconds(firingFrequency);
	}
	
	//Debug.LogError("EnemyOutOfRange!");
}

function SetDamage(damage : float) {
	this.baseHealth -= damage;
	transform.renderer.material = enemySightedMat;
	if ( this.baseHealth < 0.0 ) {
		// update global playerScore etc.
		GameObject.Find("Game").GetComponent(GameLogic).UnitDied(gameObject.name);
		Destroy(gameObject);
	}
}