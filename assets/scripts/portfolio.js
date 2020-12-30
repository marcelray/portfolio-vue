document.addEventListener("DOMContentLoaded", () => app.start());
window.addEventListener('hashchange', () => app.onHashChange(), false);

class Project {
	id = ""
	category = ""
	colophone = ""
	date = "2000-01-01"
	description = ""
	display = false
	media = []
	links = []
	responsibilities = ""
	tags = []
	title = "test"
	color = "#ff00ff"
	imageUrl = "https://source.unsplash.com/random"
	client = "marcelray"

	static getFromJson(json) {
		let project = new Project();
		for (let prop in json) {
			project[prop] = json[prop];
		}
		return project;
	}
}

const app = new Vue({
	el: '#mr--app',
	data: {
		projects: [],
		projectGroups: [],
		currentProject: null,
	},
	methods: {
		start: function() {
			fetch('assets/data/projects.json').then(response => response.json()).then((json) => this.onProjectDataLoaded(json));
		},
		showProjectDetails: function(project) {
			this.currentProject = project;
			$('body,html').addClass('mr--no-scroll');
			// Re-show horizontal scroll indicator
			$(document).find('.mr--scroll-arrow-right').show();
		},
		hideProjectDetails: function() {
			location.hash = 'home';
			this.currentProject = null;
			$('body,html').removeClass('mr--no-scroll');
		},
		getProjectById: function(id) {
			// TODO: Optimize this
			const matches = this.projects.filter( item => {
				return item.id === id;
			});
			if ( matches.length > 0 ) {
				return matches[0];
			} else {
				return null;
			}
		},
		getGroupProjects: function(group) {
			return this.projects.filter(item=>{
				return group.categories.indexOf( item.category ) >= 0;
			});
		},
		getProjectMedia: function(project, type) {
			if ( !type ) {
				return project.media;
			} else {
				return this.currentProject.media.filter(item => {
					return item.type === type;
				});
			}
		},
		onProjectDataLoaded: function(json) {
			// console.log(json);
			json.projects.forEach((item, index) => {
				this.projects.push(Project.getFromJson(item));
			})
			json.groupings.forEach((item, index) => {
				this.projectGroups.push(item);
			})
		
			if ( location.hash.length > 0 ) {
				this.onHashChange();
			}
		},
		// Handle hash changes (browser back, deep link, etc.)
		onHashChange: function() {
			const id = location.hash.substr(1);
			const project = this.getProjectById(id);
			if ( project ) {
				this.showProjectDetails( project );
			} else {
				this.hideProjectDetails();
			}
		},
		onMediaScroll: function(event) {
			// Hide horizontal scroll arrow
			// TODO: use a more specific selector
			$(document).find('.mr--scroll-arrow-right').hide();
		},
	},
	computed: {
		getCurrentProjectMedia: function(type = 'image') {
			return this.currentProject.media.filter(item => {
				return item.type === type;
			});
		}
	}
});

// Google Analytics
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-22942940-1']);
_gaq.push(['_trackPageview']);
(function()
{
	var ga = document.createElement('script');
	ga.type = 'text/javascript';
	ga.async = true;
	ga.src = ('https:' === document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(ga, s);
})();
