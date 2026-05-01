import { connectDB } from "@/lib/db";
import { User } from "@/features/user/user.model";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { email, birthdate, phone, newPassword, confirmPassword } = body;

    if (!email || !birthdate || !phone || !newPassword || !confirmPassword) {
      return Response.json(
        { error: "All fields are required to reset your password." },
        { status: 400 },
      );
    }

    if (newPassword !== confirmPassword) {
      return Response.json(
        { error: "Passwords do not match." },
        { status: 400 },
      );
    }

    const user = await User.findOne({ email, birthdate, phone });

    if (!user) {
      return Response.json(
        { error: "Birthdate and phone number did not match our records." },
        { status: 404 },
      );
    }

    user.password = newPassword;
    await user.save();

    return Response.json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("FORGOT_PASSWORD_ERROR:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}