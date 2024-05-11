import {type ClassValue, clsx} from "clsx";
import {twMerge} from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const getTokenPrice = async (token: string) => {
  const response = await fetch(
    `https://base.api.0x.org/swap/v1/price?sellToken=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913&buyToken=${token}&sellAmount=10000000`,
    {
      headers: {
        "Content-Type": "application/json",
        "0x-api-key": "e857f137-2c2d-4fd2-9dee-f0836f497c5c",
      },
    }
  );
  const data = await response.json();

  const price = 1 / data.price;
  return price.toFixed(4);
};
