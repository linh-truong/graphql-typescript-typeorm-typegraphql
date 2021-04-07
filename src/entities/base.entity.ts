import { Field, ID, ObjectType } from "type-graphql";
import {
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  BeforeInsert,
} from "typeorm";
import { ulid } from "ulid";

@ObjectType({ isAbstract: true })
export abstract class AppEntity {
  @PrimaryColumn()
  @Field(() => ID)
  id: string;

  @CreateDateColumn({ type: "timestamptz" })
  @Field(() => Date)
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  @Field(() => Date)
  updatedAt: Date;

  @BeforeInsert()
  setIdIfNotExists() {
    if (!this.id) {
      this.id = ulid().toLowerCase();
    }
  }
}
