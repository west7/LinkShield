import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const LinkShieldModule = buildModule("LinkShieldModule", (m) => {
    const initial_msg = "Hello World!";
    const contract = m.contract("LinkShieldContract", [initial_msg]);

    return { contract };
});

export default LinkShieldModule;