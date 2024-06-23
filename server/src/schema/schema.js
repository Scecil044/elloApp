const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLBoolean, GraphQLSchema, GraphQLList, GraphQLNonNull, GraphQLEnumType } = require("graphql");
const User = require("../models/User.model")
const Book = require("../models/Book.model")
const Role = require("../models/Role.model")
const generateAuthToken = require("../utils/generateToken")

const UserType = new GraphQLObjectType({
    name:"User",
    fields:()=>({
        id:{type:GraphQLID},
        firstName: {type:GraphQLString},
        lastName:{type:GraphQLString},
        email:{type:GraphQLString},
        phone:{type:GraphQLString},
        profilePicture:{type:GraphQLString},
        password:{type:GraphQLString},
        isDeleted:{type:GraphQLBoolean},
        role:{
            type:RoleType,
             async resolve(parent, args){
                return await Role.findOne({_id:parent.role})
            }
        }
    })
})

const BookType = new GraphQLObjectType({
    name:"Book",
    fields:()=>({
        id:{type:GraphQLID},
        title: {type:GraphQLString},
        author: {type:GraphQLString},
        coverPhotoURL:{type:GraphQLString},
        isDeleted:{type:GraphQLBoolean},
        readingLevel:{type:GraphQLString}
    })
})

const RoleType = new GraphQLObjectType({
    name:"Role",
    fields:()=>({
        id:{type:GraphQLID},
        roleName:{type:GraphQLString},
        isDeleted:{type:GraphQLBoolean}
    })
})

const AuthType = new GraphQLObjectType({
    name:"Auth",
    fields:()=>({
        token:{type:GraphQLString},
        user:{
            type:UserType,
        }
    })
})

const RootQuery = new GraphQLObjectType({
    name:"RootQueryType",
    fields:{
        users:{
            type:new GraphQLList(UserType),
            async resolve(parent, args){
                try {
                    const users = await User.find({isDeleted:false})
                    return users
                } catch (error) {
                    throw new Error(error)
                }
            }
        },
        user:{
            type:UserType,
            args:{
                id:{type:new GraphQLNonNull(GraphQLID)}
            },
            async resolve(parent, args){
                try {
                    const user = await User.findOne({_id:args.id, isDeleted:false})
                    if(!user) throw new Error("could not find matching user")
                        return user
                } catch (error) {
                    throw new Error(error)
                }
            }
        },
        books:{
            type:BookType,
            async resolve(parent, args){
                try {
                   return await Book.find({isDeleted:false})
                } catch (error) {
                    throw new Error(error)
                }
            }
        },
        book:{
            type:BookType,
            args:{
                id:{type:new GraphQLNonNull(GraphQLID)}
            },
            async resolve(parent, args){
                try {
                    return await Book.finOne({_id:args.id, isDeleted:false})
                } catch (error) {
                    throw new Error(error)
                }
            }
        },
        roles:{
            type: new GraphQLList(RoleType),
           async resolve(parent, args){
                try {
                    return await Role.find({isDeleted:false})
                } catch (error) {
                    throw new Error(error)
                }
            }
        },
        getRoleByName:{
            type:RoleType,
            args:{
                roleName:{type:new GraphQLNonNull(GraphQLString)}
            },
            async resolve(parent, args){
                try {
                    const role = await Role.findOne({roleName: args.roleName, isDeleted:false})
                    if(!role) throw new Error("Could not find matching role")
                return role
                } catch (error) {
                    throw new Error(error.message)
                }
            }
        },
        role:{
            type:RoleType,
            args:{
                id:{type:new GraphQLNonNull(GraphQLID)}
            },
            async resolve(parent, args){
                try {
                    const role = await Role.findOne({_id:args.id,isDeleted:false})
                    if(!role) throw new Error("could not find matching role")
                        return role
                } catch (error) {
                    throw new Error(error.message)
                }
            }
        },
    }
})


