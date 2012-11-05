#pragma strict

function OnGUI() {
    var pos = transform.position;
	pos.y += 2;
	pos = Camera.main.WorldToScreenPoint(pos); 
	var rect = new Rect(pos.x - 10, Screen.height - pos.y - 15, 100, 22);
    GUI.Label(rect, this.GetComponent(unitLogic).baseHealth.ToString());
}