import { NextResponse } from "next/server";
import axios from "axios";

export const GET = async (req) => {
  try {
    // const { searchParams } = new URL(req.url);
    // const fromCurrency = searchParams.get("currency");

    const url = new URL(req.url);
    const fromCurrency = url.searchParams.get("currency");

    if (!fromCurrency) {
      return NextResponse.json(
        { error: "Please provide the 'currency' query parameter" },
        { status: 400 }
      );
    }

    const apiKey = "0920996e696442fab6bc097e9b5ba861";

    // const apiKey = process.env.NEXT_PUBLIC_OPEN_EXCHANGE_RATES_API_KEY;

    const response = await axios.get(
      `https://openexchangerates.org/api/latest.json?app_id=${apiKey}&symbols=${fromCurrency},INR`
    );

    const rates = response.data.rates;
    const exchangeRate = rates.INR / rates[fromCurrency];

    return NextResponse.json(
      //   { exchangeRate: `1 ${fromCurrency} = ${exchangeRate} INR` },
      { exchangeRate: exchangeRate },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    return NextResponse.json(
      { error: "Failed to fetch exchange rate" },
      { status: 500 }
    );
  }
};
