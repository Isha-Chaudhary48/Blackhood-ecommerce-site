import pool from "@/lib/db"
import bcrypt from "bcrypt"
import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { transporter } from "@/lib/mailer";

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();
        const verification_token = randomBytes(32).toString("hex");
        const existingUser = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        )
        if (existingUser.rows.length > 0) {
            return NextResponse.json({ error: 'user already exists please signIn' }, { status: 400 })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            "INSERT INTO users(name,email,password,is_verified,verification_token) VALUES($1,$2,$3,$4,$5)", [name, email, hashedPassword, false, verification_token]
        );

        const verifyLink = `https://blackhood-liart.vercel.app/verify-email?token=${verification_token}`

        await transporter.sendMail({
            from: `"Blackhood" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Verify your email",
            html: `<p>Hello ${name},</p>
            <p>Welcome to <strong>Blackhood</strong> — we’re excited to have you with us!</p>
            <p>To complete your registration and activate your account, please verify your email address by clicking the link below:</p>
            <a href="${verifyLink}"> Verify Your Email </a>
            <p>If you did not create an account with Blackhood, you can safely ignore this email.</p>

            <p>Warm regards,<br/>
            <strong>The Blackhood Team</strong></p>`

        });


        return NextResponse.json({ success: true }, { status: 201 });
    }
    catch (err) {
        console.log(err);
        return NextResponse.json({ err: "Internal server error" }, { status: 500 });
    }
}