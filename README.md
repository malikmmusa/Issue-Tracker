# [Issue Tracker](https://www.freecodecamp.org/learn/quality-assurance/quality-assurance-projects/issue-tracker)

You can run this [here](https://replit.com/@malikmmusa/boilerplate-project-issuetracker#.replit)

This is an issue tracker that allows you to CREATE new issue tickets, UPDATE existing issue tickets, and DELETE issue tickets

Example GET usage:
/api/issues/{project}
/api/issues/{project}?open=true&assigned_to=Joe
Example return
[
  { 
    "_id": "5871dda29faedc3491ff93bb",
    "issue_title": "Fix error in posting data",
    "issue_text": "When we post data it has an error.",
    "created_on": "2017-01-08T06:35:14.240Z",
    "updated_on": "2017-01-08T06:35:14.240Z",
    "created_by": "Joe",
    "assigned_to": "Joe",
    "open": true,
    "status_text": "In QA"
  },
  ...
 ]

