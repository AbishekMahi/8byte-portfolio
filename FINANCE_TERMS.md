# Glossary - finance terms used in this project

**Candidate:** Abishek M

Dear team,

I am mainly a software developer, not from finance background. The assignment uses several stock market terms, so I wrote this short glossary to explain what each column means in my dashboard. Hopefully it makes the table and Loom video easier to follow.

---

## General terms

| Term | Meaning |
|------|---------|
| **Stock / share** | A unit of ownership in a company. |
| **Portfolio** | The full set of stocks held, taken together. |
| **Holding** | One position in the portfolio (company, quantity, purchase price, etc.). |
| **Market / exchange** | Where shares are traded. In India the main ones are **NSE** (National Stock Exchange) and **BSE** (Bombay Stock Exchange). |

---

## Prices and value

| Term | Meaning | In this application |
|------|---------|---------------------|
| **CMP** (Current Market Price) | The price of **one share right now** on the market. | Fetched live from Yahoo; shown in the “CMP” column. |
| **Purchase / buy price** | The price paid per share when the holding was bought (from Excel). | Stored in `portfolio.json`; does not update automatically. |
| **Quantity (qty)** | Number of shares held. | From Excel. |
| **Investment** | Total money spent to buy the position. | Purchase price × quantity. |
| **Present value** (“value now”) | What the position is worth today at CMP. | CMP × quantity. |
| **Gain / loss** | Profit or loss compared to amount invested. | Present value minus investment; green if positive, red if negative. |
| **Portfolio %** (weight) | How much of the total portfolio value this holding represents by investment. | (Holding investment ÷ total investment) × 100. |

**Example:** Buy price ₹100, quantity 10 → investment ₹1,000. If CMP is ₹120 → present value ₹1,200 → gain ₹200 (shown in green).

---

## Fundamentals (from Yahoo / Google)

| Term | Meaning | In this application |
|------|---------|---------------------|
| **P/E ratio** | Price-to-earnings ratio - a common measure investors use to compare price to company earnings (simplified). | Shown when Yahoo or Google returns it; otherwise “-”. |
| **Latest earnings / EPS** | Earnings per share - profit attributable to each share, in rupees (as in the assignment column “Latest earnings ann.”). | Shown when available from Yahoo; Google used as fallback. |

---

## Organisation and symbols

| Term | Meaning | In this application |
|------|---------|---------------------|
| **Sector** | Industry category (e.g. banking, IT, power). | Used to group the table and chart. |
| **Particulars** | Company name from the Excel sheet. | “Stock” column in the UI. |
| **Symbol / ticker** | Short code on the exchange (e.g. HDFCBANK). | Used to build Yahoo symbols (`HDFCBANK.NS` for NSE). |
| **NSE** | National Stock Exchange. | Yahoo suffix `.NS`. |
| **BSE** | Bombay Stock Exchange; often numeric codes. | Yahoo suffix `.BO`. |

---

## UI colours

| Colour | Meaning |
|--------|---------|
| Green | Gain - present value is higher than investment. |
| Red | Loss - present value is lower than investment. |
| Dash (-) | Live data not available for that field. |

---

## Mapping to assignment columns

| Assignment (Excel / brief) | Dashboard column / field |
|-----------------------------|---------------------------|
| Particulars | Stock name |
| Purchase price | Buy price |
| Qty. | Qty |
| Investment | Invested |
| Portfolio % | Weight |
| Exchange (NSE / BSE) | Symbol + exchange in data |
| CMP | CMP (live) |
| Present value | Value now |
| Gain / loss | Gain / loss |
| P/E ratio | P/E ratio |
| Latest earnings ann. (Rs.) | Earnings (Rs.) |
| Sector | Sector (grouped view) |

---

## Note on scope

I focused on building a reliable technical solution: loading data, calculating columns, refreshing on a schedule, and presenting the portfolio clearly. I do not provide investment advice; figures come from public sources (Yahoo Finance and, where needed, Google Finance) and may be incomplete or delayed.

If anything in the glossary should be expanded, I can clarify in the interview.

Abishek M
