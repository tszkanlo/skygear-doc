## Overview

Records can be retrieved from Skygear's Cloud DB using **queries**, they can
help you find records in your database based on simple predicates or conditions.

Internally, these skygear queries are transformed into SQL queries so users
familiar with SQL will feel right at home.

Let's say you have the following record in your `publicDB`:

```js
{
  recordType: "person",
  name: "bob",
  age: 20,
}
```

You can retrieve this record using the following code:

```js
// define record type "person"
const PersonRecord = skygear.Record.extend("person");
// create Query object
const bobQuery = new skygear.Query(PersonRecord)
  .equalTo("name", "bob");
// run query
const bobQueryPromise = skygear.publicDB.query(bobQuery);
```

`bobQueryPromise` is an [A+ Promise Object][] that either returns an array
of `person` records with the name "bob" or an error if the query operation
failed (e.g. due to network issues).


## Query Conditions

In the example above, we retrieved a record with the name "bob" using the
`.equalTo()` condition. Skygear supports many different conditions and you
can refine your queries by chaining these conditions. Here's an example that
retrieves all `person` records with an age range whose name begins with "b":

```js
const PersonRecord = skygear.Record.extend("person");
skygear.publicDB.query(
  new skygear.Query(PersonRecord)
    .greaterThan("age", 17)
    .lessThanOrEqualTo("age", 30)
    .caseInsensitiveLike("name", "b%")
).then(
  function(results) {
    // ...
  }
);
```

Here's a table of all the conditions that skygear currently supports:

| Condition               | JS Type | DB Type | Description                         |
|-------------------------|---------|---------|-------------------------------------|
| equalTo                 | any     | any     | Filter based on value equality      |
| notEqualTo              | "       | "       | "                                   |
| lessThan                | number  | number  | Filter based on numeric comparison  |
| lessThanOrEqualTo       | "       | "       | "                                   |
| greaterThan             | "       | "       | "                                   |
| greaterThanOrEqualTo    | "       | "       | "                                   |
| contains                | array   | any     | Filter based on set membership      |
| notContains             | "       | "       | "                                   |
| containsValue           | any     | array   | "                                   |
| notContainsValue        | "       | "       | "                                   |
| caseInsensitiveLike     | string  | string  | Filter based on string patten match |
| caseInsensitiveNotLike  | "       | "       | "                                   |


## Result Ordering & Pagination

You can have skygear sort the results returned in a query based on multiple
columns. Here's an example where we retrieve 30 oldest people from our
public database sorted by age (oldest first) and people with the same age
are sorted by their names:

```js
const PersonRecord = skygear.Record.extend("person");
const oldestPeopleQuery = new skygear.Query(PersonRecord)
  .addDescending("age")
  .addAscending("name");
oldestPeopleQuery.limit = 30;

skygear.publicDB.query(oldestPeopleQuery)
.then(
  function(results) {
    // ...
  }
);
```

Skygear queries have pagination support built-in. Say you want to display
the 6th page for 15 results per page, this is how you'd query the DB:

```js
const PersonRecord = skygear.Record.extend("person");
const paginatedPeopleQuery = new skygear.Query(PersonRecord);
paginatedPeopleQuery.limit = 15;
paginatedPeopleQuery.page = 6;

skygear.publicDB.query(paginatedPeopleQuery)
.then(
  function(results) {
    // ...
  }
);
```

**NOTE:** The `limit` attribute has an implicit value of `50` if none is set.

## Result Compliment & Union

For more advanced queries, skygear provides 2 helper function:

- `skygear.Query.not(query);` will return a query whose results are the set
  compliment of the original query.
- `skygear.Query.or(query1, query2)` will return a query whose results are
  the union of of the 2 queries.

Here's 2 ways of which you could retrieve all people whose age is below 18
or above 30:

```js
const PersonRecord = skygear.Record.extend("person");

// using compliment
skygear.publicDB.query(
  skygear.Query.not(
    new skygear.Query(PersonRecord)
      .greaterThanOrEqualTo("age", 18)
      .lessThanOrEqualTo("age", 30)
  )
);

// using union
skygear.publicDB.query(
  skygear.Query.or(
    new skygear.Query(PersonRecord).lessThan("age", 18),
    new skygear.Query(PersonRecord).greaterThan("age", 30)
  )
);
```
