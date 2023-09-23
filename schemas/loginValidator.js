"use strict";
export const validate = validate33;
export default validate33;
const schema32 = {"$schema":"http://json-schema.org/draft-07/schema#","$id":"login","type":"object","properties":{"email":{"type":"string","format":"email","errorMessage":"Invalid email"}},"required":["email"]};
const formats0 = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;

function validate33(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
/*# sourceURL="login" */;
let vErrors = null;
let errors = 0;
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.email === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "email"},message:"must have required property '"+"email"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.email !== undefined){
let data0 = data.email;
if(typeof data0 === "string"){
if(!(formats0.test(data0))){
const err1 = {instancePath:instancePath+"/email",schemaPath:"#/properties/email/format",keyword:"format",params:{format: "email"},message:"must match format \""+"email"+"\""};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
else {
const err2 = {instancePath:instancePath+"/email",schemaPath:"#/properties/email/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(errors > 0){
const emErrs0 = [];
for(const err3 of vErrors){
if(((((err3.keyword !== "errorMessage") && (!err3.emUsed)) && ((err3.instancePath === instancePath+"/email") || ((err3.instancePath.indexOf(instancePath+"/email") === 0) && (err3.instancePath[instancePath+"/email".length] === "/")))) && (err3.schemaPath.indexOf("#/properties/email") === 0)) && (err3.schemaPath["#/properties/email".length] === "/")){
emErrs0.push(err3);
err3.emUsed = true;
}
}
if(emErrs0.length){
const err4 = {instancePath:instancePath+"/email",schemaPath:"#/properties/email/errorMessage",keyword:"errorMessage",params:{errors: emErrs0},message:"Invalid email"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
const emErrs1 = [];
for(const err5 of vErrors){
if(!err5.emUsed){
emErrs1.push(err5);
}
}
vErrors = emErrs1;
errors = emErrs1.length;
}
}
}
else {
const err6 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
validate33.errors = vErrors;
return errors === 0;
}
