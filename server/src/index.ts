import { Elysia, t, } from "elysia";

import { cors } from "@elysiajs/cors";
import { staticPlugin } from '@elysiajs/static'


type Temperature = { on: boolean, min: number, max: number }

export interface GroupData {
  name: string;
  description: string;
  criteria: { from: string[], to: string[] };
  alertRules: { shipment: boolean, temperature: Temperature };
}

export type Group = {
  priority: number;
  groupId: string;
} & GroupData


t.Object({
  on: t.Boolean(),
  min: t.Number(),
  max: t.Number(),
})

const temperature = t.Union([t.Object({
  on: t.Boolean(),
  min: t.Number(),
  max: t.Number(),
}), t.Object({
  on: t.Boolean()
})]);

// Define GroupData type
const GroupData = t.Object({
  name: t.String(),
  description: t.String(),
  criteria: t.Object({
    from: t.Array(t.String(), { minItems: 1 }),
    to: t.Array(t.String(), { minItems: 1 }),
  }),
  alertRules: t.Object({
    shipment: t.Boolean(),
    temperature: temperature,
  }),
});

const GROUPS_FILES = "public/groups.json"
console.log();

const readActionWrite = (action: (groups: Group[], ...optionalParams: any[]) => Group[], ...optionalParams: any[]) => // better typing 
  Bun.file(GROUPS_FILES).json().then((groups: Group[]) => action(groups, ...optionalParams)).then(filteredGroups => Bun.write(GROUPS_FILES, filteredGroups))

const app = new Elysia()
  .use(staticPlugin())
  .use(cors())
  .get("/groups/", () => Bun.file(GROUPS_FILES))
  .put("/group/"
    , async ({ body }) => { console.log(body); return Bun.write(GROUPS_FILES, JSON.stringify(body)) }
    , { body: t.Array(GroupData) })
  .post("/group/"
    , async ({ body }) => {
      console.log(body)
      return readActionWrite((groups: Group[], body: GroupData) => {

        if (body.alertRules.temperature.on && body.alertRules.temperature.min > body.alertRules.temperature.max) {
          throw "Invalid range: min is greater than max"
        }


        return JSON.stringify(groups.concat({ ...body, groupId: Date.now().toString(), priority: groups.length + 1 }))
      }, body)
    }
    , { body: GroupData }
  )
  .delete("/group/:id", ({ params: { id } }) => readActionWrite((groups: Group[], id: number) => groups.filter((group: any) => group.groupId != id), id))
  .listen(3000);

console.log(
  `webcam saver is running at ${app.server?.hostname}:${app.server?.port}`
);
