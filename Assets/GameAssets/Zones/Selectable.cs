using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class Selectable : MonoBehaviour {
	//public Renderer renderer;
	
	void Start() {
		InvokeRepeating("releaseTheTroops",1.0f,1.0f);
	}
//	public selectedMaterial : Material;
//	var targetMaterial : Material;

	public int Capacity = 10;
	public int TrooperCapacity = 10;

	public int CurrentTrooperCount = 0;
	public int CurrentBugCount = 0;

	public Transform TrooperTarget = null;
	private Queue<Transform> TrooperUnits = new Queue<Transform>();

	public Transform BugTarget = null;
	private Queue<Transform> BugUnits = new Queue<Transform>();

	// set to true if the node is selected by a user
	public bool isSelected = false;

	// node is blocked
	public bool isBlocked = false;

	// for displaying the target-node-number relative to selected node
	//	var isTarget : boolean = false;
	//	var targetNumber : int = -1;
	
	//defaultMaterial = renderer.material;
	
	/*
	*****************************************************
	** MOUSE CONTROLS
	*****************************************************
	*/
	//function OnMouseOver() {
	//    if (Input.GetMouseButtonDown(1)) {
	//    	if (this.isSelected) {
	//    		if ( this.isBlocked ) {
	//    			Debug.LogError("now unblocked!!");
	//    			this.isBlocked = false;	
	//    		} else {
	//    			Debug.LogError("now blocked!");
	//    			this.isBlocked = true;
	//    		}
	//    	}
	//    	//Debug.LogError("Right Click!");
	//    	if ( Input.GetKey( KeyCode.LeftShift ) ) {
	//    		Debug.LogError("Setting Bug Target!");	
	//			GameObject.Find("Game").GetComponent(GameLogic).SetTargetBug(gameObject);
	//			//Select();
	//		} else {
	//			Debug.LogError("Setting Trooper Target!");	
	//			GameObject.Find("Game").GetComponent(GameLogic).SetTargetTrooper(gameObject);
	//			//Select();
	//		}
	//    }
	//}
	
	//function OnMouseDown () {
	//	if (Input.GetMouseButton(0)) {
	//		//Debug.LogError("Left Click!");
	//		GameObject.Find("Game").GetComponent(GameLogic).SetSelection(gameObject);
	//		Select();
	//	}
	//}
	
	//function Select() {
	//	isSelected = true;
	//	transform.Find("SelectPlate").GetComponent(MeshRenderer).enabled = true;
	//	//transform.Find("TargetPlate").GetComponent(MeshRenderer).enabled = false;
	//	// if node has a target, show that target!
	//	if (this.TrooperTarget != null) {
	//		//TrooperTarget.GetComponent(Selection).DeSelect();
	//		TrooperTarget.GetComponent(Selection).TargetRenderOn(1);
	//	}
	//	//renderer.material = selectedMaterial;
	//	//selected = true;
	//}
	
	// 1) remove SelectPlate
	// 2) remove TargetPlate
	//function DeSelect() {
	//	isSelected = false;
	//	// disable selectPlate
	//	//transform.Find("SelectPlate").GetComponent(MeshRenderer).enabled = false;
	//	//transform.Find("TargetPlate").GetComponent(MeshRenderer).enabled = false;
	//	if (this.TrooperTarget != null) {
	//		//TrooperTarget.GetComponent(Selection).DeSelect();
	//		TrooperTarget.GetComponent(Selection).TargetRenderOff();
	//	}
	//	//TrooperTarget.GetComponent().RenderAsTarget();
	//	//renderer.material = defaultMaterial;
	//	//selected = false;
	//}

/*
*****************************************************
** FLOW CONTROL
*****************************************************
*/
	public void Select(Material m) {
		transform.Find("Selector").GetComponent<MeshRenderer>().material = m;
		transform.Find("Selector").GetComponent<MeshRenderer>().enabled = true;
		// transform.GetComponent<Route>().ShowMesh();
		isSelected = true;
		//transform.Find("SelectPlate").GetComponent(MeshRenderer).enabled = true;
		//transform.Find("TargetPlate").GetComponent(MeshRenderer).enabled = false;
		// if node has a target, show that target!
		//if (this.TrooperTarget != null) {
			//TrooperTarget.GetComponent(Selection).DeSelect();
			//TrooperTarget.GetComponent(Selection).TargetRenderOn(1);
		//}
		//renderer.material = selectedMaterial;
		//selected = true;
	}
	
	public void UnSelect() {
		transform.Find("Selector").GetComponent<MeshRenderer>().enabled = false;
		// transform.GetComponent<Route>().HideMesh();
		isSelected = false;
	}
	
	public void SetTargetTrooper(Transform from, Transform to) {
		transform.GetComponent<Seeker>().StartPath(from.position,to.position);
		transform.GetComponent<Route>().target = to;
		// Disable old targetRender
	//	if (this.TrooperTarget != null) {
	//		TrooperTarget.GetComponent<Selectable>().TargetRenderOff();
	//	}
		this.TrooperTarget = to;
	//	this.TrooperTarget.GetComponent<Selectable>().TargetRenderOn(1);
		
		// release the hounds!
		releaseTheTroops();
	}
	
	// CurrentTrooperCount is increased thorugh PermissionToBoard()
	public void EnqeueUnit( Transform unit ) {
		this.TrooperUnits.Enqueue(unit);
		unit.GetComponent<Route>().target = null;
		//this.CurrentTrooperCount += 1;
	}
	
	public void DeployUnitFromQueue() {
		// 2) pop unit from list
		Transform unit = TrooperUnits.Dequeue();
		// 3) reduce currentTrooperCount
		this.CurrentTrooperCount -= 1;
		// 4)	update target to new node
		unit.GetComponent<Route>().target = this.TrooperTarget;
	}
	
	public void DeployUnit(Transform unit) {
		// 3) reduce currentTrooperCount
		this.CurrentTrooperCount -= 1;
		// 4)	update target to new node
		unit.GetComponent<Route>().target = this.TrooperTarget;
	}
	
	private void releaseTheTroops() {	
		// only release units if the node has been unblocked
		if ( this.isBlocked || this.TrooperTarget == null) return;
		
		while (TrooperUnits.Count > 0 ) {
			//Debug.LogError("TrooperUnits length: " + this.TrooperUnits.length);
			// 1) reserve space on the node
			if ( this.TrooperTarget.GetComponent<Selectable>().PermissionToBoard() ) {
				DeployUnitFromQueue();
			}
			return;		
		}
	}
	
	// handles: enemies entering the node
	// - either passing through or spawning into
	public void OnTriggerEnter( Collider collider ) {
		// simple wrapper
		//Debug.LogError("Collission!");
		unitEntered(collider.transform);
	}
	
	// called by dropzone.js when a unit is spawned
	// and when a node's collision is triggered
	public void unitEntered(Transform unit) {
		// if unit is freshly spawned or has this node as a target (meaning it's not passing through)
		if ( unit.GetComponent<Route>().target == null || unit.GetComponent<Route>().target == transform ) {
			// trooper logic
			if (unit.tag == "Trooper") {
				if ( this.TrooperTarget != null && !this.isBlocked ) {
					if ( TrooperTarget.GetComponent<Selectable>().PermissionToBoard() ) {
						DeployUnit(unit);
						return;
					}
				}
				
				//unit.GetComponent( Route ).target = transform;
				//this.CurrentTrooperCount += 1;
				this.EnqeueUnit(unit);
			// bug logic
			} else {
				if ( this.BugTarget == null ) {
					this.BugUnits.Enqueue(unit);
					return;
				}
				unit.GetComponent<Route>().target = this.BugTarget;
			}
		}
	}
	
	/*****************************
	 ** AI 
	 ******************************/
	
	// set bug target
	public void SetTargetBug(Transform target) {
		BugTarget = target;
		// there is a race-condition here..
		// - just in case a number of units are added to the array as we set the target..
		//BugTarget.GetComponent(Selection).TargetRenderOn();
		while (BugUnits.Count > 0 ) {
			Transform unit = BugUnits.Dequeue();
			this.CurrentBugCount--;
			unit.transform.GetComponent<Route>().target = this.BugTarget;
		}
	}
	
	/*
	*****************************************************
	** UNIT HELPER FUNCTIONS
	*****************************************************
	*/
	
	// returns 'true' if node is below capacity
	public bool AtMaxCapacity() {
		if ( this.TrooperCapacity - this.CurrentTrooperCount <= 0 ) {
			return true;
		} else {
			return false;
		}
	}
	
	// called by units with the node as their target as they die
	public void ApproachingOrArrivedTrooperDied() {
		
		this.CurrentTrooperCount -= 1;
		//Debug.LogError("Reducing troopercount: " + this.CurrentTrooperCount);
	}
	
	// if the node has capacity, reserve a space (increase troopercount) and return 'true'
	// - oelse return 'false'
	public bool PermissionToBoard() {
		if ( this.TrooperCapacity - this.CurrentTrooperCount <= 0 ) 
			return false;
		
		this.CurrentTrooperCount += 1;
		return true;
	}
	
	/*
	*****************************************************
	** HEADS UP DISPLAY
	*****************************************************
	*/
	
	// handles marking nodes as targets or "next nodes" from a given node
	// - nodes with a targetNode != null are sequentially called to mark and label the redirect path
	//public void TargetRenderOn(int val) {
	//	if (isTarget == true || isSelected == true) return;
	//	isTarget = true;
	//	targetNumber = val;
	//	transform.Find("TargetPlate").GetComponent(MeshRenderer).enabled = true;
	//	if ( TrooperTarget == null ) return;
	//	val = val + 1;
	//	TrooperTarget.GetComponent(Selection).TargetRenderOn(val);
	//}
	
	//public void TargetRenderOff() {
	//	if (isTarget == false) return;
	//	isTarget = false;
	//	targetNumber = -1;
	//	transform.Find("TargetPlate").GetComponent(MeshRenderer).enabled = false;
	//	if ( TrooperTarget == null ) return;
	//	TrooperTarget.GetComponent(Selection).TargetRenderOff();
	//}
	
	//public void OnGUI() {
	//	if ( !isTarget ) return;
	//    var pos = transform.position;
	//	pos.y += 15;
	//	pos = Camera.main.WorldToScreenPoint(pos); 
	//	var rect = new Rect(pos.x - 10, Screen.height - pos.y - 15, 100, 22);
	//	GUI.color = Color.black;
	//    GUI.Label(rect, targetNumber.ToString() );
	//}
	//	
}

