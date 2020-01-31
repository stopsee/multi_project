const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Query {
        login(input : LRInput) : Token!,
        getUsers : [User]!,
        getProduct : [product!]!,
        getAllCategory(input : InputgetCategory) : [Category!]!,
        senMail : operation!,
        getAllBrand(input : InputGetBrand) : [Brand!]!
        getAllSurvey(categoryId : ID!) : Survey!
        getAllProductSpecs(categoryId : ID!) : [Specs!]!
        getAllProductSpecsDetails(specsId : ID!) : [SpecsDetails!]!
        getAllSeller(category : ID!) : [Seller!]!
        getAllWarranty : [Warranty!]!
        getAddProductInfo(categoryId : ID, getSubCategory : Boolean!, subCategoryId : ID) : addProductInfo!,
    }

    type Mutation {
        register(input : LRInput) : operation!,
        multimedia(file : Upload!) : UploadFile!,
        category(input : InputCategory) : operation!,
        survey(input : InputSurvey) : operation!,
        brand(input : InputBrand) : operation!,
        product(input : InputProduct) : operation!,
        productSpecs(input : InputProductSpecs) : ProductOperation!,
        productSpecsDetails(input : InputProductSpecsDetails) : ProductOperation!,
        productDetailsValue(input : InputProductDetailsValue) : operation!,
        UserForgetPassword(input : InputUserForgetPassword) : operation!,
        UserResetPassword(input : InputUserResetPassword) : operation!,
        ResetPassword(input : InputResetPassword) : operation!,
        seller(category : ID!, name : String!, label : String) : operation!,
        warranty(name : String!, label : String) : operation!
    }


    input InputGetBrand {
        page : Int,
        limit : Int,
        category : ID,
        getAll : Boolean
    }

    input InputgetCategory {
        catId : ID
        page : Int,
        limit : Int,
        mainCategory : Boolean,
        parentCategory : Boolean,
    }

    input InputResetPassword {
        phone : String!,
        password : String!,
        repassword : String!
    }

    input InputUserResetPassword {
        phone : String!,
        code : String
    }

    input InputUserForgetPassword {
        phone : String!
    }

    input InputProductSpecs {
        category : ID!,
        specs : String!,
        label : String
    }

    input InputProductSpecsDetails {
        specs : ID!,
        name : String!,
        label : String
    }

    input InputProductDetailsValue {
        p_details : ID!,
        value : String!,
        label : String
    }

    input InputProduct {
        fname : String!,
        ename : String!,
        category : ID!
        brand : ID!,
        attribute : [InputAttribute],
        description : String!,
        rate : Int,
        discount : Int,
        details : [InputDetails!]!,
        stock : Int!,
        image : [String]
    }

    input InputDetails {
        p_details : ID!,
        value : String!,
        label : String
    }

    input InputAttribute {
        seller : [ID!]!
        warranty : ID!,
        color : String!,
        price : Int!,
        stock : Int!
    }

    input InputBrand {
        category : [ID]!,
        name : String!,
        label : String,
        image : Upload!
    }

    input InputSurvey {
        category : ID!,
        list : [SurveyList]!
    }

    input SurveyList {
        name : String!,
        label : String
    }

    input InputCategory {
        name : String!,
        label : String,
        parent : ID,
        subcategory : ID
    }

    type operation {
        _id : ID,
        status : Int,
        message : String
    }

    type ProductOperation {
        _id : ID,
        status : Int,
        message : String
    }

    input LRInput {
        fname : String,
        lname : String,
        code : Int,
        number : String,
        birthday : String,
        gender : Gender,
        phone : String!,
        email : String,
        password : String!,
    }

    enum Gender {
        Male,
        Female
    }

    type Token {
        token : String!
    }

    type User {
        fname : String,
        lname : String,
        code : Int,
        number : String,
        birthday : String,
        gender : Gender,
        phone : String!,
        email : String,
        password : String!,
    }

    type UploadFile {
        name : String!,
        attribute : String,
        dimwidth : String,
        dimheight : String,
        dir : String!
    }

    type product {
        fname : String!,
        ename : String!,
        details : [ID!]!,
        image : [String!]!
    }

    type Category {
        _id : ID
        name : String!,
        label : String,
        parent : Parent,
    }

    type Parent {
        _id : ID,
        name : String!,
        label : String,
    }

    type Brand {
        _id : ID,
        category : [Category],
        name : String,
        label : String,
        image : String
    }

    type Survey {
        category : ID
        list : [SurveyOption]!
    }

    type SurveyOption {
        name : String!,
        label : String
    }

    type Specs {
        _id : ID!
        category : ID!
        specs : String!,
        label : String
    }

    type SpecsDetails {
        _id : ID!,
        specs : ID!,
        name : String!,
        label : String
    }

    type Seller {
        _id : ID
        category : ID,
        name : String,
        label : String
    }

    type Warranty {
        _id : ID,
        name : String,
        label : String
    }

    type addProductInfo {
        sellers : [Seller],
        brands : [Brand],
        subcats : [Category]
    }
`;

module.exports = typeDefs;