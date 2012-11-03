#pragma strict
var observeTimer : float = 0.1;
var enemySightedMat : Material;

var EnemyInRange : GameObject;

// raceSpecifics


// unitStats
var ScanRadius : float = 3;
var unitAccuracy : float = 0.5;
var baseHealth : float = 10;
var baseDamage : float = 2;
var enemyTag : String;

function Start () {
	if (gameObject.tag == "Trooper") {
		enemyTag = "Bug";
	} else {
		enemyTag = "Trooper";
	}
	InvokeRepeating("ScanForEnemies", 1, 1);
}

function Update() {
	//ScanForEnemies();
}

function ScanForEnemies() {
	// return if we're already shooting at an enemy
	if ( EnemyInRange != null ) {
		return;
	}

    var objectsInRange : Collider[] = Physics.OverlapSphere(transform.position, ScanRadius);
    
    // identify closest enemy and shoot!
    var maxDistance : int = 1000;
    var closestEnemy : GameObject;
    for (var col : Collider in objectsInRange)
    {
    	// only check items that respoond to tag "Bug"
        if ( col.gameObject.tag == enemyTag ) {
        	
        	var distance = Vector3.Distance( col.transform.position, transform.position);
        	if ( distance < maxDistance ) {
        		closestEnemy = col.gameObject;
        		maxDistance = distance;
        	}
        }
    }
    
    if ( closestEnemy == null ) { return; }
    
    Debug.LogError("Engaging enemy!");
    EngageEnemy(closestEnemy);
}

function EngageEnemy(enemy : GameObject) {
	// make sure the scanner doesn't run while we're engaging
	EnemyInRange = enemy;
	
	// only shoot at enemy while he is within scan radius
	while ( Vector3.Distance(enemy.transform.position, transform.position) < ScanRadius ) {
		//var prob : float = Random.Range(0,100.0);
		//if ( prob <= unitAccuracy ) {
		// baseDamage can be altered as unit is promoted
		//Debug.LogError("Direct Hit! (" + prob + ")");
		//logic.SetDamage(baseDamage);
		//} else {
		//logic.DidDodge();
		//}
		enemy.GetComponent(unitLogic).SetDamage(baseDamage);
		yield WaitForSeconds(1);
	}
	EnemyInRange = null;
	Debug.LogError("EnemyOutOfRange!");
	
	//var logic = enemy.GetComponent(unitLogic);
	// everything below the UnitAccuracy ==> target hits!
	
}

function SetDamage(damage : float) {
	this.baseHealth -= damage;
	transform.renderer.material = enemySightedMat;
	if ( this.baseHealth < 0.0 ) {
		// update global playerScore etc.
		Destroy(gameObject);
	}
}