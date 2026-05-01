import { connectDB } from "@/lib/db";
import { User } from "@/features/user/user.model";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, email, password, birthdate, phone, role } = body;

    // 1. Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // This triggers the result.error in the frontend
      return Response.json(
        { error: "This email is already registered. Try logging in!" },
        { status: 400 },
      );
    }

    // 2. Create User
    const user = await User.create({
      name,
      email,
      password, // Note: In a real app, hash this with bcrypt!
      birthdate,
      phone,
      role: role || "user",
    });

    // 3. Remove password from response
    const { password: _, ...userWithoutPassword } = user.toObject();

    return Response.json(
      {
        message: "Success",
        user: userWithoutPassword,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
