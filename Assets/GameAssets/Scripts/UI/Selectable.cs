using UnityEngine;
using System.Collections;

public class Selectable : MonoBehaviour {
	private Renderer renderer;
	
	void Start() {
	}
	
	public void Select(Material m) {
		transform.Find("Selector").GetComponent<MeshRenderer>().material = m;
		transform.Find("Selector").GetComponent<MeshRenderer>().enabled = true;
		// transform.GetComponent<Route>().ShowMesh();
	}
	
	public void UnSelect() {
		transform.Find("Selector").GetComponent<MeshRenderer>().enabled = false;
		// transform.GetComponent<Route>().HideMesh();
	}
}
