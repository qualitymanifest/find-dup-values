const { ValueMap } = require("./index");

describe("ValueMap", () => {
  it("Converts number and string values to JSON", () => {
    const expected = {
      values: [
        {
          data: 123,
          total: 2,
          paths: {
            "/home/username/etc.js": 2
          }
        },
        {
          data: "abc",
          total: 3,
          paths: {
            "/home/username/etc.js": 2,
            "/home/username/other.js": 1
          }
        }
      ]
    };
    const valueMap = new ValueMap();
    valueMap.addValues(["abc", "abc", 123, 123], "/home/username/etc.js");
    valueMap.addValues(["abc"], "/home/username/other.js");
    expect(valueMap.toJSON()).toEqual(expected);
  });
});