const mutation = new GraphQLObjectType({
    name:"Mutation",
    fields:{
        createUser:{
            type:UserType,
            args:{
                firstName:{type:new GraphQLNonNull(GraphQLString)},
                lastName:{type:new GraphQLNonNull(GraphQLString)},
                email:{type:new GraphQLNonNull(GraphQLString)},
                phone:{type:new GraphQLNonNull(GraphQLString)},
                password:{type:new GraphQLNonNull(GraphQLString)},
                profilePicture:{type:GraphQLString},
                role:{type:new GraphQLNonNull(GraphQLID)},
                isDeleted:{type:GraphQLBoolean}
            },
            async resolve(parent, args){
                try {
                    const newUser = await User.create({
                        firstName:args.firstName,
                        lastName: args.lastName,
                        email:args.email,
                        phone:args.phone,
                        password:args.password,
                        role:args.role
                    })
                    return newUser
                } catch (error) {
                    throw new Error(error)
                }
            }
        },
        updateUser:{
            type:UserType,
            args:{
                id:{type: new GraphQLNonNull(GraphQLID)}
            },
            async resolve(parent, args){
                try {
                    return await User.findByIdAndUpdate(
                        args.id,
                        {$set:{
                            firstName:args.firstName,
                            lastName:args.lastName,
                            email:args.email,
                            password:args.password,
                            profilePicture: args.profilePicture
                        }},
                        {new:true}
                    )
                    return await User.findByIdAndUpdate()
                } catch (error) {
                    throw new Error(error)
                }
            }
        },
        deleteUser:{
            type:UserType,
            args:{type:new GraphQLNonNull(GraphQLID)},
            async resolve(parent, args){
                try {
                    const isUser = await User.findOne({_id:args.id})
                    if(!isUser) throw new Error("User not found!")
                        isUser.isDeleted = true
                    await isUser.save()
                    return isUser
                } catch (error) {
                    throw new Error(error)
                }
            }

        },
        createRole:{
            type:RoleType,
            args:{
                roleName:{
                    type:new GraphQLEnumType({
                        name:"systemRole",
                        values:{
                            "teacher": {value: "isTeacher"},
                            "admin": {value: "isAdmin"},
                            "student": {value: "isStudent"},
                        }
                    }),
                    defaultValue:"isStudent"
                }
            },
            async resolve(parent, args){
                try {
                    const newRole = await Role.create({
                        roleName: args.roleName
                    })
                    return newRole
                } catch (error) {
                    console.log(error)
                }
            }
        },
        updateRole:{
            type:RoleType,
            args:{
                id:{type: new GraphQLNonNull(GraphQLID)},
                firstName:{type:GraphQLString},
                lastName:{type:GraphQLString},
                email:{type:GraphQLString},
                password:{type:GraphQLString},
                profilePicture:{type:GraphQLString}
            },
            async resolve(parent, args){
                try {
                    return await User.findByIdAndUpdate(
                        args.id,
                        {$set:{
                            firstName:args.firstName,
                            lastName:args.lastName,
                            email:args.email,
                            password:args.password,
                            profilePicture: args.profilePicture
                        }},
                        {new:true}
                    )
                } catch (error) {
                    throw new Error(error)
                }
            }
        },
        createBook:{
            type:BookType,
            args:{
                title:{type:new GraphQLNonNull(GraphQLString)},
                author:{type:new GraphQLNonNull(GraphQLString)},
                coverPhotoURL:{type:GraphQLString},
                readingLevel:{
                    type:new GraphQLEnumType({
                        name:"level",
                        values:{
                            "junior":{value:"beginner"},
                            "associate":{value:"intermediate"},
                            "senior":{value:"advanced"}
                        }
                    })
                }
            },
            async resolve(parent, args){
                try {
                    const newBook = await Book.create({
                        title:args.title,
                        readingLevel:args.readingLevel,
                        coverPhotoURL:args.coverPhotoURL,
                        author:args.author
                    })
                    return newBook
                } catch (error) {
                    throw new Error(error)
                }
            }
        },
        updateBook:{
            type:BookType,
            args:{
                id:{type: new GraphQLNonNull(GraphQLID)}
            },
            async resolve(parent, args){
                try {
                    return await User.findByIdAndUpdate()
                } catch (error) {
                    throw new Error(error)
                }
            }
        },
        login:{
            type:AuthType,
            args:{
                email:{type:new GraphQLNonNull(GraphQLString)},
                password:{type:new GraphQLNonNull(GraphQLString)},
            },
            async resolve(parent, args){
                try {
                    const isUser = await User.findOne({email:args.email, isDeleted:false})
                    if(!isUser) throw new Error("Invalid credentials!")
                        const isMatch = await isUser.comparePassword(args.password)
                    if(!isMatch) throw new Error("Invalid credentials!!")
                        const token = generateAuthToken(isUser)
                        const userObject = isUser.toObject()
                        delete userObject.password
                        return {token, user:userObject}
                } catch (error) {
                    throw new Error(error)
                }
            }

        }
    }
})


module.exports = new GraphQLSchema({
    query:RootQuery,
    mutation
})