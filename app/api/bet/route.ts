import Bet from "@/app/models/bet";
import connectToDatabase from "@/lib/db";
import {NextResponse} from "next/server";

export const POST = async (req: any) => {
  const {owner, bet, priceTarget, token, deadline} = await req.json();
  console.log(owner, bet, priceTarget, token, deadline);
  if (!owner || !bet || !priceTarget || !token) {
    return NextResponse.json({error: "Missing fields"});
  }
  try {
    await connectToDatabase();
    const newBet = await Bet.create({
      owner,
      bet,
      priceTarget,
      yesBets: 0,
      noBets: 0,
      totalBetAmount: 0,
      token,
      deadline,
    });

    return NextResponse.json({bet: newBet, status: 200});
  } catch (error) {
    return NextResponse.json({error: error, status: 500});
  }
};

export const GET = async (req: any) => {
  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get("id");
  try {
    await connectToDatabase();
    if (id) {
      const bet = await Bet.findOne({_id: id});
      return NextResponse.json({bet, status: 200});
    }
    const bets = await Bet.find();
    return NextResponse.json({bets, status: 200});
  } catch (error) {
    return NextResponse.json({error: error, status: 500});
  }
};
