import { Query, Resolver } from "type-graphql";
import { Service } from "typedi";

@Service()
@Resolver()
export class CommonResolver {
  @Query(() => String)
  greeting() {
    return "Hello";
  }
}
