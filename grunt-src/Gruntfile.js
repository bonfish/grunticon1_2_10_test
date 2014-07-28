module.exports = function(grunt){
	var config = {
		// Конфигурацию берём отсюда
		pkg:grunt.file.readJSON('package.json'),
		// Переменные
		meta:{
			tmpDir:'.temp/',
			srcRoot:'./',
			destRoot:'../assets/',
			tplDir:'../templates/',
			banner:"/* by bonflash | bonfable at ulanovka dot ru | 2014 */\n",
		},
		// SASS
		sass:{
			options:{
				style:'compressed',				
			},
			// основной стиль
			mainStyle:{
				files:[{
					expand:true,
					cwd:'scss/',
					src:'*.scss',
					dest:'../assets/css/',
					ext:'.min.css',
					extDot:'last'
				}],
			}
		},
		// сжимаем JS
		uglify:{
			options:{
				preserveComments:'some',
			},
			regularJS:{
				options:{
					banner:'<%= meta.banner %>',
				},
				files:{
					'../assets/js/scripts.min.js': ['js/*.js'],
				}
			}
		},
		// Оптимизируем SVG
		svgmin:{
			options:{
				plugins:[
					{cleanupIDs:{minify:false}},
					{removeRasterImages:false},
					{removeTitle:false},
					{removeXMLProcInst:false},
					{cleanupNumericValues:{floatPrecision:0}},
				]
			},
			icons:{
				files:[{
					expand:true,
					cwd:'img/svg/',
					src:['**/*.svg', '!map-pin.svg'],
					dest:'.temp/img/svg/',
					
				}],
			},
			careful:{
				options:{
					plugins:[
						{convertPathData:false},
						{cleanupIDs:{minify:false}},
						{removeRasterImages:false},
						{removeTitle:false},
						{removeXMLProcInst:false},
						{cleanupNumericValues:{floatPrecision:0}},
					]
				},
				files:[{
					expand:true,
					cwd:'img/svg/',
					src:'map-pin.svg',
					dest:'.temp/img/svg/',
					
				}],
			}
		},
		// SVG-спрайт
		grunticon:{
			icons:{
				files:[{
					expand:true,
					cwd:'.temp/img/svg/',
					src:'**/*.svg',
					dest:'',
				}],
				options: {
					datasvgcss: 'scss/sprite/sprite-svg.scss',
					datapngcss:'.temp/scss/sprite/sprite-png.scss',
					urlpngcss:'.temp/scss/sprite/sprite-png-fallback.scss',
					previewhtml: '../templates/svg.html',
					loadersnippet: 'js/grunticon.loader.js',
					pngfolder:'.temp/img/png/',
					customselectors: {
						'*': ['.with-icon-$1:before'],
					},
					previewTemplate: 'hbs/html-template.hbs',
					template:'hbs/svg-template.hbs',
					
				}
			}
		},
		// Отслеживаем
		watch:{
			js:{
				files:['js/*.js'],
				tasks:['newer:uglify']
			},
			libJS:{
				files:['js/libs/**/*.js'],
				tasks:['processJSLibs']
			},
			sass:{
				files:['scss/**/*.scss'],
				tasks:['newer:sass:mainStyle']
			},
			livereload: {
				options: { livereload: 35727 },
				files: [
					'../assets/css/**/*.css', 
					'../templates/**/*.html', 
					'../assets/js/**/*.js', 
				],
			},
		},
	}
	grunt.initConfig(config);

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-newer');
	grunt.loadNpmTasks('grunt-grunticon');
	grunt.loadNpmTasks('grunt-svgmin');
	grunt.loadNpmTasks('grunt-spritesmith');
	
	grunt.registerTask('default', "Задача по умолчанию: геренируем CSS, JS (если исходники изменены), запускаем Watch", ['newer:sass', 'newer:uglify','watch']);
	grunt.registerTask('icons', "Minify SVG, Create sprites", ['newer:svgmin', 'grunticon']);
}