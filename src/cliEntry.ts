import minimist from "minimist";

import main from "./main";
import { ValueList } from "./ValueList";

const args: any = minimist(process.argv.slice(2));

if (args.i) {
  args.i = args.i.split(",");
}
if (args.e) {
  args.e = args.e.split(",");
}

main(args)
  .then((valueList: ValueList) => {
    valueList.print();
  })
  .catch((err: Error) => {
    throw err;
  });
