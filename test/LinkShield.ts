import { expect } from "chai";
import { ethers } from "hardhat";
import { LinkShield } from "../typechain-types";

describe("LinkShield", function () {
    let linkShield: LinkShield;
    let owner: any;
    let user1: any;
    let user2: any;

    beforeEach(async function () {
        [owner, user1, user2] = await ethers.getSigners();

        const LinkShield = await ethers.getContractFactory("LinkShield");
        linkShield = await LinkShield.deploy();
    });

    it("Deve permitir criar Link gratuito!", async () => {
        await linkShield.createLink("https://google.com", "ggl", 0);

        const link = await linkShield.getLink("ggl");
        expect(link.url).to.equal("https://google.com");
        expect(link.owner).to.equal(owner.address);
        expect(link.fee).to.equal(0);
    });

    it("Deve esconder a URL para quem não pagou!", async () => {
        await linkShield.connect(owner).createLink("https://secret.com", "s", ethers.parseEther("0.01"));
        const link = await linkShield.connect(user1).getLink("s");
        expect(link.url).to.equal("");

        const link2 = await linkShield.connect(owner).getLink("s");
        expect(link2.url).to.equal("https://secret.com");
    });

    it("Deve permitir a compra de um link", async () => {
        const fee = ethers.parseEther("0.01");

        await linkShield.connect(owner).createLink("https://secret.com", "s1", fee);
        const tx = await linkShield.connect(user1).buyLink("s1", {
            value: fee,
        });

        await tx.wait();

        const link = await linkShield.connect(user1).getLink("s1");
        expect(link.url).to.equal("https://secret.com");
        const access = await linkShield.hasAccess("s1", user1.address);
        expect(access).to.equal(true);
    });

})