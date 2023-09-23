"use strict";
export const validate = validate34;
export default validate34;
const schema33 = {"$schema":"http://json-schema.org/draft-07/schema#","$id":"signUp","type":"object","title":"Sign Up","description":"Sign up for an account","properties":{"firstName":{"type":"string","title":"First Name","errorMessage":"Please enter your first name."},"lastName":{"type":"string","title":"Last Name","errorMessage":"Please enter your last name."},"email":{"type":"string","format":"email","title":"Email Address","description":"This will be your primary means of contact and account recovery. Please ensure it is correct.","errorMessage":"Please enter a valid email address."},"tos":{"type":"boolean","title":"Terms of Service","description":"I agree to the Terms of Service","const":true,"errorMessage":"You must agree to the Terms of Service to continue."}},"required":["firstName","lastName","email","tos"],"errorMessage":{"required":{"firstName":"Please enter your first name.","lastName":"Please enter your last name.","email":"Please enter a valid email address.","tos":"You must agree to the Terms of Service to continue."}}};
const formats0 = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
const obj0 = {"required":"missingProperty","dependencies":"property","dependentRequired":"property"};

function validate34(data, {instancePath="", parentData, parentDataProperty, rootData=data}={}){
/*# sourceURL="signUp" */;
let vErrors = null;
let errors = 0;
if(data && typeof data == "object" && !Array.isArray(data)){
if(data.firstName === undefined){
const err0 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "firstName"},message:"must have required property '"+"firstName"+"'"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
if(data.lastName === undefined){
const err1 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "lastName"},message:"must have required property '"+"lastName"+"'"};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
if(data.email === undefined){
const err2 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "email"},message:"must have required property '"+"email"+"'"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
}
if(data.tos === undefined){
const err3 = {instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: "tos"},message:"must have required property '"+"tos"+"'"};
if(vErrors === null){
vErrors = [err3];
}
else {
vErrors.push(err3);
}
errors++;
}
if(data.firstName !== undefined){
if(typeof data.firstName !== "string"){
const err4 = {instancePath:instancePath+"/firstName",schemaPath:"#/properties/firstName/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err4];
}
else {
vErrors.push(err4);
}
errors++;
}
if(errors > 0){
const emErrs0 = [];
for(const err5 of vErrors){
if(((((err5.keyword !== "errorMessage") && (!err5.emUsed)) && ((err5.instancePath === instancePath+"/firstName") || ((err5.instancePath.indexOf(instancePath+"/firstName") === 0) && (err5.instancePath[instancePath+"/firstName".length] === "/")))) && (err5.schemaPath.indexOf("#/properties/firstName") === 0)) && (err5.schemaPath["#/properties/firstName".length] === "/")){
emErrs0.push(err5);
err5.emUsed = true;
}
}
if(emErrs0.length){
const err6 = {instancePath:instancePath+"/firstName",schemaPath:"#/properties/firstName/errorMessage",keyword:"errorMessage",params:{errors: emErrs0},message:"Please enter your first name."};
if(vErrors === null){
vErrors = [err6];
}
else {
vErrors.push(err6);
}
errors++;
}
const emErrs1 = [];
for(const err7 of vErrors){
if(!err7.emUsed){
emErrs1.push(err7);
}
}
vErrors = emErrs1;
errors = emErrs1.length;
}
}
if(data.lastName !== undefined){
if(typeof data.lastName !== "string"){
const err8 = {instancePath:instancePath+"/lastName",schemaPath:"#/properties/lastName/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err8];
}
else {
vErrors.push(err8);
}
errors++;
}
if(errors > 0){
const emErrs2 = [];
for(const err9 of vErrors){
if(((((err9.keyword !== "errorMessage") && (!err9.emUsed)) && ((err9.instancePath === instancePath+"/lastName") || ((err9.instancePath.indexOf(instancePath+"/lastName") === 0) && (err9.instancePath[instancePath+"/lastName".length] === "/")))) && (err9.schemaPath.indexOf("#/properties/lastName") === 0)) && (err9.schemaPath["#/properties/lastName".length] === "/")){
emErrs2.push(err9);
err9.emUsed = true;
}
}
if(emErrs2.length){
const err10 = {instancePath:instancePath+"/lastName",schemaPath:"#/properties/lastName/errorMessage",keyword:"errorMessage",params:{errors: emErrs2},message:"Please enter your last name."};
if(vErrors === null){
vErrors = [err10];
}
else {
vErrors.push(err10);
}
errors++;
}
const emErrs3 = [];
for(const err11 of vErrors){
if(!err11.emUsed){
emErrs3.push(err11);
}
}
vErrors = emErrs3;
errors = emErrs3.length;
}
}
if(data.email !== undefined){
let data2 = data.email;
if(typeof data2 === "string"){
if(!(formats0.test(data2))){
const err12 = {instancePath:instancePath+"/email",schemaPath:"#/properties/email/format",keyword:"format",params:{format: "email"},message:"must match format \""+"email"+"\""};
if(vErrors === null){
vErrors = [err12];
}
else {
vErrors.push(err12);
}
errors++;
}
}
else {
const err13 = {instancePath:instancePath+"/email",schemaPath:"#/properties/email/type",keyword:"type",params:{type: "string"},message:"must be string"};
if(vErrors === null){
vErrors = [err13];
}
else {
vErrors.push(err13);
}
errors++;
}
if(errors > 0){
const emErrs4 = [];
for(const err14 of vErrors){
if(((((err14.keyword !== "errorMessage") && (!err14.emUsed)) && ((err14.instancePath === instancePath+"/email") || ((err14.instancePath.indexOf(instancePath+"/email") === 0) && (err14.instancePath[instancePath+"/email".length] === "/")))) && (err14.schemaPath.indexOf("#/properties/email") === 0)) && (err14.schemaPath["#/properties/email".length] === "/")){
emErrs4.push(err14);
err14.emUsed = true;
}
}
if(emErrs4.length){
const err15 = {instancePath:instancePath+"/email",schemaPath:"#/properties/email/errorMessage",keyword:"errorMessage",params:{errors: emErrs4},message:"Please enter a valid email address."};
if(vErrors === null){
vErrors = [err15];
}
else {
vErrors.push(err15);
}
errors++;
}
const emErrs5 = [];
for(const err16 of vErrors){
if(!err16.emUsed){
emErrs5.push(err16);
}
}
vErrors = emErrs5;
errors = emErrs5.length;
}
}
if(data.tos !== undefined){
let data3 = data.tos;
if(typeof data3 !== "boolean"){
const err17 = {instancePath:instancePath+"/tos",schemaPath:"#/properties/tos/type",keyword:"type",params:{type: "boolean"},message:"must be boolean"};
if(vErrors === null){
vErrors = [err17];
}
else {
vErrors.push(err17);
}
errors++;
}
if(true !== data3){
const err18 = {instancePath:instancePath+"/tos",schemaPath:"#/properties/tos/const",keyword:"const",params:{allowedValue: true},message:"must be equal to constant"};
if(vErrors === null){
vErrors = [err18];
}
else {
vErrors.push(err18);
}
errors++;
}
if(errors > 0){
const emErrs6 = [];
for(const err19 of vErrors){
if(((((err19.keyword !== "errorMessage") && (!err19.emUsed)) && ((err19.instancePath === instancePath+"/tos") || ((err19.instancePath.indexOf(instancePath+"/tos") === 0) && (err19.instancePath[instancePath+"/tos".length] === "/")))) && (err19.schemaPath.indexOf("#/properties/tos") === 0)) && (err19.schemaPath["#/properties/tos".length] === "/")){
emErrs6.push(err19);
err19.emUsed = true;
}
}
if(emErrs6.length){
const err20 = {instancePath:instancePath+"/tos",schemaPath:"#/properties/tos/errorMessage",keyword:"errorMessage",params:{errors: emErrs6},message:"You must agree to the Terms of Service to continue."};
if(vErrors === null){
vErrors = [err20];
}
else {
vErrors.push(err20);
}
errors++;
}
const emErrs7 = [];
for(const err21 of vErrors){
if(!err21.emUsed){
emErrs7.push(err21);
}
}
vErrors = emErrs7;
errors = emErrs7.length;
}
}
}
else {
const err22 = {instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"};
if(vErrors === null){
vErrors = [err22];
}
else {
vErrors.push(err22);
}
errors++;
}
if(errors > 0){
const emErrors0 = {"required":{"firstName":[],"lastName":[],"email":[],"tos":[]}};
const templates0 = {required:{}};
let emPropParams0;
let emParamsErrors0;
for(const err23 of vErrors){
if((((((err23.keyword !== "errorMessage") && (!err23.emUsed)) && (err23.instancePath === instancePath)) && (err23.keyword in emErrors0)) && (err23.schemaPath.indexOf("#") === 0)) && (/^\/[^\/]*$/.test(err23.schemaPath.slice(1)))){
emPropParams0 = obj0[err23.keyword];
emParamsErrors0 = emErrors0[err23.keyword][err23.params[emPropParams0]];
if(emParamsErrors0){
emParamsErrors0.push(err23);
err23.emUsed = true;
}
}
}
for(const key0 in emErrors0){
for(const keyProp0 in emErrors0[key0]){
emParamsErrors0 = emErrors0[key0][keyProp0];
if(emParamsErrors0.length){
const tmpl0 = templates0[key0] && templates0[key0][keyProp0];
const err24 = {instancePath,schemaPath:"#/errorMessage",keyword:"errorMessage",params:{errors: emParamsErrors0},message:tmpl0 ? tmpl0() : schema33.errorMessage[key0][keyProp0]};
if(vErrors === null){
vErrors = [err24];
}
else {
vErrors.push(err24);
}
errors++;
}
}
}
const emErrs8 = [];
for(const err25 of vErrors){
if(!err25.emUsed){
emErrs8.push(err25);
}
}
vErrors = emErrs8;
errors = emErrs8.length;
}
validate34.errors = vErrors;
return errors === 0;
}
