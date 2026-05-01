import { connectDB } from "@/lib/db";
import { User } from "@/features/user/user.model";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    // Find the user
    const user = await User.findOne({ email, password });

    if (!user) {
      return Response.json(
        { error: "Invalid email or password. Please try again." },
        { status: 401 },
      );
    }

    // 🔥 SECURITY: Convert to object and remove password before sending to frontend
    const userObj = user.toObject();
    delete userObj.password;

    // 🔥 WRAP IN 'user' KEY to match your context: setUser(data.user)
    return Response.json({
      message: "Login successful",
      user: userObj,
    });
  } catch (error) {
    console.error("LOGIN_ERROR:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
