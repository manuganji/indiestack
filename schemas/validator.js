"use strict";
exports.login = validate20;
var schema22 = {"$schema":"http://json-schema.org/draft-07/schema#","$id":"login","type":"object","properties":{"email":{"type":"string","format":"email"}}};
var formats0 = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;

function validate20(data, valCxt){
"use strict"; /*# sourceURL="login" */;
if(valCxt){
var instancePath = valCxt.instancePath;
var parentData = valCxt.parentData;
var parentDataProperty = valCxt.parentDataProperty;
var rootData = valCxt.rootData;
}
else {
var instancePath = "";
var parentData = undefined;
var parentDataProperty = undefined;
var rootData = data;
}
var vErrors = null;
var errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.email !== undefined){
var data0 = data.email;
var _errs1 = errors;
if(errors === _errs1){
if(errors === _errs1){
if(typeof data0 === "string"){
if(!(formats0.test(data0))){
validate20.errors = [{instancePath:instancePath+"/email",schemaPath:"#/properties/email/format",keyword:"format",params:{format: "email"},message:"must match format \""+"email"+"\""}];
return false;
}
}
else {
validate20.errors = [{instancePath:instancePath+"/email",schemaPath:"#/properties/email/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
}
}
else {
validate20.errors = [{instancePath:instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate20.errors = vErrors;
return errors === 0;
}

exports.signUp = validate21;
var schema23 = {"$schema":"http://json-schema.org/draft-07/schema#","$id":"signUp","type":"object","title":"Sign Up","description":"Sign up for an account","properties":{"firstName":{"type":"string","title":"First Name"},"lastName":{"type":"string","title":"Last Name"},"email":{"type":"string","format":"email","title":"Email Address","description":"This will be your primary means of contact and account recovery. Please ensure it is correct."},"tos":{"type":"boolean","title":"Terms of Service","description":"I agree to the Terms of Service","const":true}},"required":["firstName","lastName","email","tos"]};

function validate21(data, valCxt){
"use strict"; /*# sourceURL="signUp" */;
if(valCxt){
var instancePath = valCxt.instancePath;
var parentData = valCxt.parentData;
var parentDataProperty = valCxt.parentDataProperty;
var rootData = valCxt.rootData;
}
else {
var instancePath = "";
var parentData = undefined;
var parentDataProperty = undefined;
var rootData = data;
}
var vErrors = null;
var errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
var missing0;
if(((((data.firstName === undefined) && (missing0 = "firstName")) || ((data.lastName === undefined) && (missing0 = "lastName"))) || ((data.email === undefined) && (missing0 = "email"))) || ((data.tos === undefined) && (missing0 = "tos"))){
validate21.errors = [{instancePath:instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
if(data.firstName !== undefined){
var _errs1 = errors;
if(typeof data.firstName !== "string"){
validate21.errors = [{instancePath:instancePath+"/firstName",schemaPath:"#/properties/firstName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs1 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.lastName !== undefined){
var _errs3 = errors;
if(typeof data.lastName !== "string"){
validate21.errors = [{instancePath:instancePath+"/lastName",schemaPath:"#/properties/lastName/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid0 = _errs3 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.email !== undefined){
var data2 = data.email;
var _errs5 = errors;
if(errors === _errs5){
if(errors === _errs5){
if(typeof data2 === "string"){
if(!(formats0.test(data2))){
validate21.errors = [{instancePath:instancePath+"/email",schemaPath:"#/properties/email/format",keyword:"format",params:{format: "email"},message:"must match format \""+"email"+"\""}];
return false;
}
}
else {
validate21.errors = [{instancePath:instancePath+"/email",schemaPath:"#/properties/email/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs5 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.tos !== undefined){
var data3 = data.tos;
var _errs7 = errors;
if(typeof data3 !== "boolean"){
validate21.errors = [{instancePath:instancePath+"/tos",schemaPath:"#/properties/tos/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"}];
return false;
}
if(true !== data3){
validate21.errors = [{instancePath:instancePath+"/tos",schemaPath:"#/properties/tos/const",keyword:"const",params:{allowedValue: true},message:"must be equal to constant"}];
return false;
}
var valid0 = _errs7 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
else {
validate21.errors = [{instancePath:instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate21.errors = vErrors;
return errors === 0;
}
