import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Check, CreditCard, Copy } from "lucide-react";

export default function MembershipPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
        <Card className="max-w-md w-full border-border shadow-lg">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
              <CreditCard className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Гишүүн болох</CardTitle>
            <CardDescription>
              Та манай премиум гишүүн болсноор бүх мэдээллийг харах боломжтой.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 p-4 rounded-lg space-y-3 border border-border">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Банк:</span>
                <span className="font-semibold">ХААН БАНК</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Дансны дугаар:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-lg">5560186628</span>
                </div>
              </div>
              <div className="border-t border-border my-2 pt-2 flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Үнийн дүн:</span>
                <span className="font-bold text-primary text-lg">30,000₮</span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Заавар:</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex gap-2">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Гүйлгээний утга дээр өөрийн <strong>mail хаягыг</strong> заавал оруулж өгнө үү.</span>
                </li>
                <li className="flex gap-2">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Төлбөр төлөгдсөний дараа таны эрх идэвхжих болно.</span>
                </li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <p className="text-xs text-center text-muted-foreground w-full mb-4">
              Асуух зүйл байвал админтай холбогдоно уу.
            </p>
            <Link href="/" className="w-full">
              <Button variant="outline" className="w-full">
                Буцах
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
