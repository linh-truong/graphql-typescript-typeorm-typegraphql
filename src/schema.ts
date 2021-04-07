import { buildSchemaSync } from "type-graphql";
import Container from "typedi";

const schema = buildSchemaSync({
  resolvers: [__dirname + "/resolvers/**/*.resolver.{ts,js}"],
  dateScalarMode: "isoDate",
  // register the 3rd party IOC container
  container: Container,
});

export default schema;
