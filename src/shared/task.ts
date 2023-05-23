import { Entity, Field, Fields } from "remult";
import { Category } from "./Category";

@Entity("tasks", {
  allowApiCrud: true,
})
export class Task {
  // @Fields.cuid()
  @Fields.autoIncrement()
  id = 0;
  @Fields.string({ caption: "The Title" })
  title = "";
  @Fields.boolean({ caption: "Is it completed?" })
  completed = false;
  @Field(() => Category, { allowNull: true })
  category?: Category;
}
