import { Query, Resolver } from "type-graphql";
import { Service } from "typedi";

@Service()
@Resolver()
export default class CommonResolver {
  @Query(() => String)
  greeting() {
    return "Hello";
  }
}
