**** Elastic Search ****
    ** About
        written in Java making it cross-platform
        takes data from anything and make it searchable, works with schema-less JSON docs
        works with http-rest-api, easy to use
        real-time search, changes are saved faster and the search gives result near-real time since the update
        work with clusters, group of node serves that provides the indexing for the data
            * given a search no need to worry on what node it is stored in
        index => is a database within a relationship detabase system, can define many indexes in a cluster, name must be lowercased
            * has types inside it like user (likr a table), type has a name and mapping
            * mapping is like a schema for a table
            * document is like a row
            * shard => index that been divided to multiple pieces, each piece is a shard, useful to split big indexes into different disks
            * replica => copy of a shard (backup), is never stored in the same node(server)
        ** Searching
            Relevance and score
                calculate a score for a document on a query
                    queries in the context => "how well does the document match?"
                    queries in the filter => "does the document match?"
                filter do not affect the score
            Query structure types
                string => http://...../_search?q=pasta
                DSL => uery define in JSON {"query":{"match": {"name":"pasta"}}}
            Queries searching types
                Leaf => example looks for instance of "pasta" in product names
                Compound => wrap leaf clauses and other compound clauses, like a JOIN, combine multiple quieries
                Full text => run full text on text-fields, example products with the name "Pasta"
                Term => example : find people who were born between 1980 to 2000
                Joining => example : has_child and has_parent queries
    ** Code
            use kabana website for searching in development
            return acknowledged: true if there was a success in the request, or success inside shard
        create index
            PUT /myindex
            {
                "mappings": { // like tables map
                    "product": { // like a table
                        "properties": { // like columns, but can have arrays and be more complicated
                            "name": {
                                "type": "string"
                            },
                            "price": {
                                "type": "double"
                            },
                            "categories": { // will be an array of nested objects inside the "object"
                                "type": "nested",
                                "properties": {
                                    "name": {
                                        "type": "string"
                                    }
                                }
                            }
                        }
                    }
                }
            }
            the curl request will be http://....../myindex"-d'{....}'"
        get index info
            GET /_something/myindex , health yellow (not yet allocated until it has things in it)
        delete index
            DELETE /myindex
        Adding document(like a row) to index
            PUT /myindex/product/{id}
            {
                "name": "some name...",
                "price": 3545.543,
                "categories": [
                    {"name": "software"}
                ]
            }
        updating document
            POST /myindex/product/{id}/_update
            {
                "doc": {
                    "price": 334.00
                }
            }
        delete document
            DELETE /myindex/product/{id}
                there's a plugin called delete-by-query
        ****_bulk request
                // to improve performance change multiple things at once, if one of the lines fails the _bulk continues
        add multiple documents
            POST /myindex/product/_bulk
            {"index":"_id":"3333"}
                {"name":"something", ......}
            {"index":"_id":"334"}
                {"name":"something else", .....}
        update/delete multiple documents
            POST /myindex/product/_bulk
            {"delete": {"_id":"1"}}
            {"update": {"_id":"1002"}}
                {"doc": {"price": 655.33}}
        updating without specifying index in the POST
            POST _bulk
            {"update": {"_id":"222", "_index": "myindex", "_type": "products"}}
                {"doc": {"price": 655.33}}
        ****schemas
        GET documents by the id
            GET /myindex/product/{id} , the response will have a source if something was found
            examples
                GET /myindex/product/_search?q=* // get all
                GET /myindex/product/_search?q=pasta // in all the fields
                GET /myindex/product/_search?q=name:pasta // only in the name
                GET /myindex/product/_search?q=name:(pasta AND spagetti)
                GET /myindex/product/_search?q=name:"pasta spagetti" // ^ same, order must be the same pasta first
                GET /myindex/product/_search?q=name:(pasta OR spagetti)
                GET /myindex/product/_search?q=name:pasta spagetti // ^ same, order must be the same pasta first
                GET /myindex/product/_search?q=name:+pasta AND -spagetti // pasta must be there, spagetti must NOT be there
                GET /myindex/product/_search?q=name:((pasta OR spagetti) AND description:something)
                * using analyzer search everywhere for matching text
                GET /_analyze?analyzer=standard&text=Pasta - Spagetti
        Query DSL
            { 'query': { 'matching_all': {} } } // get all
            { 'query': { 'term': {'city': 'new-york'} } } // has it in the city
            { 'query': { 'match_pharse': {'name': 'something'} } } // get names that has something ignores caps-lock
            ** JOIN with must match and should match
            {
                'query': {
                    'bool': {
                        'must': [{'term': {'city': 'new-york'}}],
                        'should': [{'match_pharse': {'name': {'query': 'dsfsd', 'slop': 2, 'boost': 2}}}]
                    }                                   // slop and boost control how important each clause is
                }   
            }
            *********************************
            ** Aggregations (also used for data anlyzing and logs etc...)
                // install Aggregator exmp: (sum, acerage, price) , for each matching doc puts an aggregator: "intresting (ex price), add aggregator" return result from aggregator
            {
                'query': {
                    'match_all': {}
                },
                'aggs': { // add new section below the regular query
                    'by_city': {
                        'terms': { // count agg grouped by cities
                            'field': 'city'
                        }
                    },
                    'by_price': { // also do histogram agg for the price with interval of 10
                        'histogram': {
                            'field': 'price',
                            'interval': 10
                        }
                    }
                }
            }       // RESULT, will have new section called "aggregations"
            *********************************
            Compound Queries (like Where or if)
            {
                "query": {
                    "bool": {
                        "must": [ // all must be match like &&
                            {"match": {"name": "something"},
                            {"match": {"name": "something22"}
                        ],
                        "must_not": [
                            {"match": {"name": "something221"}
                        ],
                        "should": [  // affect only the relevance score if there's no MUST then the should become a must
                            {"match": {"name": "something"}
                        ]
                    }
                }
            }
            // https://www.youtube.com/watch?v=ybu8XwbwXCQ









****** Laravel with elastic search *******
** Build Elastic search Client
    use ElasticSearch\ClientBuilder; use Elastica\Client as ElasticaClient;
    class .... {
        public function __construct() {
            $this => elasticsearch = ClientBuilder::create()->build();
            $config = [
                'host' => 'localhost',
                'port' => 9200,
                'index' => 'pets'
            ];

             $this => elastica = new ElesticaClient($config);
        }
    }

// https://www.youtube.com/watch?v=qWuDGrCgGWc&list=PLTgRMOcmRb3MSCtihaixQ25_73vQi5TNL&index=3