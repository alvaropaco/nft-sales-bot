import openSea from "./openSea";
import openSeaSaleTx from "./__fixtures__/openSeaSaleTx";
import openSeaSale2Tx from "./__fixtures__/openSeaSale2Tx";
import openSeaSale3Tx from "./__fixtures__/openSeaSale3Tx";
import openSeaBidTx from "./__fixtures__/openSeaBidTx";
import { Connection } from "@solana/web3.js";

jest.mock("helpers/solana/NFTData", () => {
  return {
    fetchNFTData: () => {
      return {};
    },
  };
});

describe("openSea", () => {
  const conn = new Connection("https://test/");

  test("itemUrl", () => {
    expect(openSea.itemURL("xxx1")).toEqual(
      "https://opensea.io/assets/solana/xxx1"
    );
  });

  describe("parseNFTSale", () => {
    test("sale transaction should return NFTSale", async () => {
      const sale = await openSea.parseNFTSale(conn, openSeaSaleTx);
      if (!sale) {
        fail("did not return NFTSale");
      }
      expect(sale.transaction).toEqual(
        "3uCUHGPcXJGA4c1fwwY2hn4pdfLYqUuqACqGHaWhPjCqt8YJrZ63QQrPqFn56qe3QEoL7BJtvQA8VuTCV4QPrEA2"
      );
      expect(sale.token).toEqual(
        "CL8vqe2dL8Khh1fZtzSZL6DcXweSkdzGVS4t8LbmBh14"
      );
      expect(sale.soldAt).toEqual(new Date(1649206880 * 1000));
      expect(sale.marketplace).toEqual(openSea);
      expect(sale.getPriceInLamport()).toEqual(94000000000);
      expect(sale.getPriceInSOL()).toEqual(94);
    });
    test("sale transaction v2 should return NFTSale", async () => {
      const sale = await openSea.parseNFTSale(conn, openSeaSale2Tx);
      if (!sale) {
        fail("did not return NFTSale");
      }
      expect(sale.transaction).toEqual(
        "4frBMA4q4i11YxxpqNhFaygRuC6wa1XW8KHJwMWCCp3C6piXAWmSGinot7XiBXPqTTcnLGJkgag9Kvuz4gkiMrnX"
      );
      expect(sale.token).toEqual(
        "CiRHyMF2zUdfqJ5x6ixQnDiPJw4CcWWGmdqS2YQiFd88"
      );
    });
    test("sale transaction v3 should return NFTSale", async () => {
      const sale = await openSea.parseNFTSale(conn, openSeaSale3Tx);
      if (!sale) {
        fail("did not return NFTSale");
      }
      expect(sale.transaction).toEqual(
        "66EfiWJrPWzdu4BqFAff1Eov7JQfUrfMbmmxAKEx6QqrS2D6zm5XbsCP5yq3RnaUzUDxc5tWJBChBjmhWNFXzmaR"
      );
      expect(sale.token).toEqual(
        "FfiAdK89m762LxdCQTjdKB4qyH77PMzhgt2wbP5SGg6V"
      );
    });
    test("non-sale transaction should return null", async () => {
      const invalidSaleTx = {
        ...openSeaSaleTx,
        meta: {
          ...openSeaSaleTx.meta,
          preTokenBalances: [],
          postTokenBalances: [],
        },
      };
      expect(await openSea.parseNFTSale(conn, invalidSaleTx)).toBe(null);
    });
    test("bidding transaction should return null", async () => {
      expect(await openSea.parseNFTSale(conn, openSeaBidTx)).toBe(null);
    });
    test("non OpenSea transaction", async () => {
      const invalidSaleTx = {
        ...openSeaSaleTx,
      };
      invalidSaleTx.meta.logMessages = ["Program xxx invoke [1]"];
      expect(await openSea.parseNFTSale(conn, invalidSaleTx)).toBe(null);
    });
  });
});
