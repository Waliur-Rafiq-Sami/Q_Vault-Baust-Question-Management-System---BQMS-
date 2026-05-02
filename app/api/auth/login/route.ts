import { connectDB } from "@/lib/db";
import { User } from "@/features/user/user.model";

export async function POST(req: Request) {
  await connectDB();

  const { email, password } = await req.json();

  const user = await User.findOne({ email, password });

  if (!user) {
    return Response.json({ error: "Invalid credentials" }, { status: 401 });
  }

  return Response.json(user);
}
