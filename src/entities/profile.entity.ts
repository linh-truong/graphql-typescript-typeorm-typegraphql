import { Field, ObjectType } from "type-graphql";
import { Column, Entity, OneToMany } from "typeorm";

import { AppEntity } from "./base.entity";
import { Document } from "./document.entity";

@Entity("profiles")
@ObjectType()
export class Profile extends AppEntity {
  @Column()
  @Field()
  firstName: string;

  @Column()
  @Field()
  lastName: string;

  @OneToMany(() => Document, ({ profile }) => profile)
  @Field(() => [Document])
  documents: Document[];
}
