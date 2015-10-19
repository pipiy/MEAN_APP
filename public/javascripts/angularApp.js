var app = angular.module("flapperNews", ['ui.router']);
app.controller("MainCtrl", ['$scope', 'posts', function($scope, posts){
	$scope.posts = posts.posts;

	$scope.addPost = function(){
		$scope.posts.push(
			{
				title: 	$scope.title,
				link: 	$scope.link,
				upvotes: 0,
				comments: []
			});
		$scope.title = '';
		$scope.link = '';
	};
	$scope.incrementUpvotes = function(post){
		post.upvotes += 1;
	};
}]);

app.controller("PostsCtrl", ['$scope', '$stateParams', 'posts', function($scope, $stateParams, posts){
	$scope.post = posts.posts[$stateParams.id]

	$scope.addComment = function(){
		$scope.post.comments.push({
			author: 	$scope.user,
			body: 		$scope.body,
			upvotes: 	0
		})
		$scope.user = '';
		$scope.body = '';
	};

	$scope.incrementUpvotes = function(comment){
		comment.upvotes +=1;
	};
}]);

app.factory("posts", function(){
	var o = {
		posts: []
	}
	return o;
});

app.config(["$stateProvider", "$urlRouterProvider", 
	function($stateProvider, $urlRouterProvider){
		$stateProvider
			.state('home', {
				url: '/home',
				templateUrl: '/home.html',
				controller: 'MainCtrl'
			});
		$urlRouterProvider.otherwise('/home');
		$stateProvider.state('post', {
			url: '/posts/{id}',
			templateUrl: '/posts.html',
			controller: 'PostsCtrl'
		});
	}]);