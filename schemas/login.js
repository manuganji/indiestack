"use strict";
export const validate = validate34;
export default validate34;
const schema33 = {"$schema":"http://json-schema.org/draft-07/schema#","$id":"login","type":"object","properties":{"email":{"type":"string","format":"email","errorMessage":"Invalid email"}}};
const formats0 = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;

function validate34(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
/*# sourceURL="login" */;
let vErrors = null;
let errors = 0;
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.email !== undefined){
let data0 = data.email;
if(typeof data0 === "string"){
if(!(formats0.test(data0))){
const err0 = {instancePath:instancePath+"/email",schemaPath:"#/properties/email/format",keyword:"format",params:{format: "email"},message:"must match format \""+"email"+"\""};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
}
else {
const err1 = {instancePath:instancePath+"/email",schemaPath:"#/properties/email/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(errors > 0){
const emErrs0 = [];
for(const err2 of vErrors){
if(((((err2.keyword !== "errorMessage") && (!err2.emUsed)) && ((err2.instancePath === instancePath+"/email") || ((err2.instancePath.indexOf(instancePath+"/email") === 0) && (err2.instancePath[instancePath+"/email".length] === "/")))) && (err2.schemaPath.indexOf("#/properties/email") === 0)) && (err2.schemaPath["#/properties/email".length] === "/")){
emErrs0.push(err2);
err2.emUsed = true;
}
}
if(emErrs0.length){
const err3 = {instancePath:instancePath+"/email",schemaPath:"#/properties/email/errorMessage",keyword:"errorMessage",params:{errors: emErrs0},message:"Invalid email"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
const emErrs1 = [];
for(const err4 of vErrors){
if(!err4.emUsed){
emErrs1.push(err4);
}
}
vErrors = emErrs1;
errors = emErrs1.length;
}
}
}
else {
const err5 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err5];
}
else {
vErrors.push(err5);
}
errors++;
}
validate34.errors = vErrors;
return errors === 0;
}
