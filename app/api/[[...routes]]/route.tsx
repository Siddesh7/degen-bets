/** @jsxImportSource frog/jsx */
import {SUPPORTED_TOKENS} from "@/app/constants";
import Bet from "@/app/models/bet";
import {getTokenPrice} from "@/app/utils";
import connectToDatabase from "@/lib/db";
import {Button, Frog, parseEther, TextInput} from "frog";
import {devtools} from "frog/dev";
import {handle} from "frog/next";
import {serveStatic} from "frog/serve-static";
import {MoveDownIcon, MoveUpIcon} from "lucide-react";

const app = new Frog({
  basePath: "/api",
});

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

app.frame("/:id", async (c) => {
  const {id} = c.req.param();
  await connectToDatabase();
  const bet = await Bet.findOne({_id: id});

  const price = await getTokenPrice(
    SUPPORTED_TOKENS[bet.token.toUpperCase() as string]
  );

  console.log(bet.totalBetAmount);

  return c.res({
    image: (
      <div
        style={{
          alignItems: "center",

          backgroundSize: "cover",
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          height: "100vh",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
          background: "#8d67e7db",
        }}
      >
        <h1
          style={{
            color: "#fff",
            fontSize: "4rem",
            fontWeight: "bold",
            padding: "20px 40px",
            background: "#9369f3",
            borderRadius: "40px",
            marginBottom: "20px",
          }}
        >
          {bet.bet}
        </h1>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "20px",
            justifyContent: "center",
          }}
        >
          <h2
            style={{
              color: "#FFFFFF",
              fontSize: "2rem",
              fontStyle: "normal",
              letterSpacing: "-0.025em",
              background: "#9369f3",
              padding: "10px 20px",
              borderRadius: "20px",
              lineHeight: 1.4,
              marginBottom: "30px",
              textShadow: "1px 1px 2px #000000",
              fontWeight: "900",
            }}
          >
            Price Target: ${bet.priceTarget / 10 ** 4}
          </h2>{" "}
          <h2
            style={{
              color: "#FFFFFF",
              fontSize: "2rem",
              fontStyle: "normal",
              letterSpacing: "-0.025em",
              background: "#9369f3",
              padding: "10px 20px",
              borderRadius: "20px",
              lineHeight: 1.4,
              marginBottom: "30px",
              textShadow: "1px 1px 2px #000000",
              fontWeight: "900",
            }}
          >
            Current Price: ${price}
          </h2>
        </div>{" "}
        <p
          style={{
            color: "#ffffff",
            fontSize: "2rem",
            fontStyle: "normal",
            letterSpacing: "-0.025em",

            borderRadius: "20px",
            lineHeight: 1.4,
            marginBottom: "30px",
            textShadow: "1px 1px 2px #000000",
          }}
        >
          Deadline {new Date(bet.deadline).toLocaleString() ?? "No deadline"}{" "}
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "20px",
            marginBottom: "35px",
          }}
        >
          {bet.totalBetAmount > 0 && (
            <p
              style={{
                color: "#FFFFFF",
                fontSize: "2rem",
                fontStyle: "normal",
                letterSpacing: "-0.025em",
                background: "#9369f3",
                padding: "10px 20px",
                borderRadius: "20px",
                lineHeight: 1.4,
                marginBottom: "30px",
                textShadow: "1px 1px 2px #000000",
              }}
            >
              Total Bets: ${bet.totalBetAmount ?? 0}
            </p>
          )}
          {bet.buyers.length > 0 && (
            <p
              style={{
                color: "#6fff00",
                fontSize: "2rem",
                fontStyle: "normal",
                letterSpacing: "-0.025em",
                background: "#9369f3",
                padding: "10px 20px",
                borderRadius: "20px",
                lineHeight: 1.4,
                marginBottom: "30px",
              }}
            >
              Total Buys: {bet.buyers.length ?? 0}
            </p>
          )}
          {bet.sellers.length > 0 && (
            <p
              style={{
                color: "#000000",
                fontSize: "2rem",
                fontStyle: "normal",
                letterSpacing: "-0.025em",
                background: "#9369f3",
                padding: "10px 20px",
                borderRadius: "20px",
                lineHeight: 1.4,
                marginBottom: "30px",
              }}
            >
              Total Sells: {bet.sellers.length ?? 0}
            </p>
          )}
        </div>
        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: "10",
            flexDirection: "row",
            gap: "20px",
            justifyContent: "center",
            width: "94%",
          }}
        >
          <button
            style={{
              backgroundColor: "#5bd45f",
              border: "none",
              borderRadius: "20px",
              color: "white",
              padding: "15px 30px",
              fontSize: "48px",
              width: "50%",
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Bet Yes
          </button>
          <button
            style={{
              backgroundColor: "#ed584d",
              border: "none",
              borderRadius: "20px",
              color: "white",
              padding: "15px 30px",
              fontSize: "48px",
              width: "50%",
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Bet No
          </button>
        </div>
      </div>
    ),
    intents: [
      // eslint-disable-next-line react/jsx-key
      <Button.Transaction
        target={`/bet/yes/${id}`}
        action={`/success/yes/${id}`}
      >
        Bet Yes $5
      </Button.Transaction>,
      // eslint-disable-next-line react/jsx-key
      <Button.Transaction target={`/bet/no/${id}`} action={`/success/no/${id}`}>
        Bet No $5
      </Button.Transaction>,
    ],
  });
});

