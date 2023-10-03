import addAdminValidator from "./addAdminValidator";
import loginValidator from "./loginValidator";
import propertyValidator from "./propertyValidator";
import propertySettingsValidator from "./propertySettingsValidator";
import reconfirmEmailValidator from "./reconfirmEmailValidator";
import signUpValidator from "./signUpValidator";
import type { DataValidateFunction } from "ajv/dist/types";
addAdminValidator as DataValidateFunction;
loginValidator as DataValidateFunction;
propertyValidator as DataValidateFunction;
propertySettingsValidator as DataValidateFunction;
reconfirmEmailValidator as DataValidateFunction;
signUpValidator as DataValidateFunction;


export {
	addAdminValidator,
	loginValidator,
	propertyValidator,
	propertySettingsValidator,
	reconfirmEmailValidator,
	signUpValidator,
};