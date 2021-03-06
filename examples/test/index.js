
const { Table } = require("very-simple-orm")
const validator = require("validator")

let user = new Table("userTest", [
    {
        "fieldName": "id",
        "type": {"Number" : "Number", "autoIncrement" : true},
        "unique": true,
        "PrimeryKey": true,
        "null": false,

    },
    {
        "fieldName" : "dateTime",
        "type" : {"DateTime" : "DateTime"},
        "default" : {"CURRENT_TIMESTAMP" : "CURRENT_TIMESTAMP"}
        
    },
    {
        "fieldName": "username",
        "type": {"String" : "String", "size" : 150},
        "unique": true,
        "null": false
        
    },
    {
        "fieldName": "password",
        "type": {"String" : "String", "size" : 200},
        "unique": false,
        "null": false,
    },
    {
        "fieldName": "email",
        "type": {"String" : "String", "size" : 200},
        "unique": false,
        "null": false,
        "validate" : (value =>{
            if(validator.isEmail(value)){
                return true
            }else{
                return false
            }
        })
    },
    {
        "fieldName": "gender",
        "type": {"Enum" : "Enum", "enumValues" :['Male', 'Female', 'Not Specified', 'Transgender'] },
        "null": false,
        "unique" : false,
        "default" : {"AS_DEFINED" : "AS DEFINED", "value" : "(curdate())"}


    },
    {
        "fieldName": "orgId",
        "null": false,
        "type": {"Number" : "Number"}

    }


])


let org = new Table("orgTest", [
    {
        "fieldName": "id",
        "type": {"Number" : "Number", "autoIncrement" : true},
        "PrimeryKey": true,
        "null": false,
        "unique": true
    },
    {
        "fieldName": "orgName",
        "type": {"String" : "String"},
        "unique": true,
        "null": false,

    }
])








//return the sql string and values of arguments
console.log(user.createTable())
// console.log(org.createTable())
// console.log(user.relatetable("orgId", "orgTest", "id", "RESTRICT", "RESTRICT"))


/**
 * ===============
 *  SELECT
 * ===============
 */
// console.log(user.selectById({"fieldName": "id", "value" : 1},["id", "email", "username"], {"fields" : ["id", "email"], "by" : "DESC"}))
console.log(user.select([
    {"fieldName" : "name", "value" : "umesh", "operator" : "=", "separator" : "AND"},
    {"fieldName" : "gender", "value" : "Male", "operator" : "!=" , "separator" : "OR"},
    {"fieldName" : "email", "value" : "%umesh@gmail.com%", "operator" : "LIKE" , "separator" : "NONE" },
],["id", "name", "gender"], {}, 100, 50,[{
    "type" : "RIGHT JOIN",
    "otherTable" : "orgnization",
    "otherTableSelectField" : ["organization_name", "address"],
    "otherTableJoinField" : "id",
    "thistableJoinField" : "organizationId"
},{
    "type" : "INNER JOIN",
    "otherTableJoinField" : "id",
    "thistableJoinField" : "patientId",
    "otherTable" : "doctor",
    "anotherTable" : "org",
    "otherTableSelectField" : ["name"]
}
]))

console.log(user.select())

/**
 * =====================
 *  UPDATE
 * ======================
 */
// console.log(user.updateById({"fieldName" : "id", "value" : 1}, [
//     {"fieldName" : "name" , value : "han"},
//     {"fieldName" : "gender" , value : "Female"},
//     {"fieldName" : "email", "value" : "umeshbilagi@gmail.com"}
// ]))

console.log(user.update(
    [{"fieldName" : "pincode", "value" : "589057"}, {"fieldName" : "mobile", "value" : "9856789"}],
    [   {"fieldName" : "mobile", "value" : "", "operator" : "=", "separator" : "OR"},
        {"fieldName" : "pincode", "value" : "", "operator" : "=", "separator" : ""}]
))


/***
 * ==================
 *  INSERT
 * ================
 */
// console.log(org.insert([
//     { "fieldName": "id", "value": 1 },
//     { "fieldName": "name", "value": "JJH" }
// ]))

// console.log(
//     org.insertMany([
//         [{"fieldName" : "id", "value" : 1}, { "fieldName": "name", "value": "JJH" }],
//         [{"fieldName" : "id", "value" : 2}, { "fieldName": "name", "value": "TDH" }],
//         [{"fieldName" : "id", "value" : 3}, { "fieldName": "name", "value": "MH" }],
//     ])
// )


    
/**
 * ==================
 *  DELETE
 * ================
 */

// console.log(user.deleteById({fieldName : "id", "value" : 1}))
// console.log(user.fields.map(el => {
//     return el.fieldName
// }))

// console.log(user.delete([
//     {"fieldName" : "firstName", "value" : "%um%", "operator" : "LIKE", "separator" : "AND"},
//     {"fieldName" : "middleName", "value" : "M", "operator" : "!=", "separator" : "NONE"}

// ]))


// console.log(user.getConstraint("user_org"))




