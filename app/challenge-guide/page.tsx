import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Challenge Guide - XAUUSD Lot Table | 4EX.MN",
  description:
    "XAUUSD стандарт lot болон micro lot хүснэгт (SL/TP) ашиглан challenge-д зориулсан лот тооцоолол.",
};

type LotRow = {
  step: number;
  balance: number;
  lot: number;
  sl: number;
  tp: number;
  afterBalance: number;
};

const xauusdStandardLot: LotRow[] = [
  { step: 1, balance: 100, lot: 0.1, sl: 50, tp: 150, afterBalance: 250 },
  { step: 2, balance: 250, lot: 0.2, sl: 50, tp: 150, afterBalance: 550 },
  { step: 3, balance: 550, lot: 0.4, sl: 50, tp: 150, afterBalance: 1150 },
  { step: 4, balance: 1150, lot: 0.8, sl: 50, tp: 150, afterBalance: 2350 },
  { step: 5, balance: 2350, lot: 1.6, sl: 50, tp: 150, afterBalance: 4750 },
  { step: 6, balance: 4750, lot: 3.2, sl: 50, tp: 150, afterBalance: 9550 },
  { step: 7, balance: 9550, lot: 6.4, sl: 50, tp: 150, afterBalance: 19150 },
  { step: 8, balance: 19150, lot: 12.8, sl: 50, tp: 150, afterBalance: 38350 },
  { step: 9, balance: 38350, lot: 25.6, sl: 50, tp: 150, afterBalance: 76750 },
  { step: 10, balance: 76750, lot: 51.2, sl: 50, tp: 150, afterBalance: 153550 },
];

const xauusdMicroLot: LotRow[] = [
  { step: 1, balance: 10, lot: 0.01, sl: 50, tp: 150, afterBalance: 25 },
  { step: 2, balance: 25, lot: 0.02, sl: 50, tp: 150, afterBalance: 55 },
  { step: 3, balance: 55, lot: 0.04, sl: 50, tp: 150, afterBalance: 115 },
  { step: 4, balance: 115, lot: 0.08, sl: 50, tp: 150, afterBalance: 235 },
  { step: 5, balance: 235, lot: 0.16, sl: 50, tp: 150, afterBalance: 475 },
  { step: 6, balance: 475, lot: 0.32, sl: 50, tp: 150, afterBalance: 955 },
  { step: 7, balance: 955, lot: 0.64, sl: 50, tp: 150, afterBalance: 1915 },
  { step: 8, balance: 1915, lot: 1.28, sl: 50, tp: 150, afterBalance: 3835 },
  { step: 9, balance: 3835, lot: 2.56, sl: 50, tp: 150, afterBalance: 7675 },
  { step: 10, balance: 7675, lot: 5.12, sl: 50, tp: 150, afterBalance: 15355 },
];

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatLot(value: number) {
  return value.toString();
}

function LotTable({ rows }: { rows: LotRow[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-background/40">
      <table className="min-w-[720px] w-full text-sm">
        <thead className="bg-muted/40">
          <tr className="text-left">
            <th className="px-4 py-3 font-semibold text-foreground">№</th>
            <th className="px-4 py-3 font-semibold text-foreground">Balance</th>
            <th className="px-4 py-3 font-semibold text-foreground">Lot</th>
            <th className="px-4 py-3 font-semibold text-foreground">SL</th>
            <th className="px-4 py-3 font-semibold text-foreground">TP</th>
            <th className="px-4 py-3 font-semibold text-foreground">Total Balance</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.step} className="border-t border-border/70 hover:bg-accent/30 transition-colors">
              <td className="px-4 py-3 text-muted-foreground">{r.step}</td>
              <td className="px-4 py-3 font-medium text-foreground">{formatUsd(r.balance)}</td>
              <td className="px-4 py-3 font-medium text-foreground">{formatLot(r.lot)}</td>
              <td className="px-4 py-3 text-muted-foreground">{r.sl}</td>
              <td className="px-4 py-3 text-muted-foreground">{r.tp}</td>
              <td className="px-4 py-3 font-semibold text-foreground">{formatUsd(r.afterBalance)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ChallengeGuidePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Header */}
        <section className="bg-primary/5 py-12 sm:py-16 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-muted-foreground text-xs font-bold tracking-wider">GUIDE</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mt-2">
              Challenge Guide
            </h1>
            <p className="text-muted-foreground mt-3 max-w-3xl leading-relaxed">
              XAUUSD (Gold) дээр challenge хийхэд зориулсан стандарт lot хүснэгт. (SL=50, TP=150).
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 mt-8 mb-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="bg-card/50 backdrop-blur-sm border-border rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl">XAUUSD — Standard Lot</CardTitle>
                <CardDescription>
                  Balance өсөх тусам lot-оо дараах байдлаар өсгөнө.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LotTable rows={xauusdStandardLot} />
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-border rounded-2xl">
              <CardHeader>
                <CardTitle className="text-xl">XAUUSD — Micro Lot</CardTitle>
                <CardDescription>
                  Бага дансанд (жишээ: $10) зориулсан ижил логиктой хүснэгт.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LotTable rows={xauusdMicroLot} />
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 rounded-2xl border border-border bg-muted/30 p-5">
            <h2 className="font-semibold text-foreground">Тайлбар</h2>
            <ul className="mt-2 text-sm text-muted-foreground list-disc pl-5 space-y-1">
              <li>SL/TP утгууд нь хүснэгт дээрх (SL=50, TP=150) утга.</li>
              <li>Broker-ийн contract size, tick value, commission/swap зэргээс шалтгаалж бодит дүн зөрж болно.</li>
              <li>Энэ нь санхүүгийн зөвлөгөө биш — зөвхөн guide/тооцооллын загвар.</li>
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
