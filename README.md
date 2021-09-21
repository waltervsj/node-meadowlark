== Site ==

    *cd /app/src
    *node meadowlark.js

    http://localhost:8081/
    Or
    http://site.localhost:8081/

    # Routes:
        - /about
        - /newsletter
        - /request/headers
        - /contest/vacation-photo
        - /fail
        - /epic-fail

== API ==

    Single

    *cd /api/src
    *node server.js

    Clustered

    *cd /api/src
    *node server_cluster.js


    https://localhost:8090/

    # Resources

        - /api/process
        - /api/contest/vacation-photo/:year/:month
        - /api/tours
        - /api/mail/:to
