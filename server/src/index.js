const express = require("express")
const { graphqlHTTP } = require("express-graphql")
require("dotenv").config()
const cors = require("cors")
const schema = require("./schema/schema")
const helmet = require("helmet")
const colors = require("colors")
const connectDb = require("./config/DB")

const app = express()
connectDb()
app.use(cors())
// app.use(express.urlencoded({extended:false}))
// app.use(express.json())
// app.use(helmet())

const PORT = process.env.PORT || 4500

app.use("/graphql", graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === "development"
}))

app.listen(PORT, ()=>{
    console.log(`Application running on http://localhost:${PORT}`)
})