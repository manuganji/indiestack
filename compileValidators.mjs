import Ajv from "ajv";
import standaloneCode from "ajv/dist/standalone/index.js";
import * as fs from "fs";
import addFormats from "ajv-formats";
import addKeywords from "ajv-keywords";
import addErrors from "ajv-errors";
import { sync } from "glob";
import { resolve } from "path";

const ajv = new Ajv({
	allErrors: true,
	code: {
		lines: true,
		esm: true,
		source: true,
	},
});

addFormats(ajv);
addKeywords(ajv);
addErrors(ajv, {
	keepErrors: false,
	singleError: true,
});

const getFiles = () => sync("schemas/*.json", { cwd: process.cwd() });

const openFile = (filename) => {
	const file = resolve(process.cwd(), filename);
	return JSON.parse(fs.readFileSync(file).toString());
};

function saveStandaloneCode(refsOrFunc, outputFile) {
	try {
		const moduleCode = standaloneCode(ajv, refsOrFunc);
		try {
			if (!outputFile) console.log(moduleCode);
			else fs.writeFileSync(outputFile, moduleCode);
			return true;
		} catch (e) {
			console.error("error saving file:", e);
			return false;
		}
	} catch (e) {
		console.error("error preparing module:", e);
		return false;
	}
}

function compileSchema(file) {
	const sch = openFile(file, `schema ${file}`);
	try {
		const id = sch?.$id;
		ajv.addSchema(sch, id ? undefined : file);
		const validate = ajv.getSchema(id || file);
		console.error(`schema ${file} is valid`);
		return validate;
	} catch (err) {
		console.error(`schema ${file} is invalid`);
		console.error(`error: ${err.message}`);
		return undefined;
	}
}

function compileSchemaAndSave(file) {
	const validate = compileSchema(file);
	if (validate) {
		saveStandaloneCode(validate, file.replace(/\.json$/, ".js"));
		return true;
	}
	return false;
}

export const execute = () => {
	const schemaFiles = getFiles();
	schemaFiles.map(compileSchemaAndSave).every((x) => x);
};

execute();
