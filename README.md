# graphql-discussion-with-jycouet

## How to start?

```bash
npm i
npm run dev
```

## TO DOs
- [x] remove page info from schema for v1
- [ ] on create and update operation
  - [ ] ,id of related entities
  - [ ] reflect in the schema the apiUpdateAllowed and includeInApi
  - [x] update
  - [x] create
  - [x] delete
- [x] # where not in (nin?) TODO JYC
- [ ] Where:
  - [ ] where not in (nin?)
    - [ ] typedefs
    - [ ] implementation
  - [ ] where in
    - [x] typedefs
    - [ ] resolver TODO Noam
  - [ ] Where OR
    - [x] typedefs
    - [x] resolver (TODO Noam)
  - [ ] Where AND
    - [x] typedefs
    - [ ] resolver (TODO Noam)
- [x] single entity query
  - [x] typedefs (JYC TODO) => rmv hardcoded id
  - [x] resolver
- [ ] node
  - [x] typedef JYC
  - [ ] resolver
- [ ] Test Request hack in graphql security - and test on all servers that security works
## JYC
- [ ] scalars (TODO JYC)
- [ ] throw new GraphQLError(`Forbidden`) (to speak about)




a. need to check the field selection. (you can copy this:
https://github.com/jycouet/kitql/blob/main/packages/all-in/src/lib/graphql/helper.ts)

b. repending on the selection, build the object to return

c. depending on hasPrevious & hasNext, query 1 more infront and/or at the back

d. return the object

- [ ] node Interface
  - [x] typedefs
  - [ ]
- [x] me query
  - [x] merge schema
  - [x] To test with Auth (TODO JYC)
- [ ] How to use defaultGetLimit in the graphql schema (at least in description)
- [ ] api in context to not re create it at each resolver?
- [ ] @Field Virtual (resolving a primitive or an Entity or an Entity Virtual) (server expression)
- [x] Connection items
- [ ] Scalars?! (JYC todo)

### v2

- [ ] Connection (args & sttructure)
  - [x] typedefs
  - [ ] resolver
- [ ] dataloader (optimisation)
- [ ] @Entity Virtual
- [ ] Subscriptions

## Open questions

- How to add SQL logs?
  - [x] `SqlDatabase.LogToConsole = true`
  - [ ] Share my clean SQL function?
  - [ ] Tune formats? (provide a function?)
- In the todo list, where to we set a v1? v2?
- Adding a nice log on db doesn't exist?
- Field enum? to have db Enums?
- Where to throw new GraphQLError(`Forbidden`)? (and all others?)
- speak about ! or not... (db migration?!)

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