app.transaction("/bet/:type/:id", async (c) => {
  const degenPrice: any = await getTokenPrice(SUPPORTED_TOKENS.DEGEN);

  const perBetAmount = 5 / degenPrice;

  return c.contract({
    abi: [
      {
        inputs: [
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        name: "transfer",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    chainId: "eip155:8453",
    functionName: "transfer",
    args: [
      "0x95247C745dEFCc78F68f82A3A92b1cD2061DF229",
      parseEther(perBetAmount.toString() as `0x${string}`),
    ],
    to: SUPPORTED_TOKENS.DEGEN as `0x${string}`,
  });
});

app.frame("/success/:type/:id", async (c) => {
  const {id, type} = c.req.param();
  await connectToDatabase();
  const bet = await Bet.findOne({_id: id});

  const price = await getTokenPrice(
    SUPPORTED_TOKENS[bet.token.toUpperCase() as string]
  );

  const {frameData} = c;

  const fid = frameData?.fid ?? "0";
  bet.totalBetAmount += 5;
  if (type === "yes") {
    bet.buyers.push(fid);
  } else {
    bet.sellers.push(fid);
  }
  await bet.save();

  return c.res({
    image: (
      <div
        style={{
          alignItems: "center",

          backgroundSize: "cover",
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          height: "100vh",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
          background: "#8d67e7db",
        }}
      >
        <h1
          style={{
            color: "#fff",
            fontSize: "4rem",
            fontWeight: "bold",
            padding: "20px 40px",
            background: "#9369f3",
            borderRadius: "40px",
            marginBottom: "20px",
          }}
        >
          {bet.bet}
        </h1>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "20px",
            justifyContent: "center",
          }}
        >
          <h2
            style={{
              color: "#FFFFFF",
              fontSize: "2rem",
              fontStyle: "normal",
              letterSpacing: "-0.025em",
              background: "#9369f3",
              padding: "10px 20px",
              borderRadius: "20px",
              lineHeight: 1.4,
              marginBottom: "30px",
              textShadow: "1px 1px 2px #000000",
              fontWeight: "900",
            }}
          >
            Price Target: ${bet.priceTarget / 10 ** 4}
          </h2>{" "}
          <h2
            style={{
              color: "#FFFFFF",
              fontSize: "2rem",
              fontStyle: "normal",
              letterSpacing: "-0.025em",
              background: "#9369f3",
              padding: "10px 20px",
              borderRadius: "20px",
              lineHeight: 1.4,
              marginBottom: "30px",
              textShadow: "1px 1px 2px #000000",
              fontWeight: "900",
            }}
          >
            Current Price: ${price}
          </h2>
        </div>{" "}
        <p
          style={{
            color: "#ffffff",
            fontSize: "2rem",
            fontStyle: "normal",
            letterSpacing: "-0.025em",

            borderRadius: "20px",
            lineHeight: 1.4,
            marginBottom: "30px",
            textShadow: "1px 1px 2px #000000",
          }}
        >
          Deadline {new Date(bet.deadline).toLocaleString() ?? "No deadline"}{" "}
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "20px",
            marginBottom: "35px",
          }}
        >
          {bet.totalBetAmount > 0 && (
            <p
              style={{
                color: "#FFFFFF",
                fontSize: "2rem",
                fontStyle: "normal",
                letterSpacing: "-0.025em",
                background: "#9369f3",
                padding: "10px 20px",
                borderRadius: "20px",
                lineHeight: 1.4,
                marginBottom: "30px",
                textShadow: "1px 1px 2px #000000",
              }}
            >
              Total Bets: {bet.totalBetAmount ?? 0}
            </p>
          )}
          {bet.buyers.length > 0 && (
            <p
              style={{
                color: "#6fff00",
                fontSize: "2rem",
                fontStyle: "normal",
                letterSpacing: "-0.025em",
                background: "#9369f3",
                padding: "10px 20px",
                borderRadius: "20px",
                lineHeight: 1.4,
                marginBottom: "30px",
              }}
            >
              Total Buys: {bet.buyers.length ?? 0}
            </p>
          )}
          {bet.sellers.length > 0 && (
            <p
              style={{
                color: "#000000",
                fontSize: "2rem",
                fontStyle: "normal",
                letterSpacing: "-0.025em",
                background: "#9369f3",
                padding: "10px 20px",
                borderRadius: "20px",
                lineHeight: 1.4,
                marginBottom: "30px",
              }}
            >
              Total Sells: {bet.sellers.length ?? 0}
            </p>
          )}
        </div>
        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: "10",
            flexDirection: "row",
            gap: "20px",
            justifyContent: "center",
            width: "94%",
            background: "#9369f3",
            padding: "20px",
            borderRadius: "20px",
          }}
        >
          Bid Placed Successfully
        </div>
      </div>
    ),
    intents: [
      // eslint-disable-next-line react/jsx-key
      <Button.Redirect location={`https://degen-bets.vercel.app/`}>
        Visit Degen Bet
      </Button.Redirect>,
    ],
  });
});
devtools(app, {serveStatic});
export const GET = handle(app);
export const POST = handle(app);
