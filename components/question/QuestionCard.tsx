import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function QuestionCard({ q }: any) {
  return (
    <Card className="hover:shadow-lg transition">
      <CardContent className="p-4 space-y-2">
        <h2 className="font-semibold text-lg">{q.courseCode}</h2>

        <p className="text-sm text-muted-foreground">
          {q.dept.toUpperCase()} | Level {q.level}
        </p>

        <p className="text-sm">Type: {q.type.toUpperCase()}</p>

        <a href={q.url} target="_blank">
          <Button className="w-full mt-2">View / Download</Button>
        </a>
      </CardContent>
    </Card>
  );
}
