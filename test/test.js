var inputQueries = [
	'post=174&action=edit&width=900&height=500&inlineId=someElId',
	'ajax.php?post=174&action=edit&width=900&height=500&inlineId=someElId',
	'post=174&action=edit#TB_inline?width=900&height=500&inlineId=someElId'
];

var outputParameters = {
	post     : "174",
	action   : "edit",
	width    : "900",
	height   : "500",
	inlineId : "someElId"
};

function _tb_parseQuery_deprecated ( query ) {
   var Params = {};
   if ( ! query ) {return Params;}// return empty object
   var Pairs = query.split(/[;&]/);
   for ( var i = 0; i < Pairs.length; i++ ) {
      var KeyVal = Pairs[i].split('=');
      if ( ! KeyVal || KeyVal.length != 2 ) {continue;}
      var key = unescape( KeyVal[0] );
      var val = unescape( KeyVal[1] );
      val = val.replace(/\+/g, ' ');
      Params[key] = val;
   }
   return Params;
}

function tb_parseQuery( query ){

	query = query.split( "?" );
	query = query.filter(function(u){ return ~u.indexOf('='); });
	query = query.map(function(u){ return u.replace( "#TB_inline", "" ); }).join('&');  
	var Params = query.split("&").reduce(function(acc,prev){
		var keyValue = prev.split("="); 
		var key = unescape(keyValue[0]);
		var value = unescape(keyValue[1]).replace(/\+/g, ' ');
		acc[key] = value;
		return acc;
	},{});
	return Params;
}

var expect = chai.expect;

describe("ThickBox v2", function() {

  describe("Query: " + inputQueries[0], function() {

    it("should be properly converted to parameter objects", function() {

		expect(tb_parseQuery(inputQueries[0])).to.deep.equal(outputParameters);

    });

  });

  describe("Query: " + inputQueries[1], function() {

    it("should be properly converted to parameter objects", function() {

		expect(tb_parseQuery(inputQueries[1])).to.deep.equal(outputParameters);

    });

  });

  describe("Query: " + inputQueries[2], function() {

    it("should be properly converted to parameter objects", function() {

		expect(tb_parseQuery(inputQueries[2])).to.deep.equal(outputParameters);

    });

  });

});