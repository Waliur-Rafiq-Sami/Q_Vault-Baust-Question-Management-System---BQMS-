import { connectDB } from "@/lib/db";
import { User } from "@/features/user/user.model";

export async function POST(req: Request) {
  await connectDB();

  const body = await req.json();

  const user = await User.create(body);

  return Response.json(user);
}
