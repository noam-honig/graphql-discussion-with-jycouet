# graphql-discussion-with-jycouet

## How to start?

```bash
pnpm i
pnpm dev
```

## TODOs

- [ ] where not in (nin?) TODO JYC
- [ ] Where OR
  - [x] typedefs
  - [x] resolver TODO Noam
- [ ] Where AND
  - [x] typedefs
  - [ ] resolver TODO Noam
- [ ] single entity query
  - [ ] typedefs (JYC TODO) => rmv hardcoded id
  - [ ] resolver
- [ ] Connection
  - [x] typedefs
  - [ ] resolver

a. need to check the field selection. (you can copy this:
https://github.com/jycouet/kitql/blob/main/packages/all-in/src/lib/graphql/helper.ts)

b. repending on the selection, build the object to return

c. depending on hasPrevious & hasNext, query 1 more infront and/or at the back

d. return the object

- [ ] node Interface
  - [x] typedefs
  - [ ]
- [ ] me query
  - [x] merge schema
  - [ ] To test with Auth (TODO JYC)
- [ ] api in context to not re create it at each resolver?
- [ ] dataloader (optimisation)
- [ ] @Field Virtual (resolving a primitive or an Entity or an Entity Virtual)
- [ ] @Entity Virtual
- [ ] Souscription

## Open questions

- How to add SQL logs?
- In the todo list, where to we set a v1? v2?

## Notes

- All what is needed on top of sveltekit skeleton is in dependencies

## Noam Question

- [ ] why create/update return an object with task member - why not return the task directly

## Noam thinks todo required

- [ ] on create and update operation
  - [ ] ,id of related entities
  - [ ] reflect in the schema the apiUpdateAllowed and includeInApi
  - [x] update
  - [x] create
  - [x] delete