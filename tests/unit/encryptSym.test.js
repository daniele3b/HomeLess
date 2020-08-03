const { cipherSym } = require("../../helper/encryptSym");

describe("CipherSym", () => {
  it("should cipher an object with symmetric crittography", () => {
    data2encrypt = { name: "Name", surname: "Surname" };
    let encrypted = cipherSym(data2encrypt);

    expect(encrypted).toEqual(expect.not.stringContaining("Name"));
    expect(encrypted).toEqual(expect.not.stringContaining("Surname"));
  });
});
