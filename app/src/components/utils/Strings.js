// ES6 module syntax
import LocalizedStrings from 'react-native-localization';

// CommonJS syntax
// let LocalizedStrings  = require ('react-native-localization');

export const strings = new LocalizedStrings({
 en:{
   username:"Username",
   password:"Password",
   table:"Table",
   chart:"Chart",
   units:"Units",
   days:"Days",
   language:"Language"
 },
 fr: {
   username:"Nom d'utilisateur",
   password:"Mot de passe",
   language:"langue"

 }

});
