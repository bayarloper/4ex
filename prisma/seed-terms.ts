
import { PrismaClient } from '../lib/generated/client/client';
import { config } from 'dotenv';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

config();

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const terms = [
  // GENERAL TERMS
  { category: "GENERAL TERMS", term: "SMC", definition: "Smart Money Concepts" },
  { category: "GENERAL TERMS", term: "IPDA", definition: "Interbank Price Delivery Algorithm" },
  { category: "GENERAL TERMS", term: "IBDR", definition: "Interbank Dealing Range" },
  { category: "GENERAL TERMS", term: "DR", definition: "Dealing Range" },
  { category: "GENERAL TERMS", term: "IOF", definition: "Institutional Order Flow" },
  { category: "GENERAL TERMS", term: "EQ", definition: "Equilibrium" },
  { category: "GENERAL TERMS", term: "SMT", definition: "Smart Money Technique" },
  { category: "GENERAL TERMS", term: "S&D", definition: "Seek and Destroy" },
  { category: "GENERAL TERMS", term: "PO3", definition: "Power Of Three" },
  { category: "GENERAL TERMS", term: "AMD", definition: "Accumulation Manipulation Distribution" },
  { category: "GENERAL TERMS", term: "PDA", definition: "Premium Discount Array" },
  { category: "GENERAL TERMS", term: "S/R", definition: "Support/Resistance" },

  // SESSIONS
  { category: "SESSIONS", term: "KZ", definition: "Kill-Zone" },
  { category: "SESSIONS", term: "NYO", definition: "New York Open" },
  { category: "SESSIONS", term: "LO", definition: "London Open" },
  { category: "SESSIONS", term: "MO", definition: "Midnight Open" },
  { category: "SESSIONS", term: "NYKZ", definition: "New York Kill-zone" },
  { category: "SESSIONS", term: "LOKZ", definition: "London Kill-zone" },
  { category: "SESSIONS", term: "LCKZ", definition: "London Close Kill-zone" },
  { category: "SESSIONS", term: "AKZ", definition: "Asian Kill-zone" },

  // TIME ELEMENTS
  { category: "TIME ELEMENTS", term: "RTH", definition: "Regular Trading Hours" },
  { category: "TIME ELEMENTS", term: "ETH", definition: "Electronic Trading Hours" },
  { category: "TIME ELEMENTS", term: "SB", definition: "Silver Bullet" },
  { category: "TIME ELEMENTS", term: "FHM", definition: "Final Hour Macro" },
  { category: "TIME ELEMENTS", term: "HTF", definition: "Higher Time Frame" },
  { category: "TIME ELEMENTS", term: "LTF", definition: "Lower Time Frame" },

  // KEY HIGH IMPACT NEWS
  { category: "KEY HIGH IMPACT NEWS", term: "CPI", definition: "Consumer Price Index" },
  { category: "KEY HIGH IMPACT NEWS", term: "NFP", definition: "Non-Farm Payrolls" },
  { category: "KEY HIGH IMPACT NEWS", term: "FOMC", definition: "Federal Open Market Committee" },

  // MARKET STRUCTURE
  { category: "MARKET STRUCTURE", term: "MSS", definition: "Market Structure Shift" },
  { category: "MARKET STRUCTURE", term: "MSB", definition: "Market Structure Break" },
  { category: "MARKET STRUCTURE", term: "BOS", definition: "Break Of Structure" },
  { category: "MARKET STRUCTURE", term: "CISD", definition: "Change In State of Delivery" },
  { category: "MARKET STRUCTURE", term: "OF", definition: "Order Flow" },
  { category: "MARKET STRUCTURE", term: "LRLR", definition: "Low Resistance Liquidity Run" },
  { category: "MARKET STRUCTURE", term: "HRLR", definition: "High Resistance Liquidity Run" },

  // MARKET MAKER MODEL
  { category: "MARKET MAKER MODEL", term: "MMXM", definition: "Market Maker Models" },
  { category: "MARKET MAKER MODEL", term: "MMBM", definition: "Market Maker Buy Model" },
  { category: "MARKET MAKER MODEL", term: "MMSM", definition: "Market Maker Sell Model" },
  { category: "MARKET MAKER MODEL", term: "O.C.", definition: "Original Consolidation" },
  { category: "MARKET MAKER MODEL", term: "SMR", definition: "Smart Money Reversal" },

  // LIQUIDITY
  { category: "LIQUIDITY", term: "LP", definition: "Liquidity Pool" },
  { category: "LIQUIDITY", term: "SH", definition: "Stop Hunt" },
  { category: "LIQUIDITY", term: "BSL", definition: "Buyside Liquidity" },
  { category: "LIQUIDITY", term: "SSL", definition: "Sellside Liquidity" },
  { category: "LIQUIDITY", term: "IRL", definition: "Internal Range Liquidity" },
  { category: "LIQUIDITY", term: "ERL", definition: "External Range Liquidity" },
  { category: "LIQUIDITY", term: "EQH", definition: "Equal Highs" },
  { category: "LIQUIDITY", term: "EQL", definition: "Equal Lows" },
  { category: "LIQUIDITY", term: "REH", definition: "Relative Equal Highs" },
  { category: "LIQUIDITY", term: "REL", definition: "Relative Equal Lows" },
  { category: "LIQUIDITY", term: "PMH/L", definition: "Previous Month High/Low" },
  { category: "LIQUIDITY", term: "PWH/L", definition: "Previous Week High/Low" },
  { category: "LIQUIDITY", term: "PDH/L", definition: "Previous Day High/Low" },
  { category: "LIQUIDITY", term: "ATH/L", definition: "All time High/Low" },
  { category: "LIQUIDITY", term: "SH", definition: "Swing High" },
  { category: "LIQUIDITY", term: "SL", definition: "Swing Low" },
  { category: "LIQUIDITY", term: "STH/L", definition: "Short Term High/Low" },
  { category: "LIQUIDITY", term: "LTH/L", definition: "Long Term High/Low" },
  { category: "LIQUIDITY", term: "ITH/L", definition: "Intermediate Term High/Low" },
  { category: "LIQUIDITY", term: "LOTW", definition: "Low Of The Week" },
  { category: "LIQUIDITY", term: "HOTW", definition: "High Of The Week" },

  // IMBALANCES / GAPS
  { category: "IMBALANCES / GAPS", term: "FVG", definition: "Fair Value Gap" },
  { category: "IMBALANCES / GAPS", term: "IFVG", definition: "Inversion Fair Value Gap" },
  { category: "IMBALANCES / GAPS", term: "I.FVG", definition: "Implied Fair Value Gap" },
  { category: "IMBALANCES / GAPS", term: "VI", definition: "Volume Imbalance" },
  { category: "IMBALANCES / GAPS", term: "LV", definition: "Liquidity Void" },
  { category: "IMBALANCES / GAPS", term: "BPR", definition: "Balanced Price Range" },
  { category: "IMBALANCES / GAPS", term: "IRB", definition: "Immediate Rebalance" },
  { category: "IMBALANCES / GAPS", term: "BISI", definition: "Buyside Imbalance Sellside Inefficiency" },
  { category: "IMBALANCES / GAPS", term: "SIBI", definition: "Sellside Imbalance Buyside Inefficiency" },
  { category: "IMBALANCES / GAPS", term: "NWOG", definition: "New Week Opening Gap" },
  { category: "IMBALANCES / GAPS", term: "NDOG", definition: "New Day Opening Gap" },
  { category: "IMBALANCES / GAPS", term: "ORG", definition: "Opening Range Gap" },
  { category: "IMBALANCES / GAPS", term: "C.E", definition: "Consequent Encroachment (50% Level)" },

  // BLOCKS
  { category: "BLOCKS", term: "OB", definition: "Order Block" },
  { category: "BLOCKS", term: "BB", definition: "Breaker Block" },
  { category: "BLOCKS", term: "PB", definition: "Propulsion Block" },
  { category: "BLOCKS", term: "MB", definition: "Mitigation Block" },
  { category: "BLOCKS", term: "RB", definition: "Rejection Block" },
  { category: "BLOCKS", term: "MT", definition: "Mean Threshold (50% level)" },

  // ENTRIES AND RISK MANAGEMENT
  { category: "ENTRIES AND RISK MANAGEMENT", term: "DOL", definition: "Draw On Liquidity" },
  { category: "ENTRIES AND RISK MANAGEMENT", term: "POI", definition: "Point of interest" },
  { category: "ENTRIES AND RISK MANAGEMENT", term: "TP", definition: "Take Profit" },
  { category: "ENTRIES AND RISK MANAGEMENT", term: "OTE", definition: "Optimal Trade Entry" },
  { category: "ENTRIES AND RISK MANAGEMENT", term: "SL", definition: "Stop-Loss" },
  { category: "ENTRIES AND RISK MANAGEMENT", term: "BE", definition: "Break Even" },
  { category: "ENTRIES AND RISK MANAGEMENT", term: "R/R", definition: "Risk Reward" },
  { category: "ENTRIES AND RISK MANAGEMENT", term: "IOFED", definition: "Institutional Order Flow Entry Drill" },
  { category: "ENTRIES AND RISK MANAGEMENT", term: "OSOK", definition: "One Shot One Kill" },
  { category: "ENTRIES AND RISK MANAGEMENT", term: "TS", definition: "Turtle Soup" },
];

async function main() {
  console.log('Start seeding terms...');
  
  // Optional: Clear existing terms to avoid duplicates if running multiple times
  // await prisma.term.deleteMany({});

  for (const t of terms) {
    await prisma.term.create({
      data: t,
    });
  }
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
