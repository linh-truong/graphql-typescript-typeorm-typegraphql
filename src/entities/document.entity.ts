import { Field, ObjectType, registerEnumType } from "type-graphql";
import { Column, Entity, ManyToOne } from "typeorm";

import { AppEntity } from "./base.entity";
import { Profile } from "./profile.entity";

export enum DocumentType {
  INSURANCE = "INSURANCE",
}
registerEnumType(DocumentType, { name: "DocumentType" });

@Entity("documents")
@ObjectType()
export class Document extends AppEntity {
  @Column()
  @Field()
  filename: string;

  @Column()
  @Field()
  url: string;

  @Column({
    type: "enum",
    enum: DocumentType,
  })
  @Field(() => DocumentType)
  type: DocumentType;

  @ManyToOne(() => Profile, ({ documents }) => documents, {
    onDelete: "CASCADE",
  })
  profile: Profile;
}
