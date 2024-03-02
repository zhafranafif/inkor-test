import { ApolloServer } from "@apollo/server";
 import {expressMiddleware} from '@apollo/server/express4'
 import {ApolloServerPluginDrainHttpServer} from '@apollo/server/plugin/drainHttpServer'
 import express from 'express';
 import http from 'http';
 import cors from 'cors';
 import bodyParser from 'body-parser';

 const typeDefs = `#graphql
 type Query {
     hello: [User]
   }

 type User {
     id: ID
     email: String!
     token: String!
     name: String!
     memberNo: Int!
   }

   type Payment {
     memberNo: Int!
     amount: Float!
   }

   type AuthResponse {
     id: ID
     token: String!
     email: String!
     expiration: Int!
   }

   type Mutation {
     authService(email: String!): AuthResponse
   }
   type Mutation {
     userService(email: String!, tokenId: String!): User!
   }
   type Mutation {
     postService(memberNo: Int!): Payment!
   }
 `
 const generatedToken = Array(32)
 .fill(0)
 .map(() => Math.floor(Math.random() * 16).toString(16))
 .join('')

 const users = [
     { 
         id: 1, 
         email: "abc@mail.com", 
         token: generatedToken, 
         name: "john", 
         memberNo: 12345, 
         expiration: 60
     }
   ];

 const payment = [
     { memberNo: 12345, amount: 500000.00 }
   ];

 const resolvers = {
     Query: {
         hello: () => users,
       },
     Mutation: {
        authService: (_, {email}) => {
         const user = users.find((user) => user.email === email);

         if (user) {
             const expiration = user.expiration
           const token = user.token;
           const id = user.id

           return {
             id,
             token,
             email,
             expiration,
           };
         } else {
           throw new Error('Invalid email');
         }
           },
           userService: (_, { email, tokenId }) => {
             console.log('Searching for user with email:', email, 'and tokenId:', tokenId);

             const user = users.find(user => user.email === email);
             if (user && user.token === tokenId) {
               console.log('User found:', user);
               return {
                 id: user.id,
                 name: user.name,
                 memberNo: user.memberNo,
                 email: user.email,
                 token: user.token
               };
             } else {
               console.log('No user found');
               throw new Error('No user found');
             }
           },
       postService: (_,{memberNo}) => {
         const payments = payment.find(payment => payment.memberNo === memberNo);
         if (payments) {
           return payments;
         } else {
           throw new Error('No payment found');
         }
       }
     }
   };

 const app = express()
 const httpServer = http.createServer(app)


 const server = new ApolloServer({
     typeDefs,
     resolvers,
     plugins: [ApolloServerPluginDrainHttpServer({httpServer})]
 })
 await server.start()

 app.use(
     cors(),
     bodyParser.json(),
     expressMiddleware(server)
 )
 await new Promise((resolve) => httpServer.listen({port: 4000}, resolve))
 console.log(`🚀 Server ready at http://localhost:4000`); 