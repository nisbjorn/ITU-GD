using UnityEngine;
using System.Collections;

public class DropZone : MonoBehaviour {

	float spawnTimer = 3.0f;
	public Transform Unit;
	//var Target : Transform;

	public void Start () {
		InvokeRepeating("SpawnUnits", 0.0f, spawnTimer);
	}
	
	private void SpawnUnits() {
		GameObject unit;
		if ( Unit.name == "Trooper" ) {
			if ( gameObject.GetComponent<Selectable>().PermissionToBoard() ) {
				Debug.LogError("SPAWNING!");
				//Debug.Log ("Scanning - Process took "+(lastScanTime*1000).ToString ("0")+" ms to complete ");
				 unit = (GameObject) Instantiate(Unit, 
					new Vector3(transform.position.x, transform.position.y, transform.position.z),
					transform.rotation);
				//gameObject.GetComponent(Selectable).unitEntered(unit.gameObject);
			}
		} else {
			unit = (GameObject) Instantiate(Unit, 
					new Vector3(transform.position.x, transform.position.y, transform.position.z),
					transform.rotation);
			//gameObject.GetComponent<Selectable>().unitEntered(unit2.transform);
		}
	}
	
}
