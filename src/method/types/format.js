d3plus.method.format = {
  "accepted": [ Function , String ],
  "deprecates": [ "number_format" , "text_format" ],
  "locale": {
    "accepted" : function(){
      return d3.keys(d3plus.locale)
    },
    "process"  : function( value ) {

      var defaultLocale = "en_US"
        , returnObject  = d3plus.locale[defaultLocale]

      if ( value !== defaultLocale ) {
        returnObject = d3plus.util.merge( returnObject , d3plus.locale[value] )
      }

      return returnObject

    },
    "value"    : "en_US"
  },
  "number": function( number , key , vars ) {

    var time = vars ? [ vars.time.value ] : [ "year" , "date" ]

    if (key && time.indexOf(key.toLowerCase()) >= 0) {
      return number
    }
    else if (number < 10 && number > -10) {
      return d3.round(number,2)
    }
    else if (number.toString().split(".")[0].length > 4) {
      var symbol = d3.formatPrefix(number).symbol
      symbol = symbol.replace("G", "B") // d3 uses G for giga

      // Format number to precision level using proper scale
      number = d3.formatPrefix(number).scale(number)
      number = parseFloat(d3.format(".3g")(number))
      return number + symbol;
    }
    else if (key == "share") {
      return d3.format(".2f")(number)
    }
    else {
      return d3.format(",f")(number)
    }

  },
  "process": function( value ) {

    if ( typeof value === "string" ) {
      var vars = this.getVars()
      vars.self.format({"locale": "en_US"})
    }
    else if ( typeof value === "function" ) {
      return value
    }

    return this.value

  },
  "text": function( text , key , vars ) {

    if (!text) {
      return ""
    }

    var smalls = [ "a"
                 , "and"
                 , "of"
                 , "to" ]

    return text.replace(/\w\S*/g, function(txt,i){

      if (smalls.indexOf(txt) >= 0 && i != 0) {
        return txt
      }

      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()

    })

  },
  "value": function( value , key , vars ) {

    var vars = typeof this.getVars() == "function" ? this.getVars() : undefined

    if ( typeof value === "number" ) {
      return this.number( value , key , vars )
    }
    if ( typeof value === "string" ) {
      return this.text( value , key , vars )
    }
    else {
      return JSON.stringify(value)
    }

  }
}
