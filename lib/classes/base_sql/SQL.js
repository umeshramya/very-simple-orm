"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Sql {
    constructor(_tablename) {
        this._tableName = _tablename;
    }
    get sqlAndValues() {
        return this._sqlAndValues;
    }
    set sqlAndValues(value) {
        this._sqlAndValues = value;
    }
    clauseMaker(_fields) {
        let __fieldList = "";
        let __values = [];
        _fields.forEach((field, index) => {
            if (index < _fields.length - 1) {
                if (field.separator === "NONE") {
                    throw new Error().message = "NONE operator is aloowed only at the last";
                }
                __fieldList = `${__fieldList} ${this._tableName}.${field.fieldName} ${field.operator} ? ${field.separator} `;
            }
            else {
                __fieldList = `${__fieldList} ${this._tableName}.${field.fieldName} ${field.operator} ? `;
            }
            __values.push(field.value);
        });
        let ret = { "sql": __fieldList, "values": __values };
        return ret;
    }
}
exports.default = Sql;
//# sourceMappingURL=SQL.js.map