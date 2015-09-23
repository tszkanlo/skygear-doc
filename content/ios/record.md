+++
date = "2015-09-21T18:11:59+08:00"
draft = true
title = "Container, Databases and Records"

+++

## Saving a record

Let's imagine we are writing a To-Do app with Ourd. When user creates
an to-do item, we want to save that item on server. We probably will save that
to-do item like this:

```obj-c
ODRecord *todo = [ODRecord recordWithRecordType:@"todo"];
todo[@"title"] = @"Write documents for Ourd";
todo[@"order"] = @1;
todo[@"done"] = @NO;

ODDatabase *privateDB = [[ODContainer defaultContainer] privateCloudDatabase];
[privateDB saveRecord:todo completion:^(ODRecord *record, NSError *error) {
    if (error) {
        NSLog(@"error saving todo: %@", error);
        return;
    }

    NSLog(@"saved todo with recordID = %@", record.recordID);
}];
```

There are couples of things we have done here:

1. First we created a `todo` _record_ and assigned some attributes to it.
2. We fetched the _container_ of our app, and took a reference to the private
   database of the current user.
3. We actually saved the `todo` record and registered a block to be executed
   after the action is done.

We have mentioned _record_, _container_ and _database_. Let's look at them
one by one.

### ODRecord

`ODRecord` is a key-value data object which can be stored in a _database_. Each
record has a _type_, which describes what kind of data this record holds.

A record can store whatever values that's JSON-serializable, it include
strings, numbers, booleans, dates, plus several custom type that Ourd
supports (TODO: add references to other pages).

### ODContainer

`ODContainer` is the uppermost layer of `ODKit`. It represents the root of all
resources accessible by an application and one application should have exactly
one container. In `ODKit`, such container is accessed via the singleton
`defaultContainer`:

```obj-c
ODContainer *container = [ODContainer defaultContainer];
```

Container provides [User Authentication]({{< relref "user.md" >}}),
[Asset Storage]({{< relref "asset.md" >}}) and access to
[public and private databases]({{< relref "#ODDatabase" >}}).

### ODDatabase

`ODDatabase` is the central hub of data storage in `ODKit`. The main
responsibility of database is to store [records]({{< relref "#ODRecord" >}}),
the data storage unit in Ourd.

Every container has one _pubic database_, which stores data accessible to
every users. Every user also has its own _private database_, which stores data
only accessible to that user alone.

## Modifying a record

Now let's return to our to-do item example:

```obj-c
ODRecord *todo = [ODRecord recordWithRecordType:@"todo"];
todo[@"title"] = @"Write documents for Ourd";
todo[@"order"] = @1;
todo[@"done"] = @NO;

ODDatabase *privateDB = [[ODContainer defaultContainer] privateCloudDatabase];
[privateDB saveRecord:todo completion:^(ODRecord *record, NSError *error) {
    if (error) {
        NSLog(@"error saving todo: %@", error);
        return;
    }

    NSLog(@"saved todo with recordID = %@", record.recordID);
}];
```

If you run the code above, you console should show:

```
2015-09-22 16:16:37.893 todoapp[89631:1349388] saved todo with recordID = <ODRecordID: 0x7ff93ac37940; recordType = todo, recordName = 369067DC-BDBC-49D5-A6A2-D83061D83BFC>
```

The `recordID` property on your saved todo is an id which uniquely identifies
the record in a database. With it you can modify the record later on. Say if
you have to mark this todo as done:

```obj-c
ODRecord *todo = [ODRecord recordWithRecordType:@"todo" name:@"369067DC-BDBC-49D5-A6A2-D83061D83BFC"];
todo[@"done"] = @YES;
[privateDB saveRecord:todo completion:nil];
```

## Fetching an existing record

With the record ID we could also fetch the record from a database:

```obj-c
ODRecordID *recordID = [ODRecordID recordIDWithRecordType:@"todo" name:@"369067DC-BDBC-49D5-A6A2-D83061D83BFC"];
[privateDB fetchRecordWithID:recordID completionHandler:^(ODRecord *record, NSError *error) {
    if (error) {
        NSLog(@"error fetching todo: %@", error);
        return;
    }

    NSString *title = record[@"title"];
    NSNumber *order = record[@"order"];
    NSNumber *done = record[@"done"];

    NSLog(@"Fetched a note (title = %@, order = %@, done = %@)", title, order, done);
}];
```

## Deleting a record

Deleting a record requires its id too:

```obj-c
ODRecordID *recordID = [ODRecordID recordIDWithRecordType:@"todo" name:@"369067DC-BDBC-49D5-A6A2-D83061D83BFC"];
[privateDB deleteRecordWithID:recordID completionHandler:nil];
```

If you are to delete records in batch, you could also use the
`ODDatabase-deleteRecordsWithIDs:completionHandler:perRecordErrorHandler:`
method.

## Queries

We have shown how to fetch individual records by ids, but in real-world
application there are usually needs to show a list of items according to
some criteria. It is supported by queries in Ourd.

Let's see how to fetch a list of to-do items to be displayed in our
hypothetical To-Do app:

```obj-c
ODQuery *query = [ODQuery queryWithRecordType:@"todo" predicate:nil];

NSSortDescriptor *sortDescriptor = [NSSortDescriptor sortDescriptorWithKey:@"order" ascending:YES];
query.sortDescriptors = @[sortDescriptor];

[privateDB performQuery:query completionHandler:^(NSArray *results, NSError *error) {
    if (error) {
        NSLog(@"error querying todos: %@", error);
        return;
    }

    NSLog(@"Received %@ todos.", @(results.count));
    for (ODRecord *todo in results) {
        NSLog(@"Got a todo: %@", todo[@"title"]);
    }
}];
```

We constructed a `ODQuery` to search for `todo` records. There are no additional
criteria needed so we put the predicate to `nil`. Then we assigned a
`NSSortDescription` to ask Ourd to sort the `todo` records by `order` field
ascendingly.

`ODQuery` utilizes `NSPredicate` to apply filtering on query results. For
an overview of features support, please refer to the
[Query Guide]({{< relref "query.md" >}}).