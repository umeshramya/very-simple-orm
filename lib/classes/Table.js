"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const runtime_1 = require("../Iinterfaces/runtime");
const Delete_1 = __importDefault(require("./base_sql/Delete"));
const Insert_1 = __importDefault(require("./base_sql/Insert"));
const Select_1 = __importDefault(require("./base_sql/Select"));
const Update_1 = __importDefault(require("./base_sql/Update"));
class Table {
    constructor(_name, _fields) {
        this.tableName = _name;
        this.fields = _fields;
        this.selectCls = new Select_1.default(this.tableName);
        this.updateCls = new Update_1.default(this.tableName);
        this.insertCls = new Insert_1.default(this.tableName);
        this.deleteCls = new Delete_1.default(this.tableName);
    }
    /**
     *
     * @param _insertFields
     * @returns
     */
    insert(_insertFields) {
        // write code for valdation of fileds here 
        this.validateHandler(_insertFields);
        return this.insertCls.insert(_insertFields);
    }
    /**
     *
     * @param _insertFields two dimensional array filed and values
     * return sql string and two dimensiona array
     */
    insertMany(_insertFields) {
        _insertFields.forEach(el => {
            this.validateHandler(el);
        });
        return this.insertCls.insertMany(_insertFields);
    }
    /**
     *
     * @param _field
     * @returns
     */
    deleteById(_field) {
        return this.deleteCls.deleteById(_field);
    }
    /**
     *
     * @param _clauseField where clase uarguments
     * @returns SQL and values
     */
    delete(_clauseField) {
        return this.deleteCls.delete(_clauseField);
    }
    /**
     *
     * @param _idField id field
     * @param _selectedFields The field o fthe table to reurned
     * @param _orderBy by filed either ASC | DESC
     * @param _limit number of rows limited
     * @param _offset number of rows to be offset
     * @returns sql string and values array of the clause
     */
    selectById(_idField, _selectedFields, _orderBy, _limit, _offset) {
        // write validation code here
        return this.selectCls.selectById(_idField, _selectedFields, {
            "fields": (_orderBy === null || _orderBy === void 0 ? void 0 : _orderBy.fields) ? _orderBy.fields : [],
            "by": (_orderBy === null || _orderBy === void 0 ? void 0 : _orderBy.by) ? _orderBy.by : "ASC"
        }, _limit ? _limit : 0, _offset ? _offset : 0);
    }
    /**
     *
    * @param _clauseFields These th fileds in the clause , use AND | OR | NONE opertaor  NONE oprator is is to be used only at last element of array
     * @param _selectedFields The field o fthe table to reurned
     * @param _orderBy by filed either ASC | DESC
     * @param _limit number of rows limited
     * @param _offset number of rows to be offset
     * @returns sql string and values array of the clause
     */
    select(_clauseFields, _selectedFields, _orderBy, _limit, _offset, _join) {
        return this.selectCls.select(_clauseFields, _selectedFields, {
            "fields": (_orderBy === null || _orderBy === void 0 ? void 0 : _orderBy.fields) ? _orderBy.fields : [],
            "by": (_orderBy === null || _orderBy === void 0 ? void 0 : _orderBy.by) ? _orderBy.by : "ASC"
        }, _limit ? _limit : 0, _offset ? _offset : 0, _join);
    }
    /**
     *
     * @param _field id file dof table
     * @param _updateFields update fileds
     * @returns sql string and values array of the clause
     */
    updateById(_field, _updateFields) {
        this.validateHandler(_updateFields);
        return this.updateCls.updateById(_field, _updateFields);
    }
    /**
     *
     * @param _updateFields update fileds
     * @param _clauseFileds clause fileds
     * @returns  sql string and values
     */
    update(_updateFields, _clauseFileds) {
        this.validateHandler(_updateFields);
        return this.updateCls.update(_updateFields, _clauseFileds);
    }
    /**
     * createTable
     */
    createTable() {
        let __fields = "";
        this.fields.forEach(curField => {
            // set name of field
            __fields = __fields + " " + curField.fieldName;
            // set type of field 
            if ((0, runtime_1.stringType)(curField.type)) {
                __fields = __fields + " varchar";
                if (curField.type.size) {
                    __fields = __fields + "(" + curField.type.size + ")";
                }
                else {
                    __fields = __fields + "(255)";
                }
            }
            else if ((0, runtime_1.numberType)(curField.type)) {
                __fields = __fields + " int";
                if (curField.type.autoIncrement) {
                    __fields = __fields + "  AUTO_INCREMENT";
                }
            }
            else if ((0, runtime_1.dateType)(curField.type)) {
                __fields = __fields + " date";
            }
            else if ((0, runtime_1.dateTimeType)(curField.type)) {
                __fields = __fields + " datetime";
            }
            else if ((0, runtime_1.textType)(curField.type)) {
                __fields = __fields + " text";
            }
            else if ((0, runtime_1.booleanType)(curField.type)) {
                __fields = __fields + " tinyint(1)";
            }
            else if ((0, runtime_1.doubleType)(curField.type)) {
                __fields = __fields + " double";
            }
            else if ((0, runtime_1.enumType)(curField.type)) {
                __fields = __fields + " enum";
                let EnumArray = "";
                curField.type.enumValues.forEach(el => {
                    EnumArray = `${EnumArray}, "${el}"`;
                });
                EnumArray = EnumArray.trim().substring(1, EnumArray.trim().length);
                __fields = __fields + "(" + EnumArray + ")";
            }
            // set null or not null
            if (curField.null) {
                __fields = __fields + " NULL";
            }
            else {
                __fields = __fields + " NOT NULL";
            }
            // default value
            if (curField.default !== undefined) {
                if ((0, runtime_1.CURRENT_TIMESTAMP)(curField.default)) {
                    __fields = __fields + " DEFAULT CURRENT_TIMESTAMP";
                }
                else if ((0, runtime_1.NULL)(curField.default)) {
                    __fields = __fields + " DEFAULT NULL";
                }
                else if ((0, runtime_1.AS_DEFINED)(curField.default)) {
                    __fields = `${__fields}  DEFAULT ${curField.default.value.toString()}`;
                }
            }
            __fields = __fields + ",";
        });
        __fields = __fields.trim();
        /**
         * set keys
         */
        let __keys = "";
        this.fields.forEach(curField => {
            if (curField.PrimeryKey) {
                __keys = __keys + " PRIMARY KEY (" + curField.fieldName + "),";
            }
            if (curField.unique) {
                __keys = __keys + " UNIQUE KEY " + this.tableName + "_" + curField.fieldName + "(" + curField.fieldName + "),";
            }
        });
        __keys = __keys.trim();
        let __FiledKeys = __fields + __keys;
        while ((__FiledKeys[__FiledKeys.trim().length - 1] == ",")) {
            __FiledKeys = __FiledKeys.substring(0, __FiledKeys.length - 1);
        }
        let __sql = `CREATE TABLE  IF NOT EXISTS ${this.tableName} (${__FiledKeys})ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4`;
        return __sql.trim() + ";";
    }
    /**
     * This function creates relationship
     * @param thisTableFieldName FOREIGN KEY of this table
     * @param otherTable  name of related table
     * @param otherTablefieldName REFERENCES of retated table\
     * @onDelete "RESTRICT" | "CASCADE"
     * @onUpdate "RESTRICT" |"NO ACTION" | "CASCADE" | "SET NULL" | "SET DEFAULT"
     */
    relatetable(thisTableFieldName, otherTable, otherTablefieldName, onDelete = "RESTRICT", onUpdate = "RESTRICT") {
        let __sql = `ALTER TABLE ${this.tableName} ADD CONSTRAINT ${otherTable}_${this.tableName} FOREIGN KEY (${thisTableFieldName}) REFERENCES ${otherTable} (${otherTablefieldName}) ON DELETE ${onDelete} ON UPDATE ${onUpdate}`;
        return __sql.trim() + ";";
    }
    /**
     * This method retruns the contraint selct statement
     * @param constraint name of constraint
     * @returns reqturns sql_vales
     */
    getConstraint(constraint) {
        let sql = `SELECT CONSTRAINT_NAME FROM information_schema.REFERENTIAL_CONSTRAINTS WHERE CONSTRAINT_NAME = ?`;
        return {
            "sql": sql, "values": [constraint]
        };
    }
    /**
     * This function throws error in case there is falire of validation
     * @param _sqlField this is array of field which destned to update or insert table in insert and update operations
     */
    validateHandler(_sqlField) {
        _sqlField.forEach(inF => {
            let curField = this.fields.find(f => {
                if (f.fieldName == inF.fieldName) {
                    return f;
                }
            });
            if (curField === null || curField === void 0 ? void 0 : curField.validate) {
                let fieldCheck = curField.validate(inF.value);
                if (!fieldCheck) {
                    throw new Error().message = `validation failure at field ${inF.fieldName} and for this value ${inF.value}`;
                }
            }
        });
    }
}
exports.default = Table;
//# sourceMappingURL=Table.js.map