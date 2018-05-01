*** Middlewares ***

web.php
    Route::{..some route..})->middleware('test');

register 'test' in Http/Karnel.php
    protected $routeMiddleware = [
        ...
        'test' => \App\Http\Middleware\test::class
    ];

test.php // the middleware file (needs to be in middleware folder)
    class test {
        public function handle($request) {
            some logic...
            return $next($request);
                // ^ move on to the route
        }
    }

>> Middleware through Controller (construct), instead of web.php
controller php
    public function __construct() {
        $this->middleware('test');
    }       // every function will go through this middleware


>> Group of Middlewares, instead of $this->middleware('test1','test2','test3',....);
controller php
    public function __construct() {
        $this->middleware('myMiddlewareGroup');
    }

in Http/Karnel.php
    protected $middlewareGroups = [
        ....,
        'myMiddlewareGroup' => [
            \App\Http\Middleware\test1,
            \App\Http\Middleware\test2,
            \App\Http\Middleware\test3,
        ]
    ];

>> Middleware with Arguments
web.php
    Route::{..some route..})->middleware('test:admin');
                                                ^ not a virable will always be passed

test.php // the middleware file
    class test {
        public function handle($request, $name) {
            if ($userController.getName == $name) {
                return $next($request);
            } else {
                throw new \Exception("only admin allowed")
            }
        }
    }





*** Class ***

<?php
namespace path\myClass;

class myClass 
{
    public function something()
    {
        return "test";
    }
}
?>

<< Extend Class

<?php
namespace path\myClass\subClass;

class myClass extends subClass
{
    ...
}
?>