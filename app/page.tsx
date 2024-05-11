"use client";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {usePrivy} from "@privy-io/react-auth";
import {useState} from "react";
import {SUPPORTED_TOKENS} from "./constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Terminal} from "lucide-react";

export default function Home() {
  const {authenticated, user, login, ready} = usePrivy();
  const [bet, setBet] = useState({
    bet: "",
    priceTarget: "",
    token: "",
    deadline: "",
  });
  const [status, setStatus] = useState<any>();
  const create = async () => {
    console.log(bet);
    const res = await fetch("/api/bet", {
      method: "POST",
      body: JSON.stringify({
        owner: user?.wallet?.address,
        ...bet,
      }),
    });
    const data = await res.json();

    if (data.error) {
      setStatus({
        _id: "",
        bet: "",
        priceTarget: "",
        token: "",
        deadline: "",
        error: true,
      });
    } else
      setStatus({
        _id: data.bet._id,
        bet: data.bet.bet,
        priceTarget: data.bet.priceTarget,
        token: data.bet.token,
        deadline: data.bet.deadline,
        error: false,
      });
  };
  return (
    <>
      {authenticated ? (
        <main className="flex flex-col justify-center items-center gap-2 mt-[100px]">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Create a bet
          </h2>
          <div className="flex flex-col gap-2 w-[400px]">
            <Input
              type="text"
              placeholder="$degen will hit $0.05 by this month"
              onChange={(e) => setBet({...bet, bet: e.target.value})}
              value={bet.bet}
            />
            <Input
              type="text"
              placeholder="0.05"
              onChange={(e) => setBet({...bet, priceTarget: e.target.value})}
              value={bet.priceTarget}
            />
            <Select onValueChange={(value) => setBet({...bet, token: value})}>
              <SelectTrigger className="">
                <SelectValue placeholder="Select token" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={SUPPORTED_TOKENS.DEGEN}>DEGEN</SelectItem>
                <SelectItem value={SUPPORTED_TOKENS.AERO}>AERO</SelectItem>
                <SelectItem value={SUPPORTED_TOKENS.ETH}>ETH</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="text"
              placeholder="Unix Millisecond Timestamp"
              onChange={(e) => setBet({...bet, deadline: e.target.value})}
              value={bet.deadline}
            />
          </div>

          <Button className="w-40" onClick={create}>
            Create
          </Button>

          {status && (
            <Alert>
              <Terminal className="h-4 w-4" />
              <AlertTitle>
                {status?.error
                  ? "Something went wrong, try again"
                  : "Successfully created"}
              </AlertTitle>
              <AlertDescription>
                {status?.error
                  ? "try again"
                  : `${process.env.NEXT_PUBLIC_BASE_URL}/${status?._id}`}
              </AlertDescription>
            </Alert>
          )}
        </main>
      ) : (
        <main className="flex flex-col justify-center items-center gap-2 mt-[100px]">
          <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
            Welcome to Degen Bets
          </h2>

          <Button onClick={login} className="w-40" disabled={!ready}>
            Login
          </Button>
        </main>
      )}
    </>
  );
}
