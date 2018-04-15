class Character{
	constructor(data){
		
	}
	
	static create(data) {
    switch(data['_T']) {
      default:
        return new Character(data);
    }
  }
}