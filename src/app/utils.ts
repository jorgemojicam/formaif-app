export default class Utils {
    
    static formatNumber(num) {
        if (typeof (num) == "number") {
          return num
        } else {
          return parseInt(num == "0" || num == "" || num == null ? "0" : num.replace(/\D/g, '').replace(/^0+/, ''))
        }
      }
}

/*    
var number = Number(currency.replace(/[^0-9.-]+/g, ""));
*/