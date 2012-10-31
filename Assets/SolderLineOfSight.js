#pragma strict
var observeTimer : float = 0.1;
var ScanRadius : float = 3;
var enemySightedMat : Material;

function Start () {
	
}

function Update () {
	if	( observeTimer > 0 ) {
		observeTimer -= Time.deltaTime;
		return;
 	}
 	observeTimer = 0.1;
  	Debug.Log("scanning!");
  	ScanForEnemies(transform.position, ScanRadius);
}

function ScanForEnemies(location : Vector3, radius : float )
{
    var objectsInRange : Collider[] = Physics.OverlapSphere(location, radius);
    for (var col : Collider in objectsInRange)
    {
        if ( col.gameObject.tag == "Bug" ) {
        	Debug.LogError("Attacking!!");
			col.renderer.material = enemySightedMat;
			//Destroy(col.gameObject);
        }
        
        // alternative way of doing it!
        /*var enemy : EnemyID = col.GetComponent(EnemyID); // script has been added to component
        if (enemy != null)
        {
			
        }
        print("no enemies!");*/
        
        // well bugger me good!
    }
}