function OnMouseDown () {
	if (Input.GetMouseButton(0)) {
		Debug.LogError("PLANE: DESELECT!");
		GameObject.Find("Game").GetComponent(GameLogic).DeSelect();
	}
}