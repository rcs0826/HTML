// ***************************************
// *** MPD - Utils
// ***************************************

// Eventos
var MpdEvent = {
	
}

// Servicos
var MpdDBORestService = '/datasul-rest/resources/dbo/ems_';

var MpdURL = {
	messageService 			:	MpdDBORestService + 'message/',
}

Array.prototype.move = function ($from, $to) {

	while ($from < 0) {
		$from += this.length;
	}

	while ($to < 0) {
		$to += this.length;
	}

	if ($to >= this.length) {
		var k = $to - this.length;
		while ((k--) + 1) {
			this.push(undefined);
		}
	}

	this.splice($to, 0, this.splice($from, 1)[0]);	

};