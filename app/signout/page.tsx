import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SignOutPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4 text-foreground">Та системээс амжилттай гарлаа</h1>
        <p className="text-muted-foreground mb-6">
          Манай платформыг ашигласанд баярлалаа
        </p>
        <Link href="/signin">
          <Button>Дахин нэвтрэх</Button>
        </Link>
      </div>
    </div>
  );
}
