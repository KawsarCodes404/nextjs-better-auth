import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { Resend } from 'resend';

const client = new MongoClient(process.env.BETTER_AUTH_DB_URL);
const db = client.db("better-auth-db");

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        sendResetPassword: async ({ user, url, token }, request) => {
            void resend.emails.send({
                from: 'Acme <onboarding@resend.dev>',
                to: user.email,
                subject: "Reset your password",
                html: `
                    <h4>Reset your Password</h4>
                    Click the link to reset your password: ${url}
                    <p>Ignore this email if you haven't requested a password reset</p>
                `,
            })
        }
    },

    emailVerification: {
        sendVerificationEmail: async ({ user, url }) => {
            void resend.emails.send({
                from: 'Acme <onboarding@resend.dev>',
                to: user.email,
                subject: 'Verify your email address',
                html: `Click <a href="${url}">here</a> to verify your email.`,
            })
        },
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        expiresIn: 3600 // 1 hour
    },

    socialProviders: {
        google: {
            clientId: process.env.BETTER_AUTH_GOOGLE_CLIENT_ID,
            clientSecret: process.env.BETTER_AUTH_GOOGLE_SECRET,
        },
        github: {
            clientId: process.env.BETTER_AUTH_GITHUB_CLIENT_ID,
            clientSecret: process.env.BETTER_AUTH_GITHUB_SECRET,
        },
    },

    database: mongodbAdapter(db, {
        // Optional: if you don't provide a client, database transactions won't be enabled.
        client
    }),
});




// Working code from taken AI !

// import { betterAuth } from "better-auth";
// import { MongoClient } from "mongodb";
// import { mongodbAdapter } from "better-auth/adapters/mongodb";
// import { Resend } from "resend";

// const client = new MongoClient(process.env.BETTER_AUTH_DB_URL);
// const db = client.db("better-auth-db");

// const resend = new Resend(process.env.RESEND_API_KEY);

// export const auth = betterAuth({
//     emailAndPassword: {
//         enabled: true,
//         requireEmailVerification: true,
//     },

//     emailVerification: {
//         sendVerificationEmail: async ({ user, url }) => {
//             const { data, error } = await resend.emails.send({
//                 from: "Acme <onboarding@resend.dev>",
//                 to: user.email,
//                 subject: "Verify your email address",
//                 html: `
//                     <h2>Verify your email address</h2>
//                     <p>
//                         Click
//                         <a href="${url}">here</a>
//                         to verify your email address.
//                     </p>
//                 `,
//             });

//             console.log("RESEND DATA:", data);
//             console.log("RESEND ERROR:", error);
//         },

//         sendOnSignUp: true,
//         autoSignInAfterVerification: true,
//         expiresIn: 3600, // 1 hour
//     },

//     socialProviders: {
//         google: {
//             clientId: process.env.BETTER_AUTH_GOOGLE_CLIENT_ID,
//             clientSecret: process.env.BETTER_AUTH_GOOGLE_SECRET,
//         },

//         github: {
//             clientId: process.env.BETTER_AUTH_GITHUB_CLIENT_ID,
//             clientSecret: process.env.BETTER_AUTH_GITHUB_SECRET,
//         },
//     },

//     database: mongodbAdapter(db, {
//         client,
//     }),
// });















// import { betterAuth } from "better-auth";
// import { MongoClient } from "mongodb";
// import { mongodbAdapter } from "better-auth/adapters/mongodb";

// const client = new MongoClient("mongodb://localhost:27017/database");
// const db = client.db();

// export const auth = betterAuth({
//     database: mongodbAdapter(db, {
//         client
//     }),
//    //...
// });