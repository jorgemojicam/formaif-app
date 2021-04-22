export default class Utils {
    
    static formatNumber(num) {
        if (typeof (num) == "number") {
          return num
        } else {
          return parseInt(num == "0" || num == "" || num == null ? "0" : num.replace(/\D/g, '').replace(/^0+/, ''))
        }
      }

      static changeMonth(numMonth:number){
        let month= ["N/A","ENE","FEB","MAR","ABR","MAY","JUN","JUL","AGO","SEP","OCT","NOV","DIC"]
        return month[numMonth]
      }

      static formatFloat(num) {
  
        if (typeof (num) == "number") {
          return num
        } else {
          return parseFloat(num == "0" || num == "" || num == null ? "0" : num)
        }
      }
}

/*    
var number = Number(currency.replace(/[^0-9.-]+/g, ""));
*/


