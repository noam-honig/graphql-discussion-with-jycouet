# graphql-discussion-with-jycouet

## How to start?

```bash
npm i
npm run dev
```

## TO DOs

- [x] remove page info from schema for v1
- [x] respect include in api
- [x] Test fetch tasks of categories
- [x] on create and update operation
  - [x] ,id of related entities
  - [x] reflect in the schema the apiUpdateAllowed and includeInApi
  - [x] update
  - [x] create
  - [x] delete
- [x] # where not in (nin?) TODO JYC
- [x] Where:
  - [x] where not in (nin?)
    - [x] typedefs
    - [x] implementation
  - [x] where in
    - [x] typedefs
    - [x] resolver TODO Noam
  - [x] Where OR
    - [x] typedefs
    - [x] resolver (TODO Noam)
  - [x] single entity query
  - [x] typedefs (JYC TODO) => rmv hardcoded id
  - [x] resolver
- [x] node
  - [x] typedef JYC
  - [x] resolver
- [x] remove "express"?
- [ ] Test Request hack in graphql security - and test on all servers that security works
- [ ] fix that loading of child entities will not cause getUser or init request again
- [x] node Interface
  - [x] typedefs
  - [x] resolvers
- [x] me query
  - [x] merge schema
  - [x] To test with Auth (TODO JYC)
- [ ] How to use defaultGetLimit in the graphql schema (at least in description)
- [ ] api in context to not re create it at each resolver?
- [ ] @Field Virtual (resolving a primitive or an Entity or an Entity Virtual) (server expression)
- [x] Connection items

## JYC

- [ ] scalars (TODO JYC)
- [ ] throw new GraphQLError(`Forbidden`) (GraphQL Error signature)

### v later

- [ ] Better support for Compound column id entities
- [ ] support for id columns that are not called id
- [ ] Connection (args & structure)
  - [x] typedefs
  - [ ] resolver
- [ ] dataloader (optimisation)
- [ ] @Entity Virtual
- [ ] Subscriptions
- [ ] Where
  - [ ] Where AND - any filter can be expressed without it, since you can set .lt and .gt in the
        same filter and it'll work - so leaving that out for now
    - [x] typedefs
    - [ ] resolver (TODO Noam)
  - [ ] contains
  - [ ] null
  - [ ] filter on ref type id
- [ ] JSON db migration?
  - When I add a `createdAt` that is non null, how to migrate all previous rows?
    - [ ] in db
    - [ ] in JSON
- [ ] remove tripple Auth
  - [ ] add a resolver to know who is connected (me? currentUser?)

## Open questions

- How to add SQL logs?
  - [x] `SqlDatabase.LogToConsole = true`
  - [ ] Share my clean SQL function?
  - [ ] Tune formats? (provide a function?)
- Adding a nice log on db doesn't exist?
- Field enum? to have db Enums?

## Notes

- All what is needed on top of sveltekit skeleton is in dependencies

## Noam Question

- [x] why create/update return an object with task member - why not return the task directly
  - [x] Because, we should add a `clientMutationId` that is both in input and output (just pass it
        through). Some GraphQL Client use this feature. (JYC todo)
- [x] Do we need to implement the \_\_type as specified at:
      https://relay.dev/graphql/connections.htm#sec-Reserved-Types
  - [x] Already handled by yoga (introspection)
- [x] Should category connection return a task connection at it's tasks?
  - [x] Yes, good idea. (JYC todo)
  - [x] items (JYC todo)
