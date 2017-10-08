/*
Tests are trying to resolve issues mentioned in these two tickets:
https://core.trac.wordpress.org/ticket/10955
https://core.trac.wordpress.org/ticket/27473
*/

var inputQueries = [

	'post=174&action=edit&width=900&height=500&inlineId=someElId',					       // 0
	'ajax.php?post=174&action=edit&width=900&height=500&inlineId=someElId',			   // 1
	'post=174&action=edit#TB_inline?width=900&height=500&inlineId=someElId',		   // 2
	'/?TB_inline&width=800&height=640&inlineId=someId',								             // 3
	'?TB_iframe=true&width=450&height=120',											                   // 4
	'?post=174&action=edit#TB_inline?width=840&height=640&inlineId=my-thickbox',	 // 5
	'?post=174&action=edit#TB_inline&width=840&height=640&inlineId=my-thickbox',	 // 6
	'?post=174&action=edit#TB_inline=true&width=840&height=640&inlineId=my-thickbox',// 7
  '?post=174&action=edit#TB_inline?&inlineId=my-thickbox&height=640&width=840'   // 8

];

var outputParameters = {
	post     : "174",
	action   : "edit",
	width    : "900",
	height   : "500",
	inlineId : "someElId"
};

var outputParameters3 = {

	width    : "800",
	height   : "640",
	inlineId : "someId"	

}

var outputParameters4 = {

	width     : "450",
	height    : "120",
	TB_iframe : "true"

}

var outputParameters5 = {

	post     : "174",
	action   : "edit",
	width    : "840",
	height   : "640",
	inlineId : "my-thickbox"

}

var outputParameters6 = {

  post     : "174",
  action   : "edit",
  width    : "840",
  height   : "640",
  inlineId : "my-thickbox"

}

var outputParameters7 = {

  post      : "174",
  action    : "edit",
  width     : "840",
  height    : "640",
  inlineId  : "my-thickbox"

}

var outputParameters8 = {

  post      : "174",
  action    : "edit",
  width     : "840",
  height    : "640",
  inlineId  : "my-thickbox"

}

// Copied from thickbox_v2.js file
function tb_parseQuery( query ){

  query = query
    .split( "?" )
    .filter(function(u){ return ~u.indexOf('='); })
    .join('')
    .split(/#?TB_inline(?:=true)?&?/)
    .filter(function(u){ return Boolean(u); })
    .join("&"); 

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

  describe("Query #0: " + inputQueries[0], function() {

    it("should be properly converted to parameter objects", function() {

		expect(tb_parseQuery(inputQueries[0])).to.deep.equal(outputParameters);

    });

  });

  describe("Query #1: " + inputQueries[1], function() {

    it("should be properly converted to parameter objects", function() {

		expect(tb_parseQuery(inputQueries[1])).to.deep.equal(outputParameters);

    });

  });

  describe("Query #2: " + inputQueries[2], function() {

    it("should be properly converted to parameter objects", function() {

		expect(tb_parseQuery(inputQueries[2])).to.deep.equal(outputParameters);

    });

  });

  describe("Query #3: " + inputQueries[3], function() {

    it("should be properly converted to parameter objects", function() {

		expect(tb_parseQuery(inputQueries[3])).to.deep.equal(outputParameters3);

    });

  });

  describe("Query #4: " + inputQueries[4], function() {

    it("should be properly converted to parameter objects", function() {

    expect(tb_parseQuery(inputQueries[4])).to.deep.equal(outputParameters4);

    });

  });

  describe("Query #5: " + inputQueries[5], function() {

    it("should be properly converted to parameter objects", function() {

    expect(tb_parseQuery(inputQueries[5])).to.deep.equal(outputParameters5);

    });

  });

  describe("Query #6: " + inputQueries[6], function() {

    it("should be properly converted to parameter objects", function() {

      expect(tb_parseQuery(inputQueries[6])).to.deep.equal(outputParameters6);

    });

  });

  describe("Query #7: " + inputQueries[7], function() {

    it("should be properly converted to parameter objects", function() {

      expect(tb_parseQuery(inputQueries[7])).to.deep.equal(outputParameters7);

    });

  });

  describe("Query #8: " + inputQueries[8], function() {

    it("should be properly converted to parameter objects", function() {

		  expect(tb_parseQuery(inputQueries[8])).to.deep.equal(outputParameters8);

    });

  });

});