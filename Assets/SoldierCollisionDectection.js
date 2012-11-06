function OnTriggerEnter(collider:Collider) {
	if (collider.gameObject.name=="Endzone") {
		Destroy(gameObject);
	}
}